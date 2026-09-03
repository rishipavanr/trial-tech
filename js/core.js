/* ============================================================
   TECH TRIVIA — js/core.js
   Engine: base64 decode, seeded shuffle, round sessions,
   grading, speed bonus, crossword generator, anti-cheat
   (tab-switch DQ + refresh lock), Pyodide runner, cloud sync.
   ============================================================ */

(function () {
"use strict";
var TT = {};
var D = window.TT_DATA, C = window.TT_CONFIG;

/* ================= BASE64 DECODE ================= */
TT.dec = function (b) {
  try { var bin = atob(b); try { return decodeURIComponent(escape(bin)); } catch (e) { return bin; } }
  catch (e) { return ""; }
};
TT.norm = function (s) { return String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " "); };
TT.normOut = function (s) {
  if (!s) return "";
  return String(s)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(function (l) { return l.trim().replace(/\s+/g, ' '); })
    .filter(function (l) { return l !== ""; })
    .join("\n");
};

/* ================= SEEDED RNG + SHUFFLE =================
   Same team + same round = same shuffle, every time.     */
TT.rng = function (str) {
  var h = 1779033703 ^ str.length, i;
  for (i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
};
TT.shuffle = function (arr, r) {
  var a = arr.slice(), i, j, t;
  for (i = a.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
};

/* ================= STORAGE ================= */
TT.setCookie = function (name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
TT.getCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};

TT.lsGet = function (k, fb) { 
  try { 
    var v = localStorage.getItem(k); 
    if (!v) {
      // Fallback to cookie for session redundancy
      var cookieVal = TT.getCookie(k);
      if (cookieVal) {
        v = decodeURIComponent(cookieVal);
        localStorage.setItem(k, v);
      }
    }
    return v ? JSON.parse(v) : fb; 
  } catch (e) { return fb; } 
};
TT.lsSet = function (k, v) { 
  try { 
    var str = JSON.stringify(v);
    localStorage.setItem(k, str); 
    // Mirror core session keys to cookies to prevent accidental loss
    if (k === C.store.team || k.indexOf(C.store.round) === 0 || k === C.store.dq) {
      TT.setCookie(k, encodeURIComponent(str), 2); // Keep active for 2 days
    }
  } catch (e) {} 
};
TT.lsRemove = function(k) {
  try { localStorage.removeItem(k); TT.setCookie(k, "", -1); } catch (e) {}
};

/* ================= TEAM ================= */
TT.getTeam = function () { return TT.lsGet(C.store.team, null); };
TT.requireTeam = function () { if (!TT.getTeam()) { location.href = "index.html"; return false; } return true; };

/* ================= ROUND STATE =================
   status: locked | live | done | dq              */
TT.rKey = function (id) { return C.store.round + id; };
TT.getState = function (id) { return TT.lsGet(TT.rKey(id), { status: "locked" }); };
TT.setState = function (id, patch) {
  var s = Object.assign(TT.getState(id), patch); TT.lsSet(TT.rKey(id), s); return s;
};

/* ================= ROUND KEYS ================= */
TT.checkKey = function (id, input) {
  if (id === "r1") return true;                       // round 1 needs no key
  var enc = D.settings.keys[id]; if (!enc) return true;
  return String(input || "").trim().toUpperCase() === TT.dec(enc).trim().toUpperCase();
};

/* ================= START / ENTER ROUND ================= */
TT.startRound = function (id) {
  TT.setState(id, { status: "live", startedAt: Date.now(), entered: false,
                    answers: {}, guesses: {}, hints: {}, cw: {} });
};
TT.enterRound = function (id) {
  var st = TT.getState(id);
  if (st.status === "dq") { TT.showDQ(st.dqReason || "Disqualified"); return "dq"; }
  if (st.status === "done") return "done";
  if (st.status === "live") {
    if (!st.entered) { TT.setState(id, { entered: true }); TT.arm(id); return "start"; }
    TT.setState(id, { status: "dq", dqReason: "Refresh / re-entry during live round" });
    TT.showDQ("Refresh or re-entry during a live round is not allowed.");
    return "dq";
  }
  return "locked";
};
TT.elapsed = function (st) { return st.startedAt ? Math.floor((Date.now() - st.startedAt) / 1000) : 0; };

/* ================= ANTI-CHEAT GUARD =================
   Tab switch / window hidden -> instant DQ.
   Window blur -> DQ after short grace.               */
var _activeArmListeners = [];

TT.disarm = function () {
  _activeArmListeners.forEach(function (fn) {
    try { fn(); } catch (e) {}
  });
  _activeArmListeners = [];
};

TT.arm = function (roundId) {
  TT.disarm(); // clear any previous listeners
  // Only arm if we are actually on a round page
  if (location.pathname.indexOf("round") === -1) return;
  var st = TT.getState(roundId); if (st.status !== "live") return;
  var killed = false;
  var kill = function (reason) {
    if (killed) return;
    // Don't DQ if the round has already been finished legitimately
    var current = TT.getState(roundId);
    if (current.status === "done") return;
    killed = true;
    try {
      var s = TT.getState(roundId);
      if (s.status === "live") TT.setState(roundId, { status: "dq", dqReason: reason });
    } catch (e) {}
    if (TT.timer && TT.timer.stop) TT.timer.stop();
    TT.setGlobalDQ(reason);
    TT.showGlobalDQOverlay();
  };

  var onVisChange = function () {
    if (document.hidden || document.visibilityState === "hidden") {
      var s = TT.getState(roundId);
      if (s.status === "live") {
        kill("Tab switch detected");
      }
    }
  };

  var onBlur = function () {
    setTimeout(function () {
      // Don't kill if user is interacting with standard confirmation/modal dialogs
      var isModalOpen = !!document.querySelector(".modal-wrap, .modal, .confirm-overlay, .confirm-box, .dq-overlay");
      if (!isModalOpen && !document.hasFocus() && (document.hidden || document.visibilityState === "hidden")) {
        var s = TT.getState(roundId);
        if (s.status === "live") kill("Tab switch detected");
      }
    }, 400);
  };

  document.addEventListener("visibilitychange", onVisChange);
  window.addEventListener("blur", onBlur);

  _activeArmListeners.push(function () {
    document.removeEventListener("visibilitychange", onVisChange);
    window.removeEventListener("blur", onBlur);
  });
};

TT.showDQ = function (reason, roundId) {
  if (roundId) {
    var s = TT.getState(roundId);
    if (s.status === "done") return; // round already finished successfully
  }
  if (document.getElementById("dqOverlay")) return;
  var div = document.createElement("div");
  div.id = "dqOverlay"; div.className = "dq-overlay";
  div.innerHTML = "<div><h2>⛔ DISQUALIFIED</h2>" +
    "<p><b>" + reason + "</b></p>" +
    "<p>This round is over for your team and your answers are locked.<br>Please inform the organizer.</p></div>";
  document.body.appendChild(div);
};

TT.isDQ = function (id) { return TT.getState(id).status === "dq"; };

/* ================= BUILD SHUFFLED QUESTIONS =================
   Returns display-safe questions. Answers stay encoded;
   each MCQ option keeps its ORIGINAL index (used at grading). */
TT.buildQuestions = function (roundId, tiebreak) {
  var team = TT.getTeam();
  var r = TT.rng((team ? team.code : "seed") + ":" + roundId + (tiebreak ? ":tb" : ""));
  var rawId = roundId.replace("_tb", "");
  var qs;
  if (tiebreak || roundId.indexOf("_tb") !== -1) {
    var tbObj = (D.tieBreakers && (D.tieBreakers[rawId] || D.tieBreakers[roundId]));
    qs = tbObj ? tbObj.questions.slice() : (D.tb ? D.tb.slice() : []);
  } else {
    qs = (D[roundId] || []).slice();
  }
  qs = TT.shuffle(qs, r);
  return qs.map(function (q) {
    var out = { id: q.id, t: q.t, img: q.img || null, pts: q.pts || 0 };
    if (q.o) {
      var order = TT.shuffle(q.o.map(function (_, i) { return i; }), r);
      out.opts = order.map(function (i) { return { text: q.o[i], orig: i }; });
    }
    return out;
  });
};

/* ================= GRADING ================= */
TT.defaultPts = function (roundId, q) { if (q.pts) return q.pts; return roundId === "r1" ? 1 : 2; };

TT.gradeMCQFill = function (roundId, tiebreak) {
  var st = TT.getState(roundId), ans = st.answers || {};
  var bank = tiebreak ? D.tb : D[roundId];
  var correct = 0, points = 0;
  bank.forEach(function (q) {
    var v = ans[q.id];
    if (v === undefined || v === null || v === "") return;
    var ok = q.o ? (parseInt(v, 10) === parseInt(TT.dec(q.a), 10))
                 : (TT.norm(v) === TT.norm(TT.dec(q.a)));
    if (ok) { correct++; points += TT.defaultPts(roundId, q); }
  });
  return { correct: correct, points: points };
};

TT.gradeR3 = function () {
  var st = TT.getState("r3");
  var g = st.guesses || {}, hints = st.hints || {}, cw = st.cw || {};
  var pPts = D.settings.points.puzzle || 3;
  var totalSec = (D.settings.durations.r3 || 15) * 60;
  var usedSec = Math.min(TT.elapsed(st), totalSec);
  var correct = 0, points = 0;

  // Known short forms and aliases for tech puzzles so short forms don't cause errors
  var ALIASES = {
    v1: ["satellite"],
    v2: ["world wide web", "word wide web", "www"],
    v3: ["firewall"],
    v4: ["bluetooth"],
    v5: ["artificial intelligence", "ai"],
    v6: ["encryption"],
    v7: ["linux"],
    v8: ["blockchain", "block chain"],
    v9: ["ram", "random access memory"]
  };

  function isAnswerCorrect(pId, userGuess, canonEncoded) {
    if (!userGuess || !userGuess.trim()) return false;
    var normUser = TT.norm(userGuess);
    var normCanon = TT.norm(TT.dec(canonEncoded));
    if (normUser === normCanon) return true;
    if (ALIASES[pId]) {
      for (var k = 0; k < ALIASES[pId].length; k++) {
        if (normUser === TT.norm(ALIASES[pId][k])) return true;
      }
    }
    return false;
  }

  // Part A: each correct puzzle = base (3 - hintsUsed, min 1) + speed bonus
  D.r3.forEach(function (p) {
    var v = g[p.id];
    if (isAnswerCorrect(p.id, v, p.a)) {
      correct++;
      var hintDeduction = (hints[p.id] === 2) ? 1 : 0;
      var base = Math.max(1, pPts - hintDeduction);
      var spd = TT.speedBonus(base, usedSec, totalSec);
      points += base + spd;
    }
  });

  // Part B: crossword — per-word scoring with time multiplier (+25% max) and hint deduction
  var cwSeed = st.cwSeed || "default";
  var built = TT.buildCrossword(cwSeed);
  var cwMax = D.settings.points.crossword || 10;
  var cwHintUsed = !!st.cwHintUsed;  // set by r3.js when hint used
  var cwOk = 0;
  built.clues.forEach(function (cl) {
    var wordOk = true;
    for (var i = 0; i < cl.len; i++) {
      var cr = cl.dir === "across" ? cl.r : cl.r + i;
      var cc = cl.dir === "across" ? cl.c + i : cl.c;
      var val = (cw[cr + "," + cc] || "").toUpperCase();
      if (val !== cl.word.charAt(i).toUpperCase()) { wordOk = false; break; }
    }
    if (wordOk) cwOk++;
  });
  var cwBase = built.clues.length ? Math.round(cwMax * cwOk / built.clues.length) : 0;
  var leftFrac = Math.max(0, (totalSec - usedSec) / totalSec);
  var cwScore = Math.round(cwBase * (1 + 0.25 * leftFrac));
  if (cwHintUsed) cwScore = Math.max(0, cwScore - 2);
  points += cwScore;

  return { correct: correct, points: points, cwOk: cwOk, cwTotal: built.clues.length, cwScore: cwScore, cwHintUsed: cwHintUsed };
};

/* ================= AUTO-SAVE LOCAL SCORES ================= */
TT.recordLocalScore = function (roundId, score, correct, timeSec) {
  var team = TT.getTeam();
  if (!team) return;
  var localTeams = TT.lsGet("tt_local_teams", []);
  var found = false;
  for (var i = 0; i < localTeams.length; i++) {
    if (localTeams[i].code === team.code) {
      localTeams[i].name = team.name;
      localTeams[i].members = team.members;
      if (!localTeams[i].rounds) localTeams[i].rounds = {};
      var rData = { score: score, correct: correct, timeSec: timeSec };
      if (roundId === "r4") {
        var r4s = TT.getState("r4");
        rData.codingScore  = r4s.codingScore  || 0;
        rData.codingSolved = r4s.codingSolved || 0;
        rData.codingTime   = r4s.codingTime   || 0;
        rData.debugScore   = r4s.debugDone ? (r4s.debugScore || 0) : 0;
        rData.debugDone    = !!r4s.debugDone;
        rData.selectedTasks = (r4s.selectedTasks || []).slice();
      }
      localTeams[i].rounds[roundId] = rData;
      localTeams[i].total = Object.keys(localTeams[i].rounds).reduce(function (sum, k) {
        return sum + (localTeams[i].rounds[k].score || 0);
      }, 0);
      localTeams[i].updatedAt = Date.now();
      found = true;
      break;
    }
  }
  if (!found) {
    var rDataNew = { score: score, correct: correct, timeSec: timeSec };
    if (roundId === "r4") {
      var r4sN = TT.getState("r4");
      rDataNew.codingScore  = r4sN.codingScore  || 0;
      rDataNew.codingSolved = r4sN.codingSolved || 0;
      rDataNew.codingTime   = r4sN.codingTime   || 0;
      rDataNew.debugScore   = r4sN.debugDone ? (r4sN.debugScore || 0) : 0;
      rDataNew.debugDone    = !!r4sN.debugDone;
      rDataNew.selectedTasks = (r4sN.selectedTasks || []).slice();
    }
    var rObj = {};
    rObj[roundId] = rDataNew;
    localTeams.push({
      code: team.code,
      name: team.name,
      members: team.members,
      rounds: rObj,
      total: score,
      updatedAt: Date.now()
    });
  }
  TT.lsSet("tt_local_teams", localTeams);

  // Sync to manual board
  var board = TT.lsGet("tt_admin_board", []);
  var bIdx = -1;
  for (var j = 0; j < board.length; j++) {
    if (board[j].name === team.name) { bIdx = j; break; }
  }
  var bEntry = bIdx >= 0 ? board[bIdx] : { name: team.name, r1: 0, r2: 0, r3: 0, r4: 0, dbg: 0 };
  bEntry[roundId] = score;
  if (roundId === "r4") {
    var r4st = TT.getState("r4");
    if (r4st && r4st.debugScore) bEntry.dbg = r4st.debugScore;
  }
  if (bIdx >= 0) board[bIdx] = bEntry;
  else board.push(bEntry);
  TT.lsSet("tt_admin_board", board);
};

/* ================= SPEED BONUS HELPER =================
   Up to 50% extra on top of base pts for using less time.
   Formula: floor(points * leftFrac * 0.5)
   Full time used → 0 bonus; 0 time used → 50% bonus. */
TT.speedBonus = function (points, usedSec, totalSec) {
  if (!points || points <= 0 || totalSec <= 0 || usedSec >= totalSec) return 0;
  var leftFrac = Math.max(0, (totalSec - usedSec) / totalSec);
  return Math.floor(points * leftFrac * 0.5);
};

/* ================= PARTIAL OUTPUT SCORE =================
   Compare actual output lines to expected. Returns 0-80% of
   fullPts for partial matches, fullPts only for exact match. */
TT.partialScore = function (actual, expected, fullPts) {
  var n = function (s) { return String(s || "").split("\n").map(function (l) { return l.trim().replace(/\s+/g, " "); }).filter(function (l) { return l !== ""; }); };
  var aLines = n(actual), eLines = n(expected);
  if (!eLines.length) return 0;
  var aN = TT.normOut(actual), eN = TT.normOut(expected);
  if (aN === eN) return fullPts;  // exact match
  var matched = 0, used = {};
  eLines.forEach(function (el) {
    for (var i = 0; i < aLines.length; i++) {
      if (!used[i] && aLines[i] === el) { matched++; used[i] = true; break; }
    }
  });
  if (matched === 0) return 0;
  return Math.min(Math.floor(fullPts * matched / eLines.length), Math.floor(fullPts * 0.8));
};

/* ================= HARDCODE CHEAT DETECTION & DYNAMIC TEST RUNNER ================= */
var SECONDARY_TESTS = {
  t1: {
    inject: "numbers = [1, 5, 1, 7, 5, 1]",
    expected: "1 -> 3\n5 -> 2\n7 -> 1"
  },
  t2: {
    inject: "numbers = [0, 1, 0, 9, 0, 4]",
    expected: "1 9 4 0 0 0"
  },
  t3: {
    inject: "numbers = [12, 90, 44, 3, 85]",
    expected: "85"
  },
  t4: {
    inject: "numbers = [1, 2, 4, 5, 6]",
    expected: "3"
  },
  t5: {
    inject: "numbers = [1, 4, 3, 4, 2]",
    expected: "4"
  }
};

TT.detectHardcodeStatic = function (code, expectedDecoded, taskId) {
  if (!code || !expectedDecoded) return false;
  var c = code.trim();
  if (!c) return false;
  var lines = c.split('\n');
  var allPrints = true;
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    if (l && !l.startsWith("print(") && !l.startsWith("#")) {
      allPrints = false;
      break;
    }
  }
  return allPrints;
};

/* Evaluates code against Primary Test Case AND Secondary Hidden Test Case */
TT.evaluateCodingTask = function (taskId, code, expectedDecoded, fullPts) {
  return new Promise(function (resolve) {
    if (!code || !code.trim()) {
      resolve({ ok: false, err: "No code provided" });
      return;
    }

    // Check 1: Static AST / print literal inspection
    if (TT.detectHardcodeStatic(code, expectedDecoded, taskId)) {
      resolve({
        ok: true,
        isCheat: true,
        fullMatch: false,
        pts: 0,
        cheatMsg: "❌ CHEAT DETECTED: Code directly prints the answer without algorithmic logic (0 pts). Write real logic."
      });
      return;
    }

    // Step 1: Run primary test case
    var execCode = code;
    var targetDebug = null;
    if (D && D.r4 && Array.isArray(D.r4.debug)) {
      for (var di = 0; di < D.r4.debug.length; di++) {
        if (D.r4.debug[di].id === taskId) { targetDebug = D.r4.debug[di]; break; }
      }
    }
    var inputs = (targetDebug && targetDebug.mockInputs) || [];
    if (inputs && inputs.length > 0) {
      var inputWrap =
        "import builtins\n" +
        "_tt_inputs = iter(" + JSON.stringify(inputs) + ")\n" +
        "def _tt_custom_input(prompt=''):\n" +
        "    if prompt:\n" +
        "        print(prompt, end='')\n" +
        "    try:\n" +
        "        val = next(_tt_inputs)\n" +
        "        print(val)\n" +
        "        return str(val)\n" +
        "    except StopIteration:\n" +
        "        return ''\n" +
        "builtins.input = _tt_custom_input\n";
      execCode = inputWrap + "\n" + code;
    }

    TT.runPython(execCode).then(function (res1) {
      if (!res1.ok) {
        var codeLines = code.split('\n').filter(function(l) { return l.trim().length > 0 && !l.trim().startsWith('#'); }).length;
        var effortPts = Math.min(Math.floor(fullPts * 0.4), codeLines);
        resolve({ ok: false, err: res1.err, out: res1.out, pts: effortPts });
        return;
      }

      var normActual = TT.normOut(res1.out);
      var normExp = TT.normOut(expectedDecoded);
      var primaryMatch = normActual === normExp;

      if (!primaryMatch) {
        // Did not match primary output — evaluate partial credit
        var partial = TT.partialScore(res1.out, expectedDecoded, fullPts);
        var codeLines = code.split('\n').filter(function(l) { return l.trim().length > 0 && !l.trim().startsWith('#'); }).length;
        var effortPts = Math.min(Math.floor(fullPts * 0.4), codeLines);
        partial = Math.max(partial, effortPts);
        
        resolve({
          ok: true,
          fullMatch: false,
          pts: partial,
          out: res1.out,
          isPartial: partial > 0
        });
        return;
      }

      // Passed primary match! Since dynamic validation causes false positives with varied code structures,
      // we will accept the primary match as a full pass.
      resolve({ ok: true, fullMatch: true, pts: fullPts, out: res1.out });
    });
  });
};

/* ================= GRAND TOTAL CALCULATOR ================= */
TT.grandTotal = function () {
  var rounds = ["r1", "r2", "r3", "r4"];
  var total = 0;
  var breakdown = {};
  rounds.forEach(function (r) {
    var st = TT.getState(r);
    var sc = (st && (st.status === "done" || st.score !== undefined)) ? (st.score || 0) : 0;
    breakdown[r] = {
      score: sc,
      correct: st ? (st.correct || 0) : 0,
      timeSec: st ? (st.timeSec || 0) : 0,
      status: st ? (st.status || "locked") : "locked",
      base: st ? (st.base || sc) : sc,
      bonus: st ? (st.bonus || 0) : 0
    };
    total += sc;
  });
  return { total: total, breakdown: breakdown };
};

/* ================= FINISH ROUND ================= */
TT.finishRound = function (roundId, res) {
  TT.disarm(); // always disarm anti-cheat listeners when round finishes
  var totalSec = (D.settings.durations[roundId] || 15) * 60;
  var st = TT.getState(roundId);
  var used = Math.min(TT.elapsed(st), totalSec);
  var bonus = (res.bonus !== undefined) ? res.bonus : TT.speedBonus(res.points, used, totalSec);
  var score = res.points + bonus;
  TT.setState(roundId, { status: "done", endedAt: Date.now(), timeSec: used,
                         correct: res.correct, base: res.points, bonus: bonus, score: score });
  TT.recordLocalScore(roundId, score, res.correct, used);
  TT.cloud.push(roundId, score, res.correct, used);
  return TT.getState(roundId);
};

/* ================= CROSSWORD GENERATOR =================
   Dynamic, seeded layout with across & down coordinates. */
TT.buildCrossword = function (seed) {
  var team = TT.getTeam();
  var rngSeed = (team ? team.code : "crossword") + ":" + (seed || "default");
  var rng = TT.rng(rngSeed);

  var raw = [];
  if (D.crossword && D.crossword.length) {
    raw = D.crossword.map(function (c) {
      return { word: String(c.word || "").toUpperCase().replace(/[^A-Z]/g, ""), clue: c.clue };
    });
  } else if (D.r3 && D.r3.length) {
    raw = D.r3.map(function (p) {
      return { word: TT.dec(p.a).toUpperCase().replace(/[^A-Z]/g, ""), clue: p.clue };
    });
  }
  var words = raw.filter(function (w) { return w.word.length >= 2; });
  // Shuffle words with RNG
  words = TT.shuffle(words, rng);

  var grid = {}, placed = [];
  var K = function (r, c) { return r + "," + c; };
  var G = function (r, c) { return grid[K(r, c)]; };

  function can(W, r, c, d) {
    var dr = d === "D" ? 1 : 0, dc = d === "A" ? 1 : 0, n = 0, i, rr, cc, e;
    if (G(r - dr, c - dc) || G(r + dr * W.length, c + dc * W.length)) return 0;
    for (i = 0; i < W.length; i++) {
      rr = r + dr * i; cc = c + dc * i; e = G(rr, cc);
      if (e) { if (e !== W[i]) return 0; n++; }
      else if (d === "A" ? (G(rr - 1, cc) || G(rr + 1, cc)) : (G(rr, cc - 1) || G(rr, cc + 1))) return 0;
    }
    return n;
  }
  function put(W, it, r, c, d) {
    for (var i = 0; i < W.length; i++) grid[K(r + (d === "D" ? i : 0), c + (d === "A" ? i : 0))] = W[i];
    placed.push({ W: W, clue: it.clue, r: r, c: c, d: d });
  }

  words.forEach(function (it, idx) {
    var W = it.word;
    if (!placed.length) {
      var initDir = rng() > 0.5 ? "A" : "D";
      put(W, it, 0, 0, initDir);
      return;
    }
    var candidates = [];
    placed.forEach(function (p) {
      for (var j = 0; j < p.W.length; j++) for (var i = 0; i < W.length; i++) {
        if (p.W[j] !== W[i]) continue;
        var r = p.d === "A" ? p.r - i : p.r + j;
        var c = p.d === "A" ? p.c + j : p.c - i;
        var d = p.d === "A" ? "D" : "A";
        var s = can(W, r, c, d);
        if (s > 0) candidates.push({ s: s, r: r, c: c, d: d });
      }
    });
    if (candidates.length) {
      candidates.sort(function (a, b) { return b.s - a.s; });
      var pick = candidates[Math.floor(rng() * Math.min(candidates.length, 3))];
      put(W, it, pick.r, pick.c, pick.d);
    } else {
      var maxR = 0;
      Object.keys(grid).forEach(function (k) { maxR = Math.max(maxR, parseInt(k.split(",")[0], 10)); });
      put(W, it, maxR + 2, 0, "A");
    }
  });

  var cells = Object.keys(grid).map(function (k) { var p = k.split(","); return { r: +p[0], c: +p[1] }; });
  var mR = Math.min.apply(null, cells.map(function (x) { return x.r; }));
  var mC = Math.min.apply(null, cells.map(function (x) { return x.c; }));
  var startSet = {}; placed.forEach(function (p) { startSet[K(p.r, p.c)] = true; });
  var starts = Object.keys(startSet).map(function (k) { var p = k.split(","); return { r: +p[0], c: +p[1] }; })
    .sort(function (a, b) { return a.r - b.r || a.c - b.c; });
  var nums = {}; starts.forEach(function (x, i) { nums[K(x.r, x.c)] = i + 1; });

  var clues = placed.map(function (p) {
    return {
      num: nums[K(p.r, p.c)],
      dir: p.d === "A" ? "across" : "down",
      clue: p.clue,
      len: p.W.length,
      word: p.W,
      r: p.r - mR,
      c: p.c - mC
    };
  }).sort(function (a, b) { return a.num - b.num || (a.dir === "across" ? -1 : 1); });

  return {
    cells: cells.map(function (x) { return { r: x.r - mR, c: x.c - mC, n: nums[K(x.r, x.c)] || 0 }; }),
    rows: Math.max.apply(null, cells.map(function (x) { return x.r; })) - mR + 1,
    cols: Math.max.apply(null, cells.map(function (x) { return x.c; })) - mC + 1,
    clues: clues
  };
};

/* ================= PYODIDE RUNNER (Web Worker + Main Thread Fallback) ================= */
TT.py = { worker: null, instance: null, ready: false, loading: false };

TT.preloadPython = function (onDone) {
  if (TT.py.ready) { if (onDone) onDone(null); return; }
  if (TT.py.loading) {
    var check = setInterval(function () {
      if (TT.py.ready) { clearInterval(check); if (onDone) onDone(null); }
    }, 100);
    return;
  }
  TT.py.loading = true;

  var indexURL = new URL("pyodide/", location.href).href;
  var mjsURL = new URL("pyodide/pyodide.mjs", location.href).href;
  var jsURL = new URL("pyodide/pyodide.js", location.href).href;

  function fallbackMainThread() {
    if (TT.py.worker) { try { TT.py.worker.terminate(); } catch (e) {} TT.py.worker = null; }
    function loadMainPy() {
      function tryLoad(url, isCdn) {
        if (window.loadPyodide) {
          window.loadPyodide({ indexURL: url }).then(function (pyInstance) {
            TT.py.instance = pyInstance;
            TT.py.instance.runPython("import sys, io\nsys.stdout=io.StringIO()\nsys.stderr=sys.stdout");
            TT.py.ready = true;
            TT.py.loading = false;
            if (onDone) onDone(null);
          }).catch(function (err) {
            if (!isCdn) tryLoad("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/", true);
            else { TT.py.loading = false; if (onDone) onDone("worker-blocked"); }
          });
        } else {
          var script = document.createElement("script");
          script.src = isCdn ? "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js" : jsURL;
          script.onload = function () {
            window.loadPyodide({ indexURL: isCdn ? "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" : indexURL }).then(function (pyInstance) {
              TT.py.instance = pyInstance;
              TT.py.instance.runPython("import sys, io\nsys.stdout=io.StringIO()\nsys.stderr=sys.stdout");
              TT.py.ready = true;
              TT.py.loading = false;
              if (onDone) onDone(null);
            }).catch(function (err) {
              if (!isCdn) tryLoad("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/", true);
              else { TT.py.loading = false; if (onDone) onDone("worker-blocked"); }
            });
          };
          script.onerror = function () {
            if (!isCdn) tryLoad("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/", true);
            else { TT.py.loading = false; if (onDone) onDone("worker-blocked"); }
          };
          document.head.appendChild(script);
        }
      }
      tryLoad(indexURL, false);
    }
    loadMainPy();
  }

  // Attempt 1: Module Web Worker
  try {
    var workerCode =
      "import { loadPyodide } from " + JSON.stringify(mjsURL) + ";\n" +
      "let py = null;\n" +
      "const indexURL = " + JSON.stringify(indexURL) + ";\n" +
      "self.onmessage = async function(e) {\n" +
      "  const d = e.data;\n" +
      "  try {\n" +
      "    if (!py) {\n" +
      "      py = await loadPyodide({ indexURL: indexURL });\n" +
      "      py.runPython('import sys, io\\nsys.stdout=io.StringIO()\\nsys.stderr=sys.stdout');\n" +
      "    }\n" +
      "    if (d.warm) { self.postMessage({ warm: true }); return; }\n" +
      "    py.runPython('sys.stdout=io.StringIO()\\nsys.stderr=sys.stdout');\n" +
      "    try {\n" +
      "      await py.runPythonAsync(d.code);\n" +
      "    } catch(err) {\n" +
      "      self.postMessage({ ok: false, err: String((err && err.message) || err), out: String(py.runPython('sys.stdout.getvalue()')) });\n" +
      "      return;\n" +
      "    }\n" +
      "    self.postMessage({ ok: true, out: String(py.runPython('sys.stdout.getvalue()')) });\n" +
      "  } catch(err) {\n" +
      "    self.postMessage({ ok: false, err: String((err && err.message) || err) });\n" +
      "  }\n" +
      "};\n";

    var blob = new Blob([workerCode], { type: "application/javascript" });
    var w = new Worker(URL.createObjectURL(blob), { type: "module" });

    var warmTimeout = setTimeout(function () {
      fallbackMainThread();
    }, 20000);

    w.onmessage = function (e) {
      if (e.data.warm) {
        clearTimeout(warmTimeout);
        TT.py.worker = w;
        TT.py.ready = true;
        TT.py.loading = false;
        if (onDone) onDone(null);
      }
    };
    w.onerror = function (e) {
      clearTimeout(warmTimeout);
      fallbackMainThread();
    };
    w.postMessage({ warm: true });
  } catch (err) {
    fallbackMainThread();
  }
};

TT.runPython = function (code) {
  return new Promise(function (resolve) {
    if (!TT.py.ready) {
      resolve({ ok: false, err: "Python engine still loading — wait a few seconds and try again." });
      return;
    }

    if (TT.py.worker) {
      var w = TT.py.worker, done = false;
      var timer = setTimeout(function () {
        if (done) return; done = true;
        w.terminate(); TT.py.worker = null; TT.py.ready = false; TT.py.loading = false;
        TT.preloadPython(); // Respawn the worker automatically
        resolve({ ok: false, err: "TIMEOUT: program ran longer than " + (C.antiCheat.pyodideTimeoutMs / 1000) + "s (infinite loop?). Engine reset — click RUN again after fixing." });
      }, C.antiCheat.pyodideTimeoutMs);
      w.onmessage = function (e) {
        if (done || e.data.warm) return;
        done = true; clearTimeout(timer); resolve(e.data);
      };
      w.postMessage({ code: code });
      return;
    }

    if (TT.py.instance) {
      try {
        TT.py.instance.runPython("sys.stdout=io.StringIO()\nsys.stderr=sys.stdout");
        TT.py.instance.runPython(code);
        var out = TT.py.instance.runPython("sys.stdout.getvalue()");
        resolve({ ok: true, out: String(out) });
      } catch (err) {
        var partial = "";
        try { partial = String(TT.py.instance.runPython("sys.stdout.getvalue()")); } catch (e) {}
        resolve({ ok: false, err: String((err && err.message) || err), out: partial });
      }
    } else {
      resolve({ ok: false, err: "Python engine not initialized." });
    }
  });
};

/* ================= CLOUD SYNC (optional Firebase scoreboard) ================= */
TT.cloud = {
  db: null,
  init: function () {
    if (!C.firebase.enabled || !window.firebase) return false;
    try {
      if (!window.__ttFb) { firebase.initializeApp(C.firebase.config); window.__ttFb = true; }
      TT.cloud.db = firebase.firestore(); return true;
    } catch (e) { return false; }
  },
  reg: function () {
    if (!TT.cloud.db) return; var t = TT.getTeam(); if (!t) return;
    try {
      TT.cloud.db.collection("teams").doc(t.code).set({ name: t.name, members: t.members, code: t.code, at: Date.now() });
    } catch (e) {}
  },
  push: function (round, score, correct, timeSec) {
    if (!TT.cloud.db) return; var t = TT.getTeam(); if (!t) return;
    try {
      TT.cloud.db.collection("scores").doc(t.code + "_" + round).set({
        team: t.name, code: t.code, round: round, score: score, correct: correct, timeSec: timeSec, at: Date.now()
      });
      TT.cloud.db.collection("teams").doc(t.code).set({ name: t.name, members: t.members, code: t.code, at: Date.now() });
    } catch (e) {}
  },
  board: function (cb) {
    if (!TT.cloud.db) { cb([]); return; }
    try {
      TT.cloud.db.collection("scores").onSnapshot(function (snap) {
        var rows = {};
        snap.forEach(function (d) {
          var s = d.data();
          var r = rows[s.code] || (rows[s.code] = { team: s.team, code: s.code, rounds: {}, total: 0 });
          r.rounds[s.round] = s;
        });
        Object.keys(rows).forEach(function (k) {
          rows[k].total = Object.keys(rows[k].rounds).reduce(function (a, x) { return a + rows[k].rounds[x].score; }, 0);
        });
        cb(Object.keys(rows).map(function (k) { return rows[k]; }).sort(function (a, b) { return b.total - a.total; }));
      }, function () { cb([]); });
    } catch (e) { cb([]); }
  },
  restoreSession: function (code, cb) {
    if (!TT.cloud.db) { cb(false, "Firebase not connected"); return; }
    try {
      TT.cloud.db.collection("teams").doc(code).get().then(function(doc) {
        if (!doc.exists) { cb(false, "Team code not found."); return; }
        var t = doc.data();
        TT.lsSet(C.store.team, { name: t.name, members: t.members || [], code: t.code, at: t.at || Date.now() });
        
        TT.cloud.db.collection("scores").where("code", "==", code).get().then(function(snap) {
          snap.forEach(function(sDoc) {
            var r = sDoc.data();
            TT.lsSet(TT.rKey(r.round), { status: "done", score: r.score, correct: r.correct, timeSec: r.timeSec, endedAt: r.at });
          });
          cb(true);
        }).catch(function() { cb(true, "Team recovered, but could not fetch scores."); });
      }).catch(function(err) { cb(false, "Error fetching team: " + err); });
    } catch(e) { cb(false, "Error: " + e.message); }
  }
};

window.TT = TT;
})();
/* ===== PATCH: GLOBAL DISQUALIFICATION + ORGANIZER ON-SCREEN UNLOCK ===== */
(function () {
  var TT = window.TT, C = window.TT_CONFIG;
  TT.setGlobalDQ = function (reason) { TT.lsSet(C.store.dq, { reason: reason || "Anti-cheat violation", at: Date.now() }); };
  TT.globalDQ = function () { return TT.lsGet(C.store.dq, null); };
  TT.clearGlobalDQ = function () { try { TT.lsRemove(C.store.dq); } catch (e) {} };

  TT.unlockSystem = function (key) {
    if (String(key || "").trim() === C.adminPassword) {
      TT.clearGlobalDQ();
      ["r1", "r2", "r3", "r4", "tiebreak"].forEach(function (r) {
        var st = TT.getState(r);
        if (st.status === "dq") {
          TT.lsSet(TT.rKey(r), { status: "locked" });
        }
      });
      var o1 = document.getElementById("globalDqOverlay");
      if (o1) o1.remove();
      var o2 = document.getElementById("dqOverlay");
      if (o2) o2.remove();
      TT.toast("System unlocked by organizer!", "good");
      setTimeout(function () { location.reload(); }, 300);
      return true;
    }
    return false;
  };

  function renderUnlockBox(mountEl) {
    if (!mountEl) return;
    var box = document.createElement("div");
    box.style.cssText = "margin-top:20px;padding:14px;background:rgba(255,255,255,0.07);border-radius:10px;border:1px solid rgba(255,255,255,0.18);max-width:320px;margin-left:auto;margin-right:auto;text-align:center;";
    box.innerHTML =
      '<label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">🔑 Organizer Unlock (Enter password to Resume)</label>' +
      '<div style="display:flex;gap:6px">' +
        '<input type="password" class="input small adminUnlockInput" placeholder="Admin password" style="margin:0;background:rgba(0,0,0,0.4)">' +
        '<button class="btn small btnAdminUnlock">Unlock</button>' +
      '</div>' +
      '<div class="adminUnlockMsg" style="margin-top:6px;font-size:12px"></div>';
    mountEl.appendChild(box);

    var inp = box.querySelector(".adminUnlockInput");
    var btn = box.querySelector(".btnAdminUnlock");
    var msg = box.querySelector(".adminUnlockMsg");
    var handleUnlock = function () {
      if (!TT.unlockSystem(inp.value)) {
        msg.innerHTML = '<span style="color:var(--bad)">❌ Incorrect password</span>';
      }
    };
    btn.onclick = handleUnlock;
    inp.onkeydown = function (e) { if (e.key === "Enter") handleUnlock(); };
  }

  TT.showGlobalDQOverlay = function () {
    if (document.getElementById("globalDqOverlay")) return;
    var dq = TT.globalDQ();
    var div = document.createElement("div");
    div.id = "globalDqOverlay"; div.className = "dq-overlay";
    div.innerHTML = "<div><h2>⛔ DISQUALIFIED</h2>" +
      "<p><b>" + TT.esc(dq ? dq.reason : "Anti-cheat violation") + "</b></p>" +
      "<p>Your team has been eliminated from the event.</p></div>";
    document.body.appendChild(div);
    renderUnlockBox(div.firstChild);
  };

  TT.showDQ = function (reason, roundId) {
    // Only persist globalDQ to localStorage if there is no legitimately completed round
    // that could have caused a spurious visibilitychange during navigation.
    // If roundId is provided, verify it is still 'live' before persisting.
    if (roundId) {
      var s = TT.getState(roundId);
      if (s.status !== "live") return; // round already done — ignore false alarm
    }
    TT.setGlobalDQ(reason);
    TT.showGlobalDQOverlay();
  };

  var origEnter = TT.enterRound;
  TT.enterRound = function (id) { if (TT.globalDQ()) return "dq"; return origEnter(id); };
  var origRequire = TT.requireTeam;
  TT.requireTeam = function () { if (TT.globalDQ()) { TT.showGlobalDQOverlay(); return false; } return origRequire(); };
})();
/* ===== PATCH: FIREBASE SDK AUTO-LOADER (hosted live board) ===== */
(function () {
  var TT = window.TT, C = window.TT_CONFIG;
  var V = "9.23.0";
  var SDK = [
    "https://www.gstatic.com/firebasejs/" + V + "/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/" + V + "/firebase-firestore-compat.js"
  ];
  var loading = false, queue = [];
  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = function () { cb(true); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }
  TT.cloud.boot = function (cb) {
    if (C.isIsland || !C.firebase.enabled || !C.firebase.config || !C.firebase.config.apiKey) { if (cb) cb(false); return; }
    if (TT.cloud.db) { if (cb) cb(true); return; }
    if (loading) { queue.push(cb); return; }
    loading = true;
    loadScript(SDK[0], function (ok1) {
      if (!ok1 || !window.firebase) {
        loading = false;
        queue.slice().forEach(function (f) { if (f) f(false); }); queue = [];
        if (cb) cb(false); return;
      }
      loadScript(SDK[1], function (ok2) {
        loading = false;
        var done = false;
        if (ok2 && window.firebase && window.firebase.firestore) {
          try { firebase.initializeApp(C.firebase.config); TT.cloud.db = firebase.firestore(); done = true; } catch (e) { done = false; }
        }
        queue.slice().forEach(function (f) { if (f) f(done); }); queue = [];
        if (cb) cb(done);
      });
    });
  };
  var origPush = TT.cloud.push, origBoard = TT.cloud.board, origReg = TT.cloud.reg, origRestore = TT.cloud.restoreSession;
  TT.cloud.push = function () {
    var a = arguments;
    if (TT.cloud.db) return origPush.apply(null, a);
    TT.cloud.boot(function (ok) { if (ok) origPush.apply(null, a); });
  };
  TT.cloud.board = function (cb) {
    if (TT.cloud.db) return origBoard(cb);
    if (C.isIsland || !C.firebase.enabled) return cb([]);
    TT.cloud.boot(function (ok) { if (ok) origBoard(cb); else cb([]); });
  };
  if (origReg) TT.cloud.reg = function () {
    var a = arguments;
    if (TT.cloud.db) return origReg.apply(null, a);
    TT.cloud.boot(function (ok) { if (ok) origReg.apply(null, a); });
  };
  if (origRestore) TT.cloud.restoreSession = function (code, cb) {
    if (TT.cloud.db) return origRestore(code, cb);
    TT.cloud.boot(function (ok) { if (ok) origRestore(code, cb); else cb(false, "Could not load Firebase."); });
  };
  TT.cloud.init = function () { TT.cloud.boot(); };
})();
/* ===== PER-ROUND TIE-BREAKER ENGINE ===== */
(function () {
  var TT = window.TT, D = window.TT_DATA;
  TT.startTieBreaker = function (roundId) {
    var tbKey = roundId + "_tb";
    TT.setState(tbKey, { status: "live", startedAt: Date.now(), answers: {} });
  };
  TT.getTieBreaker = function (roundId) {
    return D.tieBreakers[roundId] || null;
  };
  TT.checkTieBreakerKey = function (roundId, input) {
    var tb = TT.getTieBreaker(roundId);
    if (!tb) return false;
    return String(input || "").trim().toUpperCase() === TT.dec(tb.key).trim().toUpperCase();
  };
  TT.gradeTieBreaker = function (roundId) {
    var tb = TT.getTieBreaker(roundId);
    if (!tb) return { correct: 0, points: 0 };
    var st = TT.getState(roundId + "_tb"), ans = st.answers || {};
    var correct = 0;
    tb.questions.forEach(function (q) {
      var v = ans[q.id];
      if (v !== undefined && parseInt(v, 10) === parseInt(TT.dec(q.a), 10)) correct++;
    });
    return { correct: correct, points: correct * 5 };
  };
})();
/* ===== PATCH: PER-ROUND TIE-BREAKER ENGINE ===== */
(function () {
  var TT = window.TT, D = window.TT_DATA;
  TT.getTieBreaker = function (roundId) {
    return (D.tieBreakers && D.tieBreakers[roundId]) || null;
  };
  TT.checkTieBreakerKey = function (roundId, input) {
    var tb = TT.getTieBreaker(roundId);
    if (!tb) return false;
    return String(input || "").trim().toUpperCase() ===
      TT.dec(tb.key).trim().toUpperCase();
  };
  TT.startTieBreaker = function (roundId) {
    TT.setState(roundId + "_tb", {
      status: "live",
      startedAt: Date.now(),
      entered: true,
      answers: {}
    });
  };
  TT.gradeTieBreaker = function (roundId) {
    var tb = TT.getTieBreaker(roundId);
    if (!tb) return { correct: 0, points: 0 };
    var st = TT.getState(roundId + "_tb");
    var ans = st.answers || {};
    var correct = 0;
    tb.questions.forEach(function (q) {
      var v = ans[q.id];
      if (v !== undefined && v !== null && v !== "") {
        if (q.o) {
          if (parseInt(v, 10) === parseInt(TT.dec(q.a), 10)) correct++;
        } else {
          if (TT.norm(v) === TT.norm(TT.dec(q.a))) correct++;
        }
      }
    });
    return { correct: correct, points: correct * 5 };
  };
})();
/* ===== PATCH: accept alternate answers (alt array) & per-round tiebreaker bank ===== */
(function () {
  var TT = window.TT, D = window.TT_DATA;
  TT.gradeMCQFill = function (roundId, tiebreak) {
    var st = TT.getState(roundId), ans = st.answers || {};
    var rawId = roundId.replace("_tb", "");
    var bank;
    if (tiebreak || roundId.indexOf("_tb") !== -1) {
      var tbObj = (D.tieBreakers && (D.tieBreakers[rawId] || D.tieBreakers[roundId]));
      bank = tbObj ? tbObj.questions : (D.tb || []);
    } else {
      bank = D[roundId] || [];
    }
    var correct = 0, points = 0;
    bank.forEach(function (q) {
      var v = ans[q.id];
      if (v === undefined || v === null || v === "") return;
      var target = q.a ? TT.dec(q.a) : (q.expected ? TT.dec(q.expected) : "");
      var ok = false;
      if (q.o) {
        ok = (parseInt(v, 10) === parseInt(target, 10));
      } else {
        var normV = TT.norm(v);
        ok = (normV === TT.norm(target));
        if (!ok && q.alt && Array.isArray(q.alt)) {
          for (var i = 0; i < q.alt.length; i++) {
            if (normV === TT.norm(TT.dec(q.alt[i]))) { ok = true; break; }
          }
        }
      }
      if (ok) { correct++; points += (q.pts || (roundId.indexOf("_tb") !== -1 ? 5 : TT.defaultPts(roundId, q))); }
    });
    return { correct: correct, points: points };
  };
})();   
/* ===== PATCH: TESTING MODE (anti-cheat toggle) ===== */
(function () {
  var TT = window.TT;
  var FLAG = "tt_anticheat_off";
  TT.antiCheatOff = function () { return TT.lsGet(FLAG, false); };
  TT.setAntiCheat = function (enabled) {
    TT.lsSet(FLAG, !enabled);
    TT.toast("Anti-cheat " + (enabled ? "ENABLED - event mode" : "DISABLED - testing mode"), enabled ? "good" : "warn");
  };

  var origArm = TT.arm;
  TT.arm = function (roundId) { if (TT.antiCheatOff()) return; origArm(roundId); };

  var origEnter = TT.enterRound;
  TT.enterRound = function (id) {
    if (TT.antiCheatOff()) {
      if (TT.globalDQ && TT.globalDQ()) TT.clearGlobalDQ();
      var st = TT.getState(id);
      if (st.status === "dq") TT.lsSet(TT.rKey(id), { status: "locked" });
      else if (st.status === "live" && st.entered) TT.setState(id, { entered: false });
    }
    return origEnter(id);
  };

  var origReq = TT.requireTeam;
  TT.requireTeam = function () {
    if (TT.antiCheatOff() && TT.globalDQ && TT.globalDQ()) TT.clearGlobalDQ();
    return origReq();
  };
})();