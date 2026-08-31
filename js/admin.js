/* ============================================================
   TECH TRIVIA — js/admin.js  v2.1
   Admin panel: scoreboard (2 divisions: Live Firebase & Island),
   round keys, question editor (with Crossword single hints),
   settings (with Round 4 coding tasks setting), machine controls.
   ============================================================ */

(function () {
"use strict";
var D = window.TT_DATA, C = window.TT_CONFIG, TT = window.TT;
TT.admin = {};

var BOARD   = "tt_admin_board";   // island manual board rows
var ARCHIVE = "tt_score_archive"; // harvested team archive
var tab = "board", curBank = "r1", editIdx = -1;
var _liveTimer = null; // auto-refresh handle for live board

/* ─── Helpers ─────────────────────────────────────────────── */
function enc(s) { return btoa(unescape(encodeURIComponent(String(s)))); }
function v(id)  { var e = document.getElementById(id); return e ? e.value : ""; }
function dl(name, txt) {
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([txt], { type: "text/javascript" }));
  a.download = name; a.click();
}
function genId() { return "q" + Date.now().toString(36) + Math.floor(Math.random() * 999); }
function fmtTime(sec) {
  if (!sec && sec !== 0) return "—";
  var m = Math.floor(sec / 60), s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}
function fileToDataURL(file, cb) {
  var img = new Image(), url = URL.createObjectURL(file);
  img.onload = function () {
    var max = 400, w = img.width, h = img.height;
    if (w > max || h > max) { var k = max / Math.max(w, h); w = Math.round(w * k); h = Math.round(h * k); }
    var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    cv.getContext("2d").drawImage(img, 0, 0, w, h);
    cb(cv.toDataURL("image/jpeg", 0.72));
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/* ─── Login ───────────────────────────────────────────────── */
TT.admin.init = function () {
  var main = document.getElementById("main");
  if (!TT.lsGet(C.store.admin, false)) {
    main.innerHTML =
      '<div class="card narrow center" style="margin:40px auto;max-width:420px">' +
        '<div class="badge-icon" style="margin:0 auto 12px">🔑</div>' +
        '<h3>Admin Login</h3>' +
        '<input class="input" id="pw" type="password" placeholder="Admin password" style="margin:14px 0">' +
        '<button class="btn block" id="lg">Login</button><div id="lgMsg"></div>' +
      '</div>';
    document.getElementById("lg").onclick = function () {
      if (v("pw").trim() === C.adminPassword) { TT.lsSet(C.store.admin, true); TT.admin.init(); }
      else document.getElementById("lgMsg").innerHTML = '<div class="msg bad">Wrong password</div>';
    };
    document.getElementById("pw").onkeydown = function (e) { if (e.key === "Enter") document.getElementById("lg").onclick(); };
    return;
  }
  render();
};

/* ─── Main render ─────────────────────────────────────────── */
function render() {
  if (_liveTimer) { clearInterval(_liveTimer); _liveTimer = null; }

  var main = document.getElementById("main");
  function tb(id, label) {
    return '<button class="btn small ' + (tab === id ? "" : "ghost") + ' tabBtn" data-t="' + id + '">' + label + "</button>";
  }

  // Anti-cheat + DQ top bar
  var topControls = '<div class="card tight" style="border-color:var(--warn);margin-bottom:12px">';
  if (typeof TT.antiCheatOff === "function") {
    var acOff = TT.antiCheatOff();
    topControls +=
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">' +
      '<span class="hint">🛡️ Anti-cheat: <b style="color:' + (acOff ? "var(--warn)" : "var(--good)") + '">' +
        (acOff ? "OFF (Testing)" : "ON (Event)") + '</b></span>' +
      '<button class="btn small" id="acToggle">' + (acOff ? "Enable Anti-Cheat" : "Disable for Testing") + '</button></div>';
  }
  if (typeof TT.globalDQ === "function") {
    var dq = TT.globalDQ();
    topControls +=
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<span class="hint">⚠️ DQ: <b>' + (dq ? "DISQUALIFIED (" + TT.esc(dq.reason || "Anti-cheat") + ")" : "✅ None") + '</b></span>' +
      (dq ? '<button class="btn small warn" id="clearDqBtn">Clear Global DQ</button>' : "") +
      "</div>";
  }
  topControls += "</div>";

  main.innerHTML =
    '<div class="topbar">' +
      '<div><b>Admin Panel</b><br><span class="hint">' + MODE + " · " + TT.esc(D.brand.event) + "</span></div>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn small warn" id="expBtn">Save &amp; Export data.js</button>' +
        '<button class="btn small ghost" id="logout">Logout</button>' +
      "</div>" +
    "</div>" +
    topControls +
    '<div class="card tight"><div style="display:flex;gap:8px;flex-wrap:wrap">' +
      tb("board", "📊 Scoreboard (2 Divisions)") + tb("keys", "🔑 Round Keys") + tb("qs", "❓ Questions") +
      tb("settings", "⚙️ Settings") + tb("machine", "🖥️ This Machine") +
    "</div></div>" +
    '<div id="panel"></div>';

  if (document.getElementById("acToggle"))
    document.getElementById("acToggle").onclick = function () {
      if (typeof TT.setAntiCheat === "function") { TT.setAntiCheat(TT.antiCheatOff()); render(); }
    };
  if (document.getElementById("clearDqBtn"))
    document.getElementById("clearDqBtn").onclick = function () {
      if (typeof TT.clearGlobalDQ === "function") { TT.clearGlobalDQ(); TT.toast("Global DQ cleared", "good"); render(); }
    };

  Array.prototype.forEach.call(document.querySelectorAll(".tabBtn"), function (b) {
    b.onclick = function () { tab = b.getAttribute("data-t"); render(); };
  });
  document.getElementById("expBtn").onclick = exportData;
  document.getElementById("logout").onclick = function () { TT.lsSet(C.store.admin, false); TT.admin.init(); };

  if (tab === "board")    panelBoard();
  else if (tab === "keys") panelKeys();
  else if (tab === "qs")   panelQs();
  else if (tab === "settings") panelSettings();
  else panelMachine();
}

/* ═══════════════════════════════════════════════════════════
   SCOREBOARD  (2 DIVISIONS: 1. Live Firebase | 2. Island)
   ═══════════════════════════════════════════════════════════ */
function panelBoard() {
  var p = document.getElementById("panel");
  p.innerHTML =
    '<div id="divisionLive"></div>' +
    '<div id="divisionIsland" style="margin-top:20px"></div>';

  renderLiveDivision();
  renderIslandDivision();
}

/* ── DIVISION 1: Live Scoreboard (Firebase) ───────────────── */
function renderLiveDivision() {
  var el = document.getElementById("divisionLive"); if (!el) return;
  var isConnected = window.TT && TT.cloud && TT.cloud.db;

  if (_liveTimer) clearInterval(_liveTimer);
  if (isConnected) {
    _liveTimer = setInterval(function () {
      if (tab === "board") renderLiveDivision();
      else { clearInterval(_liveTimer); _liveTimer = null; }
    }, 15000);
  }

  if (!isConnected) {
    el.innerHTML =
      '<div class="card tight" style="border-color:rgba(77,216,255,.15);opacity:.7">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
          '<h3 style="color:var(--muted)">🔴 Division 1: Live Scoreboard (Firebase)</h3>' +
          '<span class="hint">Hosted mode only</span>' +
        '</div>' +
        '<p class="hint" style="margin-top:6px">Firebase is disconnected in island/local mode. For local runs, all automatic data is tracked in <b>Division 2: Island Computer Scoreboard</b> below.</p>' +
      "</div>";
    return;
  }

  el.innerHTML =
    '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">' +
        '<div>' +
          '<h3 style="color:var(--cyan)">🔴 Division 1: Live Scoreboard (Firebase)</h3>' +
          '<span class="hint">Real-time cloud scores · auto-refreshing every 15s</span>' +
        '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn small ghost" id="liveRefreshNow">↻ Refresh Now</button>' +
          '<button class="btn small warn" id="liveSnapshot">💾 Snapshot → score.js</button>' +
        "</div>" +
      "</div>" +
      '<div id="liveTbl"><p class="hint">Loading live cloud scores…</p></div>' +
    "</div>";

  document.getElementById("liveRefreshNow").onclick = renderLiveDivision;
  document.getElementById("liveSnapshot").onclick = snapshotFirebase;

  TT.cloud.board(function (rows) {
    var tbl = document.getElementById("liveTbl"); if (!tbl) return;
    if (!rows || !rows.length) { tbl.innerHTML = '<p class="hint">No live teams recorded on Firebase yet.</p>'; return; }

    var h =
      '<div style="overflow-x:auto"><table style="width:100%;white-space:nowrap">' +
      '<thead><tr>' +
        '<th>#</th>' +
        '<th>Team</th>' +
        '<th style="color:var(--r1)">R1 (Prelims)</th>' +
        '<th style="color:var(--r2)">R2 (Corporate)</th>' +
        '<th style="color:var(--r3)">R3 (Visual)</th>' +
        '<th style="color:var(--r4)">R4 (Rapid Rush)</th>' +
        '<th>Grand Total</th>' +
        '<th>Total Time</th>' +
      '</tr></thead><tbody>';

    rows.forEach(function (r, i) {
      function rc(id, color) {
        var x = r.rounds && r.rounds[id];
        if (!x) return "<td style='color:var(--muted)'>—</td>";
        return "<td style='color:" + (color || "inherit") + "'><b>" + (x.score || 0) + " pts</b> <span style='font-size:11px;color:var(--muted)'>(✓" + (x.correct !== undefined ? x.correct : "—") + ")</span></td>";
      }
      var totalTime = 0;
      ["r1", "r2", "r3", "r4"].forEach(function (id) {
        var x = r.rounds && r.rounds[id];
        if (x && x.timeSec) totalTime += x.timeSec;
      });

      h += '<tr>' +
        '<td><span class="rank-pill' + (i === 0 ? " gold" : "") + '">' + (i + 1) + '</span></td>' +
        '<td><b>' + TT.esc(r.team || "—") + '</b></td>' +
        rc("r1", "var(--r1)") + rc("r2", "var(--r2)") + rc("r3", "var(--r3)") + rc("r4", "var(--good)") +
        '<td><span class="rank-pill gold" style="font-size:14px;padding:3px 10px;height:auto;min-width:auto;font-weight:800">' + (r.total || 0) + ' pts</span></td>' +
        '<td style="color:var(--muted);font-size:12px">' + fmtTime(totalTime) + '</td>' +
      '</tr>';
    });
    h += "</tbody></table></div>";
    tbl.innerHTML = h;
  });
}

/* ── DIVISION 2: Island Computer Scoreboard (Local Browser) ─ */
function renderIslandDivision() {
  var el = document.getElementById("divisionIsland"); if (!el) return;

  // Auto-gather local teams from tt_local_teams + current machine team
  var localList = TT.lsGet("tt_local_teams", []);
  var curTeam = TT.getTeam();

  if (curTeam) {
    // Collect rounds from current machine
    var curRounds = {};
    var curTotal = 0;
    ["r1", "r2", "r3", "r4"].forEach(function (r) {
      var st = TT.getState(r);
      if (st && st.status === "done") {
        curRounds[r] = {
          score: st.score || 0,
          correct: st.correct || 0,
          timeSec: st.timeSec || 0
        };
        curTotal += st.score || 0;
      }
    });

    var existingIdx = -1;
    for (var k = 0; k < localList.length; k++) {
      if (localList[k].code === curTeam.code || localList[k].name === curTeam.name) {
        existingIdx = k; break;
      }
    }
    var curEntry = {
      code: curTeam.code,
      name: curTeam.name,
      members: curTeam.members || [],
      rounds: curRounds,
      total: curTotal,
      updatedAt: Date.now()
    };

    if (existingIdx >= 0) {
      // Update if current machine has more or newer data
      if (curTotal >= (localList[existingIdx].total || 0)) {
        localList[existingIdx] = curEntry;
      }
    } else if (curTotal > 0 || curTeam.name) {
      localList.push(curEntry);
    }
    TT.lsSet("tt_local_teams", localList);
  }

  // Sort descending by total score
  localList.sort(function (a, b) { return (b.total || 0) - (a.total || 0); });

  // Function to verify if a team is saved in score.js
  function isSavedInScoreJs(t) {
    if (!window.TT_SCORES || !Array.isArray(window.TT_SCORES) || !window.TT_SCORES.length) return false;
    for (var j = 0; j < window.TT_SCORES.length; j++) {
      var s = window.TT_SCORES[j];
      var sName = s.team || s.name || "";
      if ((s.code && s.code === t.code) || (sName && sName.toLowerCase() === (t.name || "").toLowerCase())) {
        if (s.total === t.total && t.total > 0) return true;
      }
    }
    return false;
  }

  var unsavedCount = 0;
  localList.forEach(function (t) {
    if (!isSavedInScoreJs(t)) unsavedCount++;
  });

  var h =
    '<div class="card" style="border-color:var(--cyan-soft)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">' +
        '<div>' +
          '<h3 style="color:var(--cyan);margin:0">💾 Division 2: Island Computer Scoreboard</h3>' +
          '<p class="hint" style="margin:4px 0 0">Automatic local browser storage · ' + localList.length + ' team(s) stored locally</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
          (unsavedCount > 0
            ? '<span style="font-size:12px;color:var(--bad);font-weight:700;background:rgba(255,84,112,.15);padding:4px 10px;border-radius:6px;border:1px solid var(--bad)">⚠️ ' + unsavedCount + ' unsaved in score.js</span>'
            : '<span style="font-size:12px;color:var(--good);font-weight:700;background:rgba(61,220,132,.15);padding:4px 10px;border-radius:6px;border:1px solid var(--good)">✅ All saved in score.js</span>') +
          '<button class="btn warn" id="exportIslandScoreJs" style="box-shadow:0 0 16px rgba(255,215,106,.3)">💾 Export to score.js</button>' +
          '<button class="btn small ghost" id="clearLocalTeamsBtn">Clear Local Data</button>' +
        '</div>' +
      '</div>';

  if (!localList.length) {
    h += '<p class="hint" style="padding:16px 0;text-align:center">No team has completed any rounds on this computer yet. As teams play, their scores automatically appear here.</p>';
  } else {
    var h =
      '<div style="overflow-x:auto"><table style="width:100%;white-space:nowrap">' +
      '<thead><tr>' +
        '<th>#</th>' +
        '<th>Team</th>' +
        '<th>Members</th>' +
        '<th style="color:var(--r1)">R1</th>' +
        '<th style="color:var(--r2)">R2</th>' +
        '<th style="color:var(--r3)">R3</th>' +
        '<th style="color:var(--r4)">R4 Code</th>' +
        '<th style="color:var(--warn)">R4 Debug</th>' +
        '<th style="color:var(--good)">R4 Total</th>' +
        '<th>Grand Total</th>' +
        '<th>Status</th>' +
        '<th></th>' +
      '</tr></thead><tbody>';

    localList.forEach(function (t, rank) {
      var saved = isSavedInScoreJs(t);
      var r = t.rounds || {};
      var membersStr = Array.isArray(t.members) ? t.members.join(", ") : (t.members || "—");

      function rCell(id, color) {
        var x = r[id];
        if (!x && x !== 0) return "<td style='color:var(--muted)'>—</td>";
        var obj = typeof x === "object" ? x : { score: x };
        var sc = obj.score || 0;
        var co = obj.correct !== undefined ? obj.correct : "—";
        return "<td style='color:" + (color || "inherit") + "'><b>" + sc + "</b> <span style='font-size:11px;color:var(--muted)'>(✓" + co + ")</span></td>";
      }

      var r4 = r["r4"] ? (typeof r["r4"] === "object" ? r["r4"] : { score: r["r4"] }) : null;
      var r4CodCell = r4
        ? "<td><b>" + (r4.codingScore || r4.score || 0) + "</b> <span style='font-size:11px;color:var(--muted)'>(" + (r4.codingSolved || 0) + " sol)</span></td>"
        : "<td style='color:var(--muted)'>—</td>";
      var r4DbgCell = r4
        ? "<td style='color:var(--warn)'><b>" + (r4.debugDone ? (r4.debugScore || 20) : (r4.debugPartial || 0)) + "</b>" + (r4.debugDone ? " <span style='font-size:11px;color:var(--good)'>✓</span>" : "") + "</td>"
        : "<td style='color:var(--muted)'>—</td>";
      var r4TotalCell = r4
        ? "<td style='color:var(--good);font-weight:800'>" + (r4.score || 0) + "</td>"
        : "<td style='color:var(--muted)'>—</td>";

      var statusBadge = saved
        ? '<span style="color:var(--good);font-weight:700;background:rgba(61,220,132,0.15);padding:3px 8px;border-radius:6px;border:1px solid var(--good);font-size:11px">🟢 SAVED</span>'
        : '<span style="color:var(--bad);font-weight:700;background:rgba(255,84,112,0.2);padding:3px 8px;border-radius:6px;border:1px solid var(--bad);font-size:11px">🔴 NOT SAVED</span>';

      h += '<tr>' +
        '<td><span class="rank-pill' + (rank === 0 ? " gold" : "") + '">' + (rank + 1) + '</span></td>' +
        '<td><b>' + TT.esc(t.name || "—") + '</b></td>' +
        '<td style="font-size:12px;color:var(--muted);max-width:180px;overflow:hidden;text-overflow:ellipsis">' + TT.esc(membersStr) + '</td>' +
        rCell("r1", "var(--r1)") + rCell("r2", "var(--r2)") + rCell("r3", "var(--r3)") +
        r4CodCell + r4DbgCell + r4TotalCell +
        '<td><span class="rank-pill gold" style="font-size:14px;padding:3px 10px;height:auto;min-width:auto;font-weight:800">' + (t.total || 0) + ' pts</span></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td><button class="btn small danger delLocalTeam" data-i="' + rank + '">✕</button></td>' +
      '</tr>';
    });
    h += '</tbody></table></div>';

  }

  h += '</div>';
  el.innerHTML = h;

  document.getElementById("exportIslandScoreJs").onclick = function () {
    exportLocalScoresJs(localList);
  };

  document.getElementById("clearLocalTeamsBtn").onclick = function () {
    TT.confirmBox("Clear all local team scores stored in this browser?", function () {
      TT.lsSet("tt_local_teams", []);
      TT.lsSet(BOARD, []);
      renderIslandDivision();
      TT.toast("Local team scores cleared", "good");
    }, "Clear All");
  };

  document.querySelectorAll(".delLocalTeam").forEach(function (btn) {
    btn.onclick = function () {
      var idx = parseInt(btn.getAttribute("data-i"), 10);
      localList.splice(idx, 1);
      TT.lsSet("tt_local_teams", localList);
      renderIslandDivision();
    };
  });
}

function exportLocalScoresJs(localList) {
  if (!localList || !localList.length) {
    TT.toast("No scores stored locally to export", "warn");
    return;
  }
  var exportList = localList.slice().sort(function (a, b) {
    return (b.total || 0) - (a.total || 0);
  });
  exportList.forEach(function (t, i) { t.rank = i + 1; });

  var txt =
    "/* ============================================================\n" +
    "   TECH TRIVIA — Score Archive (score.js)\n" +
    "   Saved: " + new Date().toLocaleString() + "\n" +
    "   Event: " + (D.brand.event || "TECH TRIVIA") + " · " + (D.brand.org || "") + "\n" +
    "   Teams: " + exportList.length + "\n" +
    "   ============================================================ */\n" +
    "window.TT_SCORES = " + JSON.stringify(exportList, null, 2) + ";\n";

  dl("score.js", txt);
  TT.toast("score.js downloaded! Place at js/score.js in your project to mark saved.", "good");
}

function snapshotFirebase() {
  if (!TT.cloud || !TT.cloud.db) { TT.toast("Firebase not connected", "warn"); return; }
  TT.toast("Fetching latest scores from Firebase…", "info");

  TT.cloud.board(function (rows) {
    if (!rows || !rows.length) { TT.toast("No Firebase scores to snapshot", "warn"); return; }
    var sorted = rows.map(function (r, i) {
      var rds = {};
      ["r1", "r2", "r3", "r4"].forEach(function (id) {
        var x = r.rounds && r.rounds[id];
        if (x) rds[id] = {
          score: x.score || 0,
          correct: x.correct || 0,
          base: x.base || x.score || 0,
          bonus: x.bonus || 0,
          timeSec: x.timeSec || 0
        };
      });
      return {
        rank: i + 1,
        team: r.team || "Unknown",
        code: r.code || "",
        members: r.members || [],
        savedAt: new Date().toISOString(),
        rounds: rds,
        total: r.total || 0
      };
    });

    var txt =
      "/* TECH TRIVIA — Firebase Snapshot\n" +
      "   Saved: " + new Date().toLocaleString() + "\n" +
      "   Event: " + (D.brand.event || "TECH TRIVIA") + "\n" +
      "   Teams: " + sorted.length + "\n" +
      "*/\n" +
      "window.TT_SCORES = " + JSON.stringify(sorted, null, 2) + ";\n";

    dl("score.js", txt);
    TT.toast("Firebase snapshot → score.js downloaded!", "good");
  });
}

/* ═══════════════════════════════════════════════════════════
   ROUND KEYS
   ═══════════════════════════════════════════════════════════ */
function panelKeys() {
  var p = document.getElementById("panel");
  var keys = D.settings.keys || {};
  var names = { r2: "Round 2 — Corporate Clue", r3: "Round 3 — Visual Logic", r4: "Round 4 — Rapid Rush (Top 5)", debug: "Debug Task (Top 3)", tiebreak: "Tie-Breaker" };
  var h =
    '<div class="card"><h3>Round Keys</h3>' +
    '<p class="hint">Announce each key aloud when you want that round to open. Round 1 needs no key.</p>' +
    '<table><tr><th>Round</th><th>Key</th></tr>';
  Object.keys(keys).forEach(function (k) {
    h += '<tr><td>' + TT.esc(names[k] || k) + '</td><td><b style="letter-spacing:3px;font-size:17px">' + TT.esc(TT.dec(keys[k])) + "</b></td></tr>";
  });
  if (D.tieBreakers) {
    h += '<tr><th colspan="2" style="padding-top:14px;color:var(--warn)">Tie-Breaker Keys</th></tr>';
    Object.keys(D.tieBreakers).forEach(function (tbId) {
      var tbObj = D.tieBreakers[tbId];
      if (tbObj && tbObj.key)
        h += '<tr><td>Tie-Breaker ' + tbId.toUpperCase() + '</td><td><b style="letter-spacing:3px;font-size:17px;color:var(--warn)">' + TT.esc(TT.dec(tbObj.key)) + "</b></td></tr>";
    });
  }
  h += '</table><p class="hint" style="margin-top:10px">To change a key: edit js/data.js directly, then Export.</p></div>';
  p.innerHTML = h;
}

/* ═══════════════════════════════════════════════════════════
   QUESTION EDITOR  (with Crossword single question/hint)
   ═══════════════════════════════════════════════════════════ */
var BANKS = {
  r1:  { label: "Round 1 (MCQ)",   get: function () { return D.r1 || []; }, kind: "mcq" },
  tb1: { label: "TB: R1",          get: function () { return (D.tieBreakers && D.tieBreakers.r1 && D.tieBreakers.r1.questions) || []; }, kind: "mcq" },
  tb2: { label: "TB: R2",          get: function () { return (D.tieBreakers && D.tieBreakers.r2 && D.tieBreakers.r2.questions) || []; }, kind: "mcq" },
  tb3: { label: "TB: R3",          get: function () { return (D.tieBreakers && D.tieBreakers.r3 && D.tieBreakers.r3.questions) || []; }, kind: "r2" },
  tb4: { label: "TB: R4",          get: function () { return (D.tieBreakers && D.tieBreakers.r4 && D.tieBreakers.r4.questions) || []; }, kind: "task" },
  r2:  { label: "Round 2 (Fill)",  get: function () { return D.r2 || []; }, kind: "r2" },
  r3:  { label: "Round 3 (Puzzle)",get: function () { return D.r3 || []; }, kind: "puzzle" },
  cw:  { label: "Round 3 Crossword", get: function () { return D.crossword || []; }, kind: "crossword" },
  r4t: { label: "Round 4 Tasks",   get: function () { return (D.r4 && D.r4.tasks) || []; }, kind: "task" },
  r4d: { label: "Debug Task",      get: function () { return (D.r4 && D.r4.debug) ? [D.r4.debug] : []; }, kind: "debug" }
};

function panelQs() {
  var p = document.getElementById("panel"), b = BANKS[curBank];
  var h = '<div class="card tight"><div style="display:flex;gap:8px;flex-wrap:wrap">';
  Object.keys(BANKS).forEach(function (k) {
    h += '<button class="btn small ' + (k === curBank ? "" : "ghost") + ' bankBtn" data-b="' + k + '">' + BANKS[k].label + "</button>";
  });
  h += '</div></div><div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      "<h3>" + b.label + " · " + b.get().length + " item(s)</h3>" +
      (curBank !== "r4d" ? '<button class="btn small" id="addQ">Add New</button>' : "") +
    '</div><div id="qList" style="margin-top:12px"></div></div><div id="qForm" class="hide"></div>';
  p.innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll(".bankBtn"), function (x) {
    x.onclick = function () { curBank = x.getAttribute("data-b"); editIdx = -1; panelQs(); };
  });
  if (document.getElementById("addQ")) document.getElementById("addQ").onclick = function () { openForm(-1); };
  renderList();
}

function renderList() {
  var arr = BANKS[curBank].get(), h = "";
  arr.forEach(function (q, i) {
    var extra = "";
    if (q.o)                extra = "MCQ — answer: " + TT.esc(q.o[parseInt(TT.dec(q.a), 10)] || "?");
    else if (curBank === "cw") extra = "Word: <b>" + TT.esc(q.word || "") + "</b>";
    else if (q.a && curBank === "r2") extra = "Fill — answer: " + TT.esc(TT.dec(q.a));
    else if (curBank === "r3") extra = "answer: " + TT.esc(TT.dec(q.a));
    else if (q.expected)    extra = "expected: " + TT.esc(TT.dec(q.expected));
    var title = curBank === "cw" ? q.clue : q.t;
    h += '<div class="msg info" style="display:flex;justify-content:space-between;gap:10px;align-items:center">' +
      '<span><b>' + (i + 1) + '.</b> ' + TT.esc(String(title || "").substring(0, 90)) + (String(title || "").length > 90 ? "…" : "") +
      '<br><span class="hint">' + extra + "</span></span>" +
      '<span style="white-space:nowrap"><button class="btn small ghost edQ" data-i="' + i + '">Edit</button>' +
      (curBank !== "r4d" ? ' <button class="btn small danger delQ" data-i="' + i + '">Del</button>' : "") +
      "</span></div>";
  });
  document.getElementById("qList").innerHTML = h || '<p class="hint">No items.</p>';
  Array.prototype.forEach.call(document.querySelectorAll(".edQ"), function (b) {
    b.onclick = function () { openForm(parseInt(b.getAttribute("data-i"), 10)); };
  });
  Array.prototype.forEach.call(document.querySelectorAll(".delQ"), function (b) {
    b.onclick = function () {
      var i = parseInt(b.getAttribute("data-i"), 10);
      TT.confirmBox("Delete this item?", function () { BANKS[curBank].get().splice(i, 1); TT.toast("Deleted — remember to Export", "warn"); panelQs(); }, "Delete");
    };
  });
}

var formImgs = [], formImg = "";
function openForm(i) {
  editIdx = i;
  var b = BANKS[curBank], arr = b.get(), q = i >= 0 ? arr[i] : {};
  var f = document.getElementById("qForm");
  f.classList.remove("hide");
  formImgs = q.img && q.img.slice ? q.img.slice() : ["", "", "", ""];
  formImg  = q.img && !q.img.slice ? q.img : "";
  var h = '<div class="card" style="border-color:var(--warn)"><h3>' + (i >= 0 ? "Edit" : "Add") + " — " + b.label + "</h3>";

  if (b.kind === "crossword") {
    h += '<label>Tech Word (Upper-case answer)</label>' +
      '<input class="input" id="f_cwWord" placeholder="e.g. PYTHON" value="' + TT.esc(q.word || "") + '" style="font-weight:700;letter-spacing:1px">' +
      '<label>Single Question / Hint / Clue</label>' +
      '<textarea class="input" id="f_cwClue" placeholder="Single question or definition for this word...">' + TT.esc(q.clue || "") + '</textarea>';
  } else if (b.kind === "mcq" || b.kind === "r2") {
    h += '<label>Question text</label><textarea class="input" id="f_t">' + TT.esc(q.t || "") + "</textarea>";
    h += '<label>Image (optional — paste URL or upload)</label>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<input class="input" id="f_img" style="flex:1;min-width:220px" placeholder="https://... or upload" value="' +
        (/^data:/.test(formImg) ? "(uploaded image - kept)" : TT.esc(formImg)) + '">' +
      '<input type="file" id="f_imgFile" accept="image/*" class="input" style="max-width:230px"></div>';
    h += '<label>Options (fill ALL 4 for MCQ, leave blank for fill-in-the-blank)</label>';
    for (var k = 0; k < 4; k++)
      h += '<input class="input" id="f_o' + k + '" placeholder="Option ' + "ABCD".charAt(k) + '" style="margin-bottom:6px" value="' + TT.esc(q.o ? (q.o[k] || "") : "") + '">';
    h += '<label>Correct option</label><select class="input" id="f_ans">' +
      [0,1,2,3].map(function (x) {
        return '<option value="' + x + '"' + (q.o && parseInt(TT.dec(q.a), 10) === x ? " selected" : "") + ">" + "ABCD".charAt(x) + "</option>";
      }).join("") + "</select>";
    h += '<label>Fill-in answer (if options blank)</label><input class="input" id="f_fill" value="' + TT.esc(!q.o && q.a ? TT.dec(q.a) : "") + '">';
    h += '<label>Points (0 = round default)</label><input class="input" id="f_pts" type="number" value="' + (q.pts || 0) + '">';
  } else if (b.kind === "puzzle") {
    h += '<label>4 clues (emoji/text or upload image per slot)</label>';
    for (var m = 0; m < 4; m++) {
      var isData = /^data:/.test(formImgs[m] || "");
      h += '<div style="display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap">' +
        '<input class="input" id="f_im' + m + '" style="flex:1;min-width:180px" placeholder="Emoji or URL" value="' +
          (isData ? "(uploaded image - kept)" : TT.esc(formImgs[m] || "")) + '">' +
        '<input type="file" accept="image/*" class="input imFile" data-k="' + m + '" style="max-width:210px"></div>';
    }
    h += '<label>Hint 1</label><input class="input" id="f_h1" value="' + TT.esc(q.hint1 || "") + '">';
    h += '<label>Hint 2</label><input class="input" id="f_h2" value="' + TT.esc(q.hint2 || "") + '">';
    h += '<label>Crossword clue (short)</label><input class="input" id="f_clue" value="' + TT.esc(q.clue || "") + '">';
    h += '<label>Answer (the tech word)</label><input class="input" id="f_answ" value="' + TT.esc(q.a ? TT.dec(q.a) : "") + '">';
  } else {
    h += '<label>Task text</label><textarea class="input" id="f_t">' + TT.esc(q.t || "") + "</textarea>";
    if (b.kind === "debug") h += '<label>Starter (buggy) code</label><textarea class="code" id="f_start">' + TT.esc(q.starter || "") + "</textarea>";
    h += '<label>Expected output (exact)</label><textarea class="input" id="f_exp">' + TT.esc(q.expected ? TT.dec(q.expected) : "") + "</textarea>";
  }

  h += '<div style="display:flex;gap:10px;margin-top:14px"><button class="btn" id="saveQ">Save</button>' +
    '<button class="btn ghost" id="cancelQ">Cancel</button></div>' +
    '<p class="hint" style="margin-top:8px">Changes stay in memory until you press "Save &amp; Export data.js".</p></div>';
  f.innerHTML = h;
  f.scrollIntoView();

  if (document.getElementById("f_imgFile"))
    document.getElementById("f_imgFile").onchange = function (e) {
      if (e.target.files[0]) fileToDataURL(e.target.files[0], function (d) {
        formImg = d; document.getElementById("f_img").value = "(uploaded image - kept)";
        TT.toast("Image attached (compressed)", "good");
      });
    };
  Array.prototype.forEach.call(document.querySelectorAll(".imFile"), function (fu) {
    fu.onchange = function (e) {
      var kk = parseInt(fu.getAttribute("data-k"), 10);
      if (e.target.files[0]) fileToDataURL(e.target.files[0], function (d) {
        formImgs[kk] = d; document.getElementById("f_im" + kk).value = "(uploaded image - kept)";
        TT.toast("Image attached", "good");
      });
    };
  });
  document.getElementById("cancelQ").onclick = function () { f.classList.add("hide"); };
  document.getElementById("saveQ").onclick = saveQ;
}

function saveQ() {
  var b = BANKS[curBank], arr = b.get(), nq;
  if (b.kind === "crossword") {
    var cwWord = v("f_cwWord").trim().toUpperCase().replace(/[^A-Z]/g, "");
    var cwClue = v("f_cwClue").trim();
    if (!cwWord || !cwClue) { TT.toast("Both word and clue are required", "bad"); return; }
    nq = { id: editIdx >= 0 ? arr[editIdx].id : genId(), word: cwWord, clue: cwClue };
  } else if (b.kind === "mcq" || b.kind === "r2") {
    var t = v("f_t").trim(); if (!t) { TT.toast("Question text required", "bad"); return; }
    var opts = [v("f_o0").trim(), v("f_o1").trim(), v("f_o2").trim(), v("f_o3").trim()];
    var img = /^data:/.test(formImg) ? formImg : v("f_img").trim();
    if (img === "(uploaded image - kept)") img = formImg;
    var pts = parseInt(v("f_pts"), 10) || 0;
    if (opts[0] || opts[1] || opts[2] || opts[3]) {
      if (!(opts[0] && opts[1] && opts[2] && opts[3])) { TT.toast("Fill ALL 4 options or leave all blank", "bad"); return; }
      nq = { id: genId(), t: t, img: img || null, o: opts, a: enc(v("f_ans")) };
    } else {
      var fa = v("f_fill").trim(); if (!fa) { TT.toast("Fill-in answer required", "bad"); return; }
      nq = { id: genId(), t: t, img: img || null, a: enc(fa) };
    }
    if (pts) nq.pts = pts;
    if (editIdx >= 0) nq.id = arr[editIdx].id;
  } else if (b.kind === "puzzle") {
    for (var k = 0; k < 4; k++) {
      var val = v("f_im" + k).trim();
      if (val && val !== "(uploaded image - kept)") formImgs[k] = val;
      if (!formImgs[k]) { TT.toast("All 4 clue slots needed (slot " + (k + 1) + " empty)", "bad"); return; }
    }
    var aw = v("f_answ").trim(); if (!aw) { TT.toast("Answer required", "bad"); return; }
    nq = { id: editIdx >= 0 ? arr[editIdx].id : genId(), img: formImgs.slice(),
           hint1: v("f_h1").trim(), hint2: v("f_h2").trim(), clue: v("f_clue").trim() || aw, a: enc(aw) };
  } else {
    var tt2 = v("f_t").trim(), ex = v("f_exp").trim();
    if (!tt2 || !ex) { TT.toast("Task text and expected output required", "bad"); return; }
    nq = { id: editIdx >= 0 ? arr[editIdx].id : genId(), t: tt2, expected: enc(ex) };
    if (b.kind === "debug") nq.starter = v("f_start");
  }
  if (curBank === "r4d") D.r4.debug = nq;
  else if (editIdx >= 0) arr[editIdx] = nq;
  else arr.push(nq);
  TT.toast("Saved in memory — Export data.js to bake it in", "good");
  document.getElementById("qForm").classList.add("hide");
  renderList();
}

function exportData() {
  var txt = "/* TECH TRIVIA — js/data.js — exported " + new Date().toLocaleString() + " */\n" +
    "window.TT_DATA = " + JSON.stringify(D, null, 2) + ";\n";
  dl("data.js", txt);
  TT.toast("data.js downloaded — replace js/data.js in the folder", "good");
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS  (with Round 4 required coding tasks setting)
   ═══════════════════════════════════════════════════════════ */
function panelSettings() {
  var s = D.settings, p = document.getElementById("panel");
  function numRow(label, id, val) {
    return '<label>' + label + '</label><input class="input" type="number" id="' + id + '" value="' + val + '">';
  }
  p.innerHTML =
    '<div class="card"><h3>Event Settings</h3>' +
    '<div class="grid cols2">' +
      numRow("Round 1 minutes", "s_r1", s.durations.r1 || 15) +
      numRow("Round 2 minutes", "s_r2", s.durations.r2 || 10) +
      numRow("Round 3 minutes", "s_r3", s.durations.r3 || 15) +
      numRow("Round 4 total minutes (Coding + Debug)", "s_r4", s.durations.r4 || 20) +
      numRow("  └─ R4 Coding phase minutes (default 15)", "s_r4cod", s.r4CodingMinutes || 15) +
      numRow("  └─ R4 Debug phase minutes (default 5)", "s_r4dbg", s.r4DebugMinutes || 5) +
      numRow("Tie-break minutes", "s_tb", s.durations.tiebreak || 5) +
      numRow("R4: Coding Statements to Solve (out of 5)", "s_r4req", s.r4RequiredTasks || 3) +
      numRow("Puzzle points (R3 Part A)", "s_pp", s.points.puzzle || 3) +
      numRow("Crossword max points (R3 Part B)", "s_cw", s.points.crossword || 10) +
      numRow("R4 task points (each)", "s_t4", s.points.r4task || 10) +
      numRow("R4 Debug points", "s_dg", s.points.debug || 20) +
    "</div>" +
    '<p class="hint" style="margin-top:10px">Admin password: <b>' + TT.esc(C.adminPassword) + "</b> (change in js/config.js)</p>" +
    '\u003cbutton class="btn" id="saveSet" style="margin-top:10px">Save Settings\u003c/button>\u003c/div>';

  document.getElementById("saveSet").onclick = function () {
    function n(id) { return parseInt(v(id), 10) || 0; }
    s.durations.r1 = n("s_r1"); s.durations.r2 = n("s_r2");
    s.durations.r3 = n("s_r3"); s.durations.r4 = n("s_r4"); s.durations.tiebreak = n("s_tb");
    s.r4CodingMinutes = Math.max(5, Math.min(18, n("s_r4cod") || 15));
    s.r4DebugMinutes  = Math.max(2, Math.min(10, n("s_r4dbg") || 5));
    s.r4RequiredTasks = Math.max(1, Math.min(5, n("s_r4req") || 3));
    s.points.puzzle = n("s_pp"); s.points.crossword = n("s_cw");
    s.points.r4task = n("s_t4"); s.points.debug = n("s_dg");
    TT.toast("Settings saved in memory — Export data.js to make permanent", "good");
  };
}

/* ═══════════════════════════════════════════════════════════
   THIS MACHINE  (Delete team → clears all rounds + DQ)
   ═══════════════════════════════════════════════════════════ */
function panelMachine() {
  var p = document.getElementById("panel"), t = TT.getTeam();
  var h = '<div class="card"><h3>Registered Team (this machine)</h3>';

  if (t) {
    h += '<p><b>' + TT.esc(t.name) + '</b><br>' +
      '<span class="hint">Members: ' + TT.esc(t.members.join(", ")) + ' · Code: ' + TT.esc(t.code) + '</span></p>';
    h += '<div style="margin:12px 0">';
    ["r1","r2","r3","r4"].forEach(function(r){
      var st = TT.getState(r);
      var statusColor = st.status === "done" ? "var(--good)" : st.status === "live" ? "var(--warn)" : st.status === "dq" ? "var(--bad)" : "var(--muted)";
      h += '<div class="msg info" style="display:flex;justify-content:space-between;margin:4px 0">' +
        '<span>' + ({r1:"🧠 Prelims",r2:"🏢 Corporate",r3:"🖼️ Visual",r4:"⚡ Rush"}[r]) + '</span>' +
        '<b style="color:' + statusColor + '">' + st.status.toUpperCase() +
        (st.status === "done" ? " · " + (st.score || 0) + " pts" : "") + '</b></div>';
    });
    h += '</div>';
  } else {
    h += '<p class="hint">No team registered on this machine.</p>';
  }

  h += '<button class="btn small danger" id="delTeam" style="margin-top:10px">Delete Team &amp; Reset All Rounds</button></div>';

  h += '<div class="card"><h3>Round Controls (this machine)</h3>' +
    '<p class="hint">Reset individual rounds for testing. Full delete above resets everything.</p>';
  ["r1","r2","r3","r4","tiebreak"].forEach(function (r) {
    var st = TT.getState(r).status;
    var color = st === "done" ? "var(--good)" : st === "live" ? "var(--warn)" : st === "dq" ? "var(--bad)" : "var(--muted)";
    h += '<div class="msg info" style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">' +
      '<span><b>' + r.toUpperCase() + '</b> — <span style="color:' + color + '">' + st.toUpperCase() + '</span></span>' +
      '<button class="btn small ghost rstRound" data-r="' + r + '">Reset to Locked</button></div>';
  });
  h += "</div>";

  h += '<div class="card" style="border-color:var(--bad)">' +
    '<h3 style="color:var(--bad)">Cleanup Toolkit</h3>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn warn" id="wipeScores">Clear Island Scores</button>' +
      '<button class="btn danger" id="factory">⚠️ Factory Reset</button>' +
    '</div>' +
    '<p class="hint" style="margin-top:8px">Factory reset removes team, all round progress, DQ flags, and boards from this browser. Questions are NOT touched.</p></div>';

  p.innerHTML = h;

  document.getElementById("delTeam").onclick = function () {
    TT.confirmBox(
      "Delete team registration AND reset all rounds on this machine? (Scores already pushed to Firebase or score.js are preserved.)",
      function () {
        try {
          localStorage.removeItem(C.store.team);
          localStorage.removeItem(C.store.dq);
          var toKill = [];
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf("tt_round_") === 0) toKill.push(k);
          }
          toKill.forEach(function (k) { localStorage.removeItem(k); });
        } catch (e) {}
        TT.toast("Team deleted + all rounds reset ✅", "good");
        setTimeout(function () { location.reload(); }, 400);
      },
      "Delete & Reset"
    );
  };

  Array.prototype.forEach.call(document.querySelectorAll(".rstRound"), function (b) {
    b.onclick = function () {
      var r = b.getAttribute("data-r");
      TT.lsSet(TT.rKey(r), { status: "locked" });
      if (TT.getState(r).status === "dq") TT.clearGlobalDQ && TT.clearGlobalDQ();
      TT.toast(r.toUpperCase() + " reset to locked", "good");
      panelMachine();
    };
  });

  document.getElementById("wipeScores").onclick = function () {
    TT.confirmBox("Clear the local island team records?", function () {
      TT.lsSet("tt_local_teams", []);
      TT.lsSet(BOARD, []);
      TT.toast("Board cleared", "good");
      panelMachine();
    }, "Clear");
  };

  document.getElementById("factory").onclick = function () {
    TT.confirmBox("FACTORY RESET: wipes team, all round states, DQ flags, boards, and archive from this browser. Questions untouched. Continue?", function () {
      var kill = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("tt_") === 0) kill.push(k);
      }
      kill.forEach(function (k) { localStorage.removeItem(k); });
      location.reload();
    }, "Factory Reset");
  };
}

})();