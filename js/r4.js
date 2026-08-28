/* ============================================================
   TECH TRIVIA — js/r4.js   Round 4: Rapid Rush
   Stage 1  ─ Select designated problem statements (e.g. 3 of 5)
   Stage 2  ─ 15-min Coding phase: code selected tasks, partial
               credit, speed bonus, dynamic test anti-cheat
   Stage 3  ─ 5-min Debug phase (Top 3 by organizer key):
               Select ONE debug question from 10, then fix only that
   ============================================================ */

(function () {
"use strict";
var D = window.TT_DATA, TT = window.TT;
TT.r4 = {};

TT.r4.init = function () {
  var main = document.getElementById("main");
  if (!TT.requireTeam()) return;
  var verdict = TT.enterRound("r4");
  if (verdict === "locked") {
    TT.keyGate("r4", "main", {
      title: "⚡ Round 4 — Rapid Rush",
      desc: "Top 5 teams — Problem Selection (3 of 5), Coding (15 min) & Debugging (5 min)"
    }, function () {
      TT.setState("r4", { entered: true });
      TT.arm("r4");
      TT.r4.run();
    });
    return;
  }
  if (verdict === "start") { TT.r4.run(); return; }
  main.innerHTML = TT.resultPanel("r4");
};

TT.r4.run = function () {
  var main = document.getElementById("main");

  var tasks    = D.r4.tasks  || [];
  var dbgList  = Array.isArray(D.r4.debug) ? D.r4.debug : (D.r4.debug ? [D.r4.debug] : []);
  var taskPts  = D.settings.points.r4task || 10;
  var dbgPts   = D.settings.points.debug  || 20;
  var reqCount = Math.max(1, Math.min(tasks.length, parseInt(D.settings.r4RequiredTasks || 3, 10)));
  var codingMin = parseInt(D.settings.r4CodingMinutes || 15, 10);
  var debugMin  = parseInt(D.settings.r4DebugMinutes  || 5,  10);
  var codingSec = codingMin * 60;
  var debugSec  = debugMin  * 60;

  var finished = false;
  var _codTimerStart = null;
  var _debugTimerId = null;

  // ──────────────────────────────────────────────────
  // Scaffold: topbar + python status + mount
  // ──────────────────────────────────────────────────
  main.innerHTML =
    '<div class="topbar">' +
      '<div><b>⚡ Round 4 — Rapid Rush</b><br><span class="hint" id="r4prog"></span></div>' +
      '<div id="r4TimerWrap" style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">' +
        '<div class="timer" id="r4CodTimer" style="font-size:20px">⏱ --:--</div>' +
        '<div id="r4DbgTimerRow" class="hide" style="display:flex;align-items:center;gap:6px">' +
          '<span style="font-size:12px;color:var(--warn);font-weight:600">🛠 Debug:</span>' +
          '<div class="timer" id="r4DbgTimer" style="font-size:16px;color:var(--warn)">--:--</div>' +
        '</div>' +
      '</div>' +
      '<button class="btn small danger" id="r4FinalizeBtn">Finalize Round 4</button>' +
    '</div>' +
    '<div class="msg info" id="pyStatus">⏳ Loading Python engine…</div>' +
    '<div id="r4Mount"></div>';

  TT.preloadPython(function (err) {
    var el = document.getElementById("pyStatus");
    if (!el) return;
    if (TT.py.ready) { el.className = "msg good"; el.textContent = "✅ Python engine READY — write code and press RUN."; }
    else { el.className = "msg bad"; el.textContent = "❌ Python engine blocked. Inform organiser."; }
  });

  // ──────────────────────────────────────────────────
  // Save all textareas across all tasks safely
  // ──────────────────────────────────────────────────
  function saveAllDrafts() {
    var st = TT.getState("r4");
    var dr = st.drafts ? JSON.parse(JSON.stringify(st.drafts)) : {};
    document.querySelectorAll("textarea.code").forEach(function (ta) {
      var tid = ta.id.replace("code_", "");
      if (tid === "dbgCode") {
        TT.setState("r4", { debugDraft: ta.value });
      } else if (tid) {
        dr[tid] = ta.value;
      }
    });
    TT.setState("r4", { drafts: dr });
    return dr;
  }

  // ──────────────────────────────────────────────────
  // Read fresh state every render call
  // ──────────────────────────────────────────────────
  function render() {
    var st = TT.getState("r4");
    var selTasks   = st.selectedTasks  || [];
    var solved     = st.solved         || {};
    var drafts     = st.drafts         || {};
    var partials   = st.partials       || {};
    var codingDone = !!st.codingDone;
    var debugOpen  = !!st.debugOpen;
    var debugDone  = !!st.debugDone;

    function countSolvedFull() {
      var n = 0;
      selTasks.forEach(function (tid) { if (solved[tid] === true) n++; });
      return n;
    }

    // ── Progress label ──
    var progEl = document.getElementById("r4prog");
    if (progEl) {
      if (!st.selectionConfirmed) {
        progEl.innerHTML = "<b>Step 1: Select</b> — chosen " + selTasks.length + " / " + reqCount;
      } else if (!codingDone) {
        progEl.innerHTML = "<b>Step 2: Coding</b> (" + codingMin + " min) — " + countSolvedFull() + "/" + selTasks.length + " fully solved";
      } else if (!debugDone) {
        progEl.innerHTML = "<b>Coding " + (st.codingScore || 0) + " pts</b> · Step 3: Debugging (" + debugMin + " min)";
      } else {
        progEl.innerHTML = "<b>Coding " + (st.codingScore || 0) + " pts</b> · <b>Debug +" + dbgPts + " pts</b> · Done ✅";
      }
    }

    // ── STAGE 1: SELECTION ──────────────────────────
    if (!st.selectionConfirmed) {
      var hSel =
        '<div class="card" style="border-color:var(--cyan);margin-bottom:16px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
            '<div>' +
              '<h3 style="color:var(--cyan);margin:0">📋 Step 1: Select Problem Statements</h3>' +
              '<p class="hint" style="margin:4px 0 0">Pick <b>exactly ' + reqCount + ' out of ' + tasks.length + '</b> problems to solve. You cannot change after confirming.</p>' +
            '</div>' +
            '<button id="confirmSelBtn" class="btn ' + (selTasks.length === reqCount ? "success" : "ghost") + '"' +
              (selTasks.length === reqCount ? "" : " disabled") + '>' +
              '🚀 Start Coding (' + selTasks.length + '/' + reqCount + ' selected)' +
            '</button>' +
          '</div>' +
        '</div>';

      tasks.forEach(function (t, i) {
        var isChosen = selTasks.indexOf(t.id) >= 0;
        hSel +=
          '<div class="card" style="' + (isChosen ? "border-color:var(--good);background:rgba(61,220,132,.04);" : "") + 'margin-bottom:14px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">' +
              '<h3 style="margin:0">Problem Statement ' + (i + 1) +
                (isChosen ? ' <span style="color:var(--good);font-size:13px">✓ SELECTED</span>' : '') + '</h3>' +
              '<button class="btn small ' + (isChosen ? "danger" : "ghost") + ' selToggle" data-id="' + t.id + '">' +
                (isChosen ? 'Remove ✕' : 'Select ➕') +
              '</button>' +
            '</div>' +
            '<p style="margin:8px 0;white-space:pre-wrap;font-size:15px;line-height:1.6">' + TT.esc(t.t) + '</p>' +
            '<p class="hint" style="margin:6px 0 4px">Expected output:</p>' +
            '<div class="io-box" style="max-height:120px">' + TT.esc(TT.dec(t.expected)) + '</div>' +
          '</div>';
      });

      document.getElementById("r4Mount").innerHTML = hSel;

      document.querySelectorAll(".selToggle").forEach(function (b) {
        b.onclick = function () {
          var st2 = TT.getState("r4");
          var sel = st2.selectedTasks ? st2.selectedTasks.slice() : [];
          var id = b.getAttribute("data-id");
          var idx = sel.indexOf(id);
          if (idx >= 0) {
            sel.splice(idx, 1);
          } else {
            if (sel.length >= reqCount) { TT.toast("Select only " + reqCount + " statements — remove one first.", "warn"); return; }
            sel.push(id);
          }
          TT.setState("r4", { selectedTasks: sel });
          render();
        };
      });

      var cBtn = document.getElementById("confirmSelBtn");
      if (cBtn) {
        cBtn.onclick = function () {
          var st2 = TT.getState("r4");
          var sel = st2.selectedTasks || [];
          if (sel.length !== reqCount) { TT.toast("Please select exactly " + reqCount + " statements.", "warn"); return; }
          TT.confirmBox(
            "Confirm your " + reqCount + " selected statements and start the " + codingMin + "-minute coding phase?",
            function () {
              TT.setState("r4", { selectionConfirmed: true, codingStartedAt: Date.now() });
              startCodingTimer();
              render();
            },
            "Start Coding"
          );
        };
      }
      return;
    }

    // ── STAGE 2: CODING ─────────────────────────────
    if (!codingDone) {
      if (!st.codingStartedAt) {
        TT.setState("r4", { codingStartedAt: Date.now() });
      }
      startCodingTimer();

      var h =
        '<div class="card tight" style="border-color:var(--cyan);margin-bottom:18px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
            '<div>' +
              '<h3 style="color:var(--cyan);margin:0">💻 Step 2: Code Your ' + selTasks.length + ' Selected Statements</h3>' +
              '<p class="hint" style="margin:4px 0 0">You have <b>' + codingMin + ' minutes</b> to code. Partial credit is awarded for close output.</p>' +
            '</div>' +
            '<button id="submitCodingBtn" class="btn success">✅ Submit Coding (' + countSolvedFull() + '/' + selTasks.length + ' solved)</button>' +
          '</div>' +
        '</div>';

      selTasks.forEach(function (tid, slot) {
        var tObj = null;
        tasks.forEach(function (x) { if (x.id === tid) tObj = x; });
        if (!tObj) return;
        var isDone = solved[tid] === true;
        var partPts = partials[tid] || 0;
        var statusNote = isDone
          ? '<span style="color:var(--good)" id="statusBadge_' + tid + '">✅ SOLVED — full ' + taskPts + ' pts</span>'
          : (partPts > 0 ? '<span style="color:var(--warn)" id="statusBadge_' + tid + '">⚠️ Partial credit: ' + partPts + ' pts</span>' : '<span id="statusBadge_' + tid + '"></span>');

        h +=
          '<div class="card" id="card_' + tid + '" style="' + (isDone ? "border-color:var(--good);background:rgba(61,220,132,.04);" : (partPts > 0 ? "border-color:var(--warn);" : "")) + 'margin-bottom:18px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
              '<h3>Coding Task ' + (slot + 1) + ' — ' + statusNote + '</h3>' +
              '<span class="rank-pill' + (isDone ? " gold" : "") + '">' + taskPts + ' pts</span>' +
            '</div>' +
            '<p style="margin:10px 0;white-space:pre-wrap;font-size:15px;line-height:1.6">' + TT.esc(tObj.t) + '</p>' +
            '<p class="hint">Expected output:</p>' +
            '<div class="io-box" style="max-height:160px">' + TT.esc(TT.dec(tObj.expected)) + '</div>' +
            '<label>Your Python Code</label>' +
            '<textarea class="code" id="code_' + tid + '" placeholder="Write your Python program here…">' +
              TT.esc(drafts[tid] || "") + '</textarea>' +
            '<div style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
              '<button class="btn runBtn" data-id="' + tid + '">▶ RUN &amp; TEST</button>' +
              '<span class="hint" id="msg_' + tid + '">' + (isDone ? "✅ Output verified — full points secured" : (partPts > 0 ? "⚠️ Partial output match — " + partPts + " pts earned" : "")) + '</span>' +
            '</div>' +
            '<div class="io-box hide" id="out_' + tid + '" style="margin-top:10px"></div>' +
          '</div>';
      });

      document.getElementById("r4Mount").innerHTML = h;

      selTasks.forEach(function (tid) {
        var ta = document.getElementById("code_" + tid);
        if (ta) {
          ta.oninput = function () {
            var st2 = TT.getState("r4");
            var dr = st2.drafts ? JSON.parse(JSON.stringify(st2.drafts)) : {};
            dr[tid] = ta.value;
            TT.setState("r4", { drafts: dr });
          };
        }
      });

      document.querySelectorAll(".runBtn").forEach(function (b) {
        b.onclick = function () { runTask(b.getAttribute("data-id")); };
      });

      var subBtn = document.getElementById("submitCodingBtn");
      if (subBtn) {
        subBtn.onclick = function () {
          saveAllDrafts();
          var solved2 = TT.getState("r4").solved || {};
          var n = 0;
          selTasks.forEach(function (tid) { if (solved2[tid] === true) n++; });
          if (n < selTasks.length) {
            TT.confirmBox("You solved " + n + "/" + selTasks.length + ". Submit coding now?", function () { finishCoding(); }, "Submit Coding");
          } else {
            finishCoding();
          }
        };
      }
      return;
    }

    // ── STAGE 3: RESULT + DEBUGGING ─────────────────
    // Card 1: Coding Score
    h = '<div class="card center" style="border-color:var(--cyan);margin-bottom:20px">' +
      '<div style="font-size:36px;margin-bottom:8px">💻</div>' +
      '<h2 style="color:var(--cyan);margin:0 0 8px">Division 1: Coding Score</h2>' +
      '<div style="font-size:52px;font-weight:800;color:var(--good);margin:8px 0">' + (st.codingScore || 0) + ' pts</div>' +
      '<p class="hint">' +
        'Tasks fully solved: <b>' + (st.codingSolved || 0) + '/' + selTasks.length + '</b> · ' +
        'Base pts: <b>' + (st.codingBase || 0) + '</b> · ' +
        'Speed bonus: <b>+' + (st.codingBonus || 0) + '</b> · ' +
        'Partial credit: <b>+' + (st.codingPartial || 0) + '</b><br>' +
        'Coding time: <b>' + TT.fmt(st.codingTime || 0) + '</b>' +
      '</p>' +
    '</div>';

    // Card 2: Debug Division
    h += '<div class="card" style="border-color:var(--warn);margin-bottom:20px">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">' +
        '<span style="font-size:32px">🛠️</span>' +
        '<div>' +
          '<h3 style="color:var(--warn);margin:0">Division 2: Debugging Round (Top 3 Teams)</h3>' +
          '<p class="hint" style="margin:2px 0 0">Only Top 3 teams unlock this with the organizer key · <b>' + dbgPts + ' pts</b></p>' +
        '</div>' +
      '</div>';

    if (!debugOpen) {
      // Unlock gate
      h += '<div id="dbgKeyRow" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;max-width:560px">' +
        '<input class="input" id="dbgKey" placeholder="Enter organizer debug key…" autocomplete="off">' +
        '<button class="btn warn" id="dbgUnlockBtn">🔓 Unlock Debugging</button>' +
        '</div><div id="dbgKeyMsg"></div>';
    } else {
      // Debug unlocked — check if question selected
      var selectedDbgId = st.selectedDebugId || null;
      var dbgObj = null;
      if (selectedDbgId) {
        for (var di = 0; di < dbgList.length; di++) {
          if (dbgList[di].id === selectedDbgId) { dbgObj = dbgList[di]; break; }
        }
      }

      if (!selectedDbgId) {
        // Question selection screen
        h += '<div style="border-top:1px solid rgba(255,215,106,.2);padding-top:14px;margin-top:10px">';
        h += '<h3 style="color:var(--warn);margin:0 0 10px">🎯 Select ONE Debug Question</h3>';
        h += '<p class="hint" style="margin:0 0 14px">Read all ' + dbgList.length + ' questions carefully. Select one — you <b>cannot change</b> it after selection. You fix only that question.</p>';
        dbgList.forEach(function (dq, di) {
          h += '<div class="card" style="border-color:rgba(255,215,106,.3);margin-bottom:14px">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:8px">' +
              '<h3 style="margin:0;color:var(--warn)">Debug Question ' + (di + 1) + '</h3>' +
              '<button class="btn warn small dbgPickBtn" data-id="' + dq.id + '" data-num="' + (di + 1) + '">Select This ➡️</button>' +
            '</div>' +
            '<pre style="margin:6px 0;white-space:pre-wrap;font-size:14px;line-height:1.7;color:var(--ink)">' + TT.esc(dq.t) + '</pre>' +
          '</div>';
        });
        h += '</div>';
      } else if (!dbgObj) {
        h += '<p class="hint" style="padding:10px">Debug question data not found. Contact organizer.</p>';
      } else if (!st.debugStarted) {
        // Step: Question selected, show read-only statement + confirm to start
        h += '<div style="border-top:1px solid rgba(255,215,106,.2);padding-top:14px;margin-top:10px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:14px">' +
            '<div>' +
              '<h3 style="color:var(--warn);margin:0 0 4px">🔒 Debug Question Locked</h3>' +
              '<p class="hint" style="margin:0">You have selected this question. Read it carefully, then click <b>Start Debugging</b>.</p>' +
            '</div>' +
            '<button class="btn warn" id="dbgStartBtn">🛠 Start Debugging →</button>' +
          '</div>' +
          '<div class="card" style="border-color:rgba(255,215,106,.4);background:rgba(255,215,106,.03);margin-bottom:12px">' +
            '<h4 style="color:var(--warn);margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px">Problem Statement (Read-Only)</h4>' +
            '<pre style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.7;color:var(--ink)">' + TT.esc(dbgObj.t) + '</pre>' +
          '</div>' +
          '<p class="hint" style="margin:0 0 6px">Buggy Starter Code (Read-Only):</p>' +
          '<pre class="io-box" style="margin:0 0 10px;font-family:var(--font-mono);font-size:13px;line-height:1.6;user-select:text;white-space:pre-wrap">' + TT.esc(dbgObj.starter || "") + '</pre>' +
          '<p class="hint" style="margin:0">Expected output:</p>' +
          '<div class="io-box" style="margin-top:6px">' + TT.esc(TT.dec(dbgObj.expected)) + '</div>' +
        '</div>';
      } else {
        // Step: Debugging started — show fix interface
        var dbgPartPts = st.debugPartial || 0;
        var dbgStatusNote = debugDone
          ? '<span style="color:var(--good)">✅ SOLVED — +' + dbgPts + ' pts</span>'
          : (dbgPartPts > 0 ? '<span style="color:var(--warn)">⚠️ Partial: +' + dbgPartPts + ' pts</span>' : '');

        h += '<div style="border-top:1px solid rgba(255,215,106,.2);padding-top:14px;margin-top:10px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
            '<h3 style="color:var(--warn);margin:0">🛠 Debug Challenge' + (dbgStatusNote ? ' — ' + dbgStatusNote : '') + '</h3>' +
            '<span class="rank-pill gold">' + dbgPts + ' pts</span>' +
          '</div>' +

          // Problem statement — read-only collapsed view
          '<details style="margin-bottom:12px">' +
            '<summary style="cursor:pointer;color:var(--warn);font-size:13px;font-weight:600;padding:6px 10px;background:rgba(255,215,106,.05);border:1px solid rgba(255,215,106,.2);border-radius:6px;list-style:none">📋 View Problem Statement (Read-Only) ▼</summary>' +
            '<div style="margin-top:8px;padding:12px;background:rgba(255,215,106,.03);border:1px solid rgba(255,215,106,.15);border-radius:6px">' +
              '<pre style="margin:0;white-space:pre-wrap;font-size:13px;line-height:1.6;color:var(--ink)">' + TT.esc(dbgObj.t) + '</pre>' +
            '</div>' +
          '</details>' +

          // Reference buggy code — read-only
          '<p class="hint" style="margin:0 0 4px;font-size:12px">Buggy Starter Code (Reference — Read-Only):</p>' +
          '<pre class="io-box" style="margin:0 0 14px;font-family:var(--font-mono);font-size:13px;line-height:1.6;user-select:text;white-space:pre-wrap;border-color:rgba(255,84,112,.25)">' + TT.esc(dbgObj.starter || "") + '</pre>' +

          '<p class="hint" style="margin:0 0 4px;font-size:12px">Expected output:</p>' +
          '<div class="io-box" style="margin-bottom:14px">' + TT.esc(TT.dec(dbgObj.expected)) + '</div>' +

          '<label style="font-size:13px;color:var(--warn)">✏️ Write Your Fixed Code Below</label>' +
          '<textarea class="code" id="dbgCode">' +
            TT.esc(st.debugDraft || dbgObj.starter || '') + '</textarea>' +
          '<div style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
            '<button class="btn warn" id="dbgRunBtn">▶ RUN &amp; TEST FIX</button>' +
            '<span class="hint" id="dbgMsg">' + (debugDone ? '✅ Debug solved — +' + dbgPts + ' pts!' : (dbgPartPts > 0 ? '⚠️ Partial match — +' + dbgPartPts + ' pts' : '')) + '</span>' +
          '</div>' +
          '<div class="io-box hide" id="dbgOut" style="margin-top:10px"></div>' +
        '</div>';
      }
    }
    h += '</div>';

    // Card 3: Overall Summary
    var totalR4 = (st.codingScore || 0) + (debugDone ? dbgPts : (st.debugPartial || 0));
    h += '<div class="card center" style="border-color:var(--cyan)">' +
      '<h3>🏆 Round 4 — Overall Score</h3>' +
      '<div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin:16px 0">' +
        '<div class="card tight center" style="min-width:130px;border-color:rgba(77,216,255,.3)">' +
          '<div class="hint">Coding Division</div>' +
          '<div style="font-size:28px;font-weight:700;color:var(--cyan)">' + (st.codingScore || 0) + ' pts</div>' +
        '</div>' +
        '<div class="card tight center" style="min-width:130px;border-color:rgba(255,215,106,.3)">' +
          '<div class="hint">Debugging Division</div>' +
          '<div style="font-size:28px;font-weight:700;color:var(--warn)">' + (debugDone ? dbgPts : (st.debugPartial || 0)) + ' pts</div>' +
        '</div>' +
        '<div class="card tight center" style="min-width:130px;border-color:var(--good)">' +
          '<div class="hint">Round 4 Total</div>' +
          '<div style="font-size:28px;font-weight:800;color:var(--good)">' + totalR4 + ' pts</div>' +
        '</div>' +
      '</div>' +
      '<button class="btn block" id="r4ViewResultsBtn" style="margin-top:6px">🏁 View Event Grand Total →</button>' +
    '</div>';

    document.getElementById("r4Mount").innerHTML = h;

    // Wire up event handlers
    if (!debugOpen) {
      document.getElementById("dbgUnlockBtn").onclick = function () {
        var k = (document.getElementById("dbgKey") || {}).value || "";
        if (!TT.checkKey("debug", k)) {
          document.getElementById("dbgKeyMsg").innerHTML = '<div class="msg bad">❌ Invalid key — ask organiser.</div>';
          return;
        }
        TT.setState("r4", { debugOpen: true, debugStartedAt: Date.now() });
        startDebugTimer();
        TT.toast("Debug Round unlocked!", "good");
        render();
      };
    } else if (!st.selectedDebugId) {
      // Bind pick buttons — once clicked, lock the selection
      document.querySelectorAll(".dbgPickBtn").forEach(function (btn) {
        btn.onclick = function () {
          var did = btn.getAttribute("data-id");
          var num = btn.getAttribute("data-num");
          TT.confirmBox(
            "Select Debug Question " + num + "? You CANNOT change your debug question after this.",
            function () {
              TT.setState("r4", { selectedDebugId: did });
              TT.toast("Debug Question " + num + " locked in! Read it, then click Start Debugging.", "warn");
              render();
            },
            "Lock In Selection"
          );
        };
      });
    } else if (!st.debugStarted) {
      // Question selected, not yet started — bind the Start Debugging button
      var startBtn = document.getElementById("dbgStartBtn");
      if (startBtn) {
        startBtn.onclick = function () {
          TT.confirmBox(
            "Start Debugging? Once you start, the timer begins and you cannot change your question.",
            function () {
              TT.setState("r4", { debugStarted: true });
              TT.toast("Debugging started! Fix the code and RUN to test.", "warn");
              render();
            },
            "Start Debugging"
          );
        };
      }
    } else {
      if (!debugDone) startDebugTimer();
      var dbgTa = document.getElementById("dbgCode");
      if (dbgTa) {
        dbgTa.oninput = function () {
          TT.setState("r4", { debugDraft: dbgTa.value });
        };
      }
      var dbgRun = document.getElementById("dbgRunBtn");
      if (dbgRun) dbgRun.onclick = runDebugTask;
    }

    var resBtn = document.getElementById("r4ViewResultsBtn");
    if (resBtn) resBtn.onclick = function () { doFinalize(false); };
  }

  // ── CODING TIMER ────────────────────────────────
  function startCodingTimer() {
    var st = TT.getState("r4");
    if (!st.codingStartedAt) return;
    var elapsed = Math.floor((Date.now() - st.codingStartedAt) / 1000);
    var rem = Math.max(0, codingSec - elapsed);
    var el = document.getElementById("r4CodTimer");
    if (!el) return;
    el.textContent = "⏱ " + fmtSec(rem);
    if (rem <= 0) { onCodingTimeUp(); return; }
    if (_codTimerStart) return;
    _codTimerStart = setInterval(function () {
      var st2 = TT.getState("r4");
      if (st2.codingDone) { clearInterval(_codTimerStart); _codTimerStart = null; return; }
      var el2 = document.getElementById("r4CodTimer");
      if (!el2) { clearInterval(_codTimerStart); _codTimerStart = null; return; }
      var elapsed2 = Math.floor((Date.now() - st2.codingStartedAt) / 1000);
      var rem2 = Math.max(0, codingSec - elapsed2);
      el2.textContent = "⏱ " + fmtSec(rem2);
      if (rem2 <= 0) { clearInterval(_codTimerStart); _codTimerStart = null; onCodingTimeUp(); }
    }, 1000);
  }

  function onCodingTimeUp() {
    var st = TT.getState("r4");
    if (st.codingDone) return;
    TT.toast("⏰ Coding time up! Auto-submitting…", "warn");
    finishCoding();
  }

  // ── DEBUG TIMER ─────────────────────────────────
  function startDebugTimer() {
    var st = TT.getState("r4");
    if (!st.debugStartedAt) return;
    var dbgRow = document.getElementById("r4DbgTimerRow");
    if (dbgRow) dbgRow.classList.remove("hide");
    var elapsed = Math.floor((Date.now() - st.debugStartedAt) / 1000);
    var rem = Math.max(0, debugSec - elapsed);
    var el = document.getElementById("r4DbgTimer");
    if (el) el.textContent = fmtSec(rem);
    if (rem <= 0) { onDebugTimeUp(); return; }
    if (_debugTimerId) return;
    _debugTimerId = setInterval(function () {
      var st2 = TT.getState("r4");
      if (st2.debugDone) { clearInterval(_debugTimerId); _debugTimerId = null; return; }
      var el2 = document.getElementById("r4DbgTimer");
      if (!el2) { clearInterval(_debugTimerId); _debugTimerId = null; return; }
      var elapsed2 = Math.floor((Date.now() - st2.debugStartedAt) / 1000);
      var rem2 = Math.max(0, debugSec - elapsed2);
      el2.textContent = fmtSec(rem2);
      if (rem2 <= 0) { clearInterval(_debugTimerId); _debugTimerId = null; onDebugTimeUp(); }
    }, 1000);
  }

  function onDebugTimeUp() {
    var st = TT.getState("r4");
    if (st.debugDone || !st.debugOpen) return;
    TT.toast("⏰ Debug time up — submitting.", "warn");
    doFinalize(true);
  }

  function fmtSec(s) {
    var m = Math.floor(s / 60), sec = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  // ── RUN CODING TASK WITH DYNAMIC TEST VALIDATION ──
  function runTask(id) {
    saveAllDrafts(); // sync all editor inputs first

    var tObj = null;
    tasks.forEach(function (t) { if (t.id === id) tObj = t; });
    if (!tObj) return;

    var ta  = document.getElementById("code_" + id);
    var msg = document.getElementById("msg_" + id);
    var out = document.getElementById("out_" + id);
    var card = document.getElementById("card_" + id);
    var badge = document.getElementById("statusBadge_" + id);
    var btn = document.querySelector('.runBtn[data-id="' + id + '"]');
    var code = ta ? ta.value.trim() : "";

    if (!code) { TT.toast("Write some code first", "warn"); return; }
    if (!TT.py.ready) { TT.toast("Python engine loading — wait a moment", "warn"); return; }

    var expDecoded = TT.dec(tObj.expected);

    btn.disabled = true;
    if (msg) msg.textContent = "⏳ Running & validating test cases…";
    if (out) { out.classList.remove("hide"); out.className = "io-box"; out.textContent = "Running test cases…"; }

    TT.evaluateCodingTask(id, code, expDecoded, taskPts).then(function (res) {
      btn.disabled = false;
      var st2 = TT.getState("r4");
      var solvedMap   = st2.solved   ? JSON.parse(JSON.stringify(st2.solved))   : {};
      var partialsMap = st2.partials ? JSON.parse(JSON.stringify(st2.partials)) : {};

      if (res.isCheat) {
        if (out) { out.className = "io-box err"; out.textContent = res.cheatMsg + (res.out ? "\n─── output ───\n" + res.out : ""); }
        if (msg) msg.textContent = "❌ Cheat detected (0 pts)";
        if (card) { card.style.borderColor = "var(--bad)"; card.style.background = "rgba(255,84,112,.04)"; }
        if (badge) badge.innerHTML = '<span style="color:var(--bad)">❌ CHEAT (0 pts)</span>';
        solvedMap[id] = false;
        partialsMap[id] = 0;
        TT.setState("r4", { solved: solvedMap, partials: partialsMap });
        TT.toast(res.cheatMsg, "bad");
      } else if (!res.ok) {
        if (out) { out.className = "io-box err"; out.textContent = "ERROR:\n" + res.err + (res.out ? "\n─── output ───\n" + res.out : ""); }
        if (msg) msg.textContent = "❌ Execution Error";
        if (card) card.style.borderColor = "";
      } else if (res.fullMatch) {
        if (out) { out.className = "io-box ok"; out.textContent = res.out || "(pass)"; }
        if (msg) msg.textContent = "✅ Output verified — full " + taskPts + " pts secured!";
        if (card) { card.style.borderColor = "var(--good)"; card.style.background = "rgba(61,220,132,.04)"; }
        if (badge) badge.innerHTML = '<span style="color:var(--good)">✅ SOLVED — full ' + taskPts + ' pts</span>';
        solvedMap[id] = true;
        partialsMap[id] = taskPts;
        TT.setState("r4", { solved: solvedMap, partials: partialsMap });
        TT.toast("🎉 PASS! Full " + taskPts + " pts secured!", "good");
      } else {
        var pts = res.pts || 0;
        if (pts > 0) {
          if (out) { out.className = "io-box warn"; out.textContent = (res.out || "") + "\n(Partial match: " + pts + "/" + taskPts + " pts)"; }
          if (msg) msg.textContent = "⚠️ Partial match — " + pts + " pts saved";
          if (card) { card.style.borderColor = "var(--warn)"; card.style.background = ""; }
          if (badge) badge.innerHTML = '<span style="color:var(--warn)">⚠️ Partial: ' + pts + ' pts</span>';
          solvedMap[id] = false;
          partialsMap[id] = pts;
          TT.setState("r4", { solved: solvedMap, partials: partialsMap });
          TT.toast("Partial credit: " + pts + " pts saved", "warn");
        } else {
          if (out) { out.className = "io-box err"; out.textContent = res.out || "(no output)"; }
          if (msg) msg.textContent = "❌ Output mismatch — 0 pts";
          if (card) card.style.borderColor = "";
          if (badge) badge.innerHTML = "";
          solvedMap[id] = false;
          partialsMap[id] = 0;
          TT.setState("r4", { solved: solvedMap, partials: partialsMap });
          TT.toast("Output does not match", "bad");
        }
      }

      // Update submit button solved counter
      var subBtn = document.getElementById("submitCodingBtn");
      var selT2 = st2.selectedTasks || [];
      var nSolved = 0;
      selT2.forEach(function (tid) { if (solvedMap[tid] === true) nSolved++; });
      if (subBtn) subBtn.textContent = "✅ Submit Coding (" + nSolved + "/" + selT2.length + " solved)";
    });
  }

  // ── RUN DEBUG TASK ──────────────────────────────
  function runDebugTask() {
    saveAllDrafts();

    var st = TT.getState("r4");
    var selectedDbgId = st.selectedDebugId;
    var dbgObj = null;
    for (var di = 0; di < dbgList.length; di++) {
      if (dbgList[di].id === selectedDbgId) { dbgObj = dbgList[di]; break; }
    }
    if (!dbgObj) { TT.toast("Debug question not found", "bad"); return; }

    var ta  = document.getElementById("dbgCode");
    var msg = document.getElementById("dbgMsg");
    var out = document.getElementById("dbgOut");
    var btn = document.getElementById("dbgRunBtn");
    var code = ta ? ta.value.trim() : "";
    var expDecoded = TT.dec(dbgObj.expected);

    if (!code) { TT.toast("Write some code first", "warn"); return; }
    if (!TT.py.ready) { TT.toast("Python engine loading", "warn"); return; }

    btn.disabled = true;
    if (msg) msg.textContent = "⏳ Testing fix…";
    if (out) { out.classList.remove("hide"); out.className = "io-box"; out.textContent = "Testing fix…"; }

    TT.evaluateCodingTask(selectedDbgId, code, expDecoded, dbgPts).then(function (res) {
      btn.disabled = false;
      var st2 = TT.getState("r4");

      if (res.isCheat) {
        if (out) { out.className = "io-box err"; out.textContent = res.cheatMsg; }
        if (msg) msg.textContent = "❌ Cheat detected (0 pts)";
        TT.setState("r4", { debugDone: false, debugPartial: 0 });
        TT.toast(res.cheatMsg, "bad");
      } else if (!res.ok) {
        if (out) { out.className = "io-box err"; out.textContent = "ERROR:\n" + res.err + (res.out ? "\n─── stdout ───\n" + res.out : ""); }
        if (msg) msg.textContent = "❌ Error in code";
      } else if (res.fullMatch) {
        if (out) { out.className = "io-box ok"; out.textContent = res.out || "(pass)"; }
        if (msg) msg.textContent = "✅ Debug task solved — +" + dbgPts + " pts!";
        var finalTot = (st2.codingScore || 0) + dbgPts;
        TT.setState("r4", { debugDone: true, debugScore: dbgPts, debugPartial: dbgPts, score: finalTot });
        TT.recordLocalScore("r4", finalTot, (st2.codingSolved || 0) + 1, TT.elapsed(TT.getState("r4")));
        TT.cloud.push("r4", finalTot, (st2.codingSolved || 0) + 1, TT.elapsed(TT.getState("r4")));
        TT.toast("🎉 DEBUG SOLVED! +" + dbgPts + " pts!", "good");
        render();
      } else {
        var pts = res.pts || 0;
        if (pts > 0) {
          if (out) { out.className = "io-box warn"; out.textContent = (res.out || "") + "\n(Partial debug fix: +" + pts + " pts)"; }
          if (msg) msg.textContent = "⚠️ Partial fix — +" + pts + " pts";
          TT.setState("r4", { debugPartial: pts });
          TT.toast("Partial debug credit: +" + pts + " pts", "warn");
        } else {
          if (out) { out.className = "io-box err"; out.textContent = res.out || "(output mismatch)"; }
          if (msg) msg.textContent = "❌ Output mismatch";
          TT.toast("Output doesn't match expected fix", "bad");
        }
      }
    });
  }

  // ── FINISH CODING ───────────────────────────────
  function finishCoding() {
    saveAllDrafts();
    if (_codTimerStart) { clearInterval(_codTimerStart); _codTimerStart = null; }
    var st = TT.getState("r4");
    if (st.codingDone) { render(); return; }

    var selT = st.selectedTasks || [];
    var solvedMap   = st.solved   || {};
    var partialsMap = st.partials || {};
    var codingStartedAt = st.codingStartedAt || (Date.now() - codingSec * 1000);
    var usedSec = Math.min(Math.floor((Date.now() - codingStartedAt) / 1000), codingSec);

    var n = 0, baseTotal = 0, partialTotal = 0;
    selT.forEach(function (tid) {
      if (solvedMap[tid] === true) {
        n++;
        baseTotal += taskPts;
      } else if (partialsMap[tid]) {
        partialTotal += partialsMap[tid];
      }
    });

    var bonus = TT.speedBonus(baseTotal, usedSec, codingSec);
    var cScore = baseTotal + bonus + partialTotal;

    TT.setState("r4", {
      codingDone: true,
      codingSolved: n,
      codingBase: baseTotal,
      codingBonus: bonus,
      codingPartial: partialTotal,
      codingScore: cScore,
      codingTime: usedSec,
      score: cScore + (st.debugScore || st.debugPartial || 0)
    });
    TT.recordLocalScore("r4", cScore, n, usedSec);
    TT.cloud.push("r4", cScore, n, usedSec);
    TT.toast("✅ Coding submitted! Score: " + cScore + " pts", "good");
    render();
  }

  // ── FINALIZE ROUND 4 ────────────────────────────
  function doFinalize(auto) {
    if (finished) return;
    finished = true;
    TT.disarm();
    if (_codTimerStart)  { clearInterval(_codTimerStart);  _codTimerStart  = null; }
    if (_debugTimerId)   { clearInterval(_debugTimerId);   _debugTimerId   = null; }
    if (TT.timer && TT.timer.stop) TT.timer.stop();

    var st = TT.getState("r4");
    if (!st.codingDone) finishCoding();
    st = TT.getState("r4");

    var finalScore   = (st.codingScore || 0) + (st.debugDone ? dbgPts : (st.debugPartial || 0));
    var finalCorrect = (st.codingSolved || 0) + (st.debugDone ? 1 : 0);
    TT.finishRound("r4", { correct: finalCorrect, points: finalScore, bonus: 0 });
    main.innerHTML = TT.resultPanel("r4");
    if (auto) TT.toast("Time up — Round 4 complete", "warn");
  }

  document.getElementById("r4FinalizeBtn").onclick = function () {
    TT.disarm();
    TT.confirmBox("Finalize Round 4 completely? Ensure coding and debugging are done.", function () {
      doFinalize(false);
    }, "Finalize");
  };

  render();
};

})();