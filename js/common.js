/* ============================================================
   TECH TRIVIA — js/common.js (CONSOLIDATED & FIXED)
   Shared UI: header/footer, countdown timer, toasts, confirm
   dialogs, round key-gate, result panel, image helpers, demos.
   ============================================================ */

(function () {
"use strict";
var C = window.TT_CONFIG, D = window.TT_DATA, TT = window.TT;

/* ================= MISC HELPERS ================= */
TT.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};
TT.fmt = function (s) {
  s = Math.max(0, Math.floor(s));
  var m = Math.floor(s / 60), ss = s % 60;
  return (m < 10 ? "0" : "") + m + ":" + (ss < 10 ? "0" : "") + ss;
};
TT.urlParam = function (n) { try { return new URLSearchParams(location.search).get(n); } catch (e) { return null; } };

/* ================= BOOT + HEADER/FOOTER ================= */
TT.boot = function (sub) {
  if (!C.isIsland && TT.cloud && TT.cloud.init) TT.cloud.init();
  TT.decorate(sub);
};
TT.teamBadgeHTML = function () {
  var t = TT.getTeam();
  if (!t) return '<span class="brand-sub">GUEST</span>';
  return '<span class="brand-sub" style="color:var(--cyan)">👥 ' + TT.esc(t.name) + "</span>";
};
TT.decorate = function (sub) {
  var h = document.createElement("header");
  h.className = "band";
  h.innerHTML =
    '<div class="brand">' +
      '<div class="ribbon">🚀</div>' +
      '<div>' +
        '<div class="brand-name">TECH <b>TRIVIA</b></div>' +
        '<div class="brand-sub">' + TT.esc(sub || "IT Quiz Championship") + "</div>" +
      "</div>" +
    "</div>" +
    '<div style="display:flex;align-items:center;gap:10px">' +
      TT.teamBadgeHTML() +
      '<span class="rank-pill" style="font-size:11px;letter-spacing:1px">' + MODE.toUpperCase() + "</span>" +
    "</div>";
  document.body.insertBefore(h, document.body.firstChild);

  var f = document.createElement("footer");
  f.className = "band";
  f.innerHTML =
    '<div class="foot-nav">' +
      '<a href="index.html">Home</a>' +
      '<a href="instructions.html">Instructions</a>' +
      '<a href="admin.html">Admin</a>' +
    "</div>" +
    "<div>TECH TRIVIA · " + MODE.toUpperCase() + " mode</div>";
  document.body.appendChild(f);

  /* ── Neon top-loader bar (cosmetic only) ── */
  var loader = document.getElementById("tt-loader");
  if (loader) {
    var pct = 0;
    var loaderTick = setInterval(function() {
      pct += (pct < 70 ? 8 : pct < 90 ? 3 : 1);
      if (pct >= 100) { pct = 100; clearInterval(loaderTick); setTimeout(function(){ loader.style.opacity="0"; }, 300); }
      loader.style.width = pct + "%";
    }, 40);
  }
};

/* ================= COUNTDOWN TIMER ================= */
TT.timer = {
  el: null, end: 0, tick: null,
  start: function (elId, secondsLeft, onZero, onTick) {
    var el = document.getElementById(elId);
    TT.timer.el = el;
    TT.timer.end = Date.now() + secondsLeft * 1000;
    var step = function () {
      var left = TT.timer.secondsLeft();
      if (el) {
        el.textContent = "⏱ " + TT.fmt(left);
        el.classList.toggle("low", left <= 60);
      }
      if (onTick) onTick(left);
      if (left <= 0 && TT.timer.tick) {
        clearInterval(TT.timer.tick); TT.timer.tick = null;
        if (onZero) onZero();
      }
    };
    step();
    TT.timer.tick = setInterval(step, 250);
  },
  stop: function () { if (TT.timer.tick) clearInterval(TT.timer.tick); TT.timer.tick = null; },
  secondsLeft: function () {
    return TT.timer.end ? Math.max(0, Math.ceil((TT.timer.end - Date.now()) / 1000)) : 0;
  }
};

/* ================= TOAST + CONFIRM ================= */
TT.toast = function (msg, kind) {
  var t = document.createElement("div");
  t.className = "msg " + (kind || "info");
  t.style.cssText = "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:300;" +
    "min-width:260px;max-width:92%;text-align:center;margin:0;box-shadow:0 10px 30px rgba(0,0,0,.5)";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.style.transition = "opacity .4s"; t.style.opacity = "0"; }, 2200);
  setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2700);
};
TT.confirmBox = function (msg, onYes, yesLabel) {
  var back = document.createElement("div");
  back.className = "modal-back";
  back.innerHTML =
    '<div class="modal center">' +
      '<p style="margin-bottom:20px;font-size:15px">' + TT.esc(msg) + "</p>" +
      '<button class="btn" id="cfYes">' + TT.esc(yesLabel || "Yes") + "</button> " +
      '<button class="btn ghost" id="cfNo">Cancel</button>' +
    "</div>";
  document.body.appendChild(back);
  var btnYes = document.getElementById("cfYes");
  btnYes.onclick = function () { back.remove(); if (onYes) onYes(); };
  document.getElementById("cfNo").onclick = function () { back.remove(); };
  btnYes.focus();
};

/* ================= IMAGE HELPERS ================= */
function isImg(s) { return /^(https?:|data:)/.test(s) || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(String(s).split("?")[0]); }
TT.imgHTML = function (src, cls) {
  if (!src) return "";
  if (isImg(src)) {
    var enc = encodeURI(src);
    return '<img class="' + (cls || "q-img") + '" src="' + TT.esc(enc) + '" alt="question image">';
  }
  return '<div class="q-img" style="display:grid;place-items:center;font-size:52px;border:none;background:none">' + TT.esc(src) + "</div>";
};
TT.imgsRow = function (arr) {
  var out = '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;align-items:center;margin:16px 0">';
  (arr || []).forEach(function (s, index) {
    if (index > 0) {
      out += '<span style="font-size:32px;color:var(--cyan);font-weight:bold;padding:0 6px">+</span>';
    }
    if (isImg(s)) {
      var enc = encodeURI(s);
      out += '<img src="' + TT.esc(enc) + '" alt="puzzle clue" style="width:90px;height:90px;object-fit:cover;border-radius:12px;border:2px solid var(--cyan-soft);background:#000">';
    } else {
      out += '<div style="width:90px;height:90px;display:grid;place-items:center;font-size:44px;background:rgba(4,14,28,.7);border:2px solid var(--cyan-soft);border-radius:12px">' + TT.esc(s) + "</div>";
    }
  });
  return out + "</div>";
};

/* ================= DEMO QUESTIONS ================= */
var DEMOS = {
  r1: { type: 'mcq', t: 'DEMO: What is the output of print(2 ** 3)?', o: ['6', '8', '9', '64'], a: 1 },
  r2: { type: 'mcq', t: 'DEMO: Identify this company from its logo.', img: 'assets/logo-instagram.png', o: ['Instagram', 'Snapchat', 'Pinterest', 'TikTok'], a: 0 },
  r3: { type: 'puzzle', t: 'DEMO: Guess the tech word.', imgs: ['☁️', '💾', '🌩️', '📁'], hint: 'Your files live here, but not on your desk.', a: 'cloud' },
  r4: { type: 'code', t: 'DEMO: Write a Python program that prints exactly: Hello, Demo!', expected: 'Hello, Demo!' },
  tiebreak: { type: 'mcq', t: 'DEMO: CSS stands for:', o: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Sheets'], a: 1 }
};

function showDemoModal(roundId) {
  var d = DEMOS[roundId] || DEMOS.r1;
  var back = document.createElement("div");
  back.className = "modal-back";
  var html = '<div class="modal" style="max-width:600px">' +
    '<h3 style="color:var(--cyan);margin-bottom:10px">🎮 Practice Demo (No timer, no scoring)</h3>' +
    '<p class="q-text">' + TT.esc(d.t) + '</p>';
    
  if (d.img) html += TT.imgHTML(d.img);
  if (d.imgs) html += TT.imgsRow(d.imgs);
  
  if (d.type === 'mcq') {
    html += '<div class="opts" style="margin-top:12px">';
    d.o.forEach(function(opt, i) {
      html += '<div class="opt demo-opt" data-i="' + i + '"><span class="key">' + "ABCD".charAt(i) + '</span><span>' + TT.esc(opt) + '</span></div>';
    });
    html += '</div><div id="demoMsg" style="margin-top:12px"></div>';
  } else if (d.type === 'puzzle') {
    html += '<p class="hint" style="margin-top:8px">Hint: ' + TT.esc(d.hint) + '</p>' +
      '<input class="input" id="demoInp" placeholder="Type the word..." style="margin-top:10px">' +
      '<button class="btn small" id="demoCheck" style="margin-top:10px">Check</button>' +
      '<div id="demoMsg" style="margin-top:12px"></div>';
  } else if (d.type === 'code') {
      html += '<p class="hint">Expected output: <code>' + TT.esc(d.expected) + '</code></p>' +
        '<textarea class="code" id="demoCode" rows="4" style="margin-top:10px">print("Hello, Demo!")</textarea>' +
        '<button class="btn small" id="demoRun" style="margin-top:10px">Run &amp; Check</button>' +
        '<div id="demoMsg" style="margin-top:12px"></div>';
  }
  
  html += '<button class="btn ghost block" id="demoClose" style="margin-top:16px">Close Demo</button></div>';
  back.innerHTML = html;
  document.body.appendChild(back);

  if (d.type === 'mcq') {
    document.querySelectorAll(".demo-opt").forEach(function(el) {
      el.onclick = function() {
        var i = parseInt(el.getAttribute("data-i"), 10);
        document.getElementById("demoMsg").innerHTML = (i === d.a) ? 
          '<div class="msg good">✅ Correct! You are ready.</div>' : 
          '<div class="msg bad">❌ Try again.</div>';
      };
    });
  } else if (d.type === 'puzzle') {
    document.getElementById("demoCheck").onclick = function() {
      var v = document.getElementById("demoInp").value.trim().toLowerCase();
      document.getElementById("demoMsg").innerHTML = (v === d.a) ? 
        '<div class="msg good">✅ Correct! You are ready.</div>' : 
          '<div class="msg bad">❌ Try again.</div>';
    };
  } else if (d.type === 'code') {
    document.getElementById("demoRun").onclick = function() {
      var code = document.getElementById("demoCode").value;
      document.getElementById("demoMsg").innerHTML = '<div class="msg info">⏳ Waking up Python engine...</div>';
      
      // Wake up Pyodide before running
      TT.preloadPython(function(err) {
        if (err) {
          document.getElementById("demoMsg").innerHTML = '<div class="msg bad">Python engine blocked by browser.</div>';
          return;
        }
        TT.runPython(code).then(function(res) {
          if (!res.ok) {
            document.getElementById("demoMsg").innerHTML = '<div class="msg bad">Error: ' + TT.esc(res.err) + '</div>';
          } else {
            var match = TT.normOut(res.out) === TT.normOut(d.expected);
            document.getElementById("demoMsg").innerHTML = match ? 
              '<div class="msg good">✅ Output matches! You are ready.</div>' : 
              '<div class="msg bad">❌ Output: "' + TT.esc(res.out) + '". Expected: "' + TT.esc(d.expected) + '"</div>';
          }
        });
      });
    };
  }

  document.getElementById("demoClose").onclick = function() { back.remove(); };
}

/* ================= ROUND KEY-GATE ================= */
TT.keyGate = function (roundId, mountId, info, onStart) {
  var mount = document.getElementById(mountId); if (!mount) return;
  var needKey = roundId !== "r1";
  var dur = (D.settings.durations[roundId] || 15);
  mount.innerHTML =
    '<div class="card center narrow" style="margin:36px auto">' +
      '<div class="badge-icon" style="margin:0 auto 12px">🔐</div>' +
      '<h3>' + TT.esc(info.title) + "</h3>" +
      '<p class="hint" style="margin:10px 0 4px">' + TT.esc(info.desc || "") + "</p>" +
      '<p class="hint">⏱ ' + dur + " minutes · auto-submit at 00:00 · answers lock once picked</p>" +
      (needKey
        ? '<label>Round Key</label>' +
          '<input class="input" id="gateKey" placeholder="Key announced by the organizer" autocomplete="off">'
        : "") +
      '<div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
        '<button class="btn ghost" id="gateDemo">🎮 Try Demo</button>' +
        '<button class="btn" id="gateStart">🚀 Start Round</button>' +
      '</div>' +
      '<div id="gateMsg"></div>' +
    "</div>";
  document.getElementById("gateStart").onclick = function () {
    var k = needKey ? document.getElementById("gateKey").value : "";
    if (!TT.checkKey(roundId, k)) {
      document.getElementById("gateMsg").innerHTML =
        '<div class="msg bad">❌ Wrong key. Wait for the organizer to announce it.</div>';
      return;
    }
    TT.startRound(roundId);
    onStart();
  };
  document.getElementById("gateDemo").onclick = function () { showDemoModal(roundId); };
};

/* ================= ROUND SHELL ================= */
TT.roundShell = function (roundId, mountId, info, onLive) {
  var st = TT.getState(roundId);
  if (st.status === "locked") { TT.keyGate(roundId, mountId, info, onLive); return; }
  if (st.status === "done" || st.status === "dq") {
    document.getElementById(mountId).innerHTML = TT.resultPanel(roundId);
    return;
  }
  onLive();
};

/* ================= RESULT PANEL (FIXED: Includes Tie-Breaker + Grand Total) ================= */
TT.resultPanel = function (roundId) {
  var st = TT.getState(roundId);
  // Don't show DQ if this round completed successfully
  var isDQ = (st.status === "dq") || (TT.globalDQ && TT.globalDQ() && st.status !== "done");

  if (isDQ) {
    var dqObj = (TT.globalDQ && TT.globalDQ()) || { reason: st.dqReason || "Disqualified" };
    var dqHtml = '<div class="card center narrow" style="margin:36px auto;border-color:var(--bad)">' +
      '<div class="badge-icon" style="margin:0 auto 12px;border-color:var(--bad)">⛔</div>' +
      '<h3 style="color:var(--bad)">Disqualified</h3>' +
      '<p class="hint" style="margin-top:8px">' + TT.esc(dqObj.reason || "Anti-cheat violation") + '</p>' +
      '<div style="margin-top:20px;padding:14px;background:rgba(255,255,255,0.07);border-radius:10px;border:1px solid rgba(255,255,255,0.18);max-width:320px;margin-left:auto;margin-right:auto">' +
        '<label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px">🔑 Organizer Unlock (Enter password to resume)</label>' +
        '<div style="display:flex;gap:6px">' +
          '<input type="password" id="resAdminUnlock" placeholder="Admin password" class="input small" style="margin:0;background:rgba(0,0,0,0.4)">' +
          '<button class="btn small" id="resBtnUnlock">Unlock</button>' +
        '</div>' +
        '<div id="resUnlockMsg" style="margin-top:6px;font-size:12px"></div>' +
      '</div>' +
      '</div>';
    setTimeout(function () {
      var inp = document.getElementById("resAdminUnlock");
      var btn = document.getElementById("resBtnUnlock");
      var msg = document.getElementById("resUnlockMsg");
      if (btn && inp) {
        var doUnlock = function () {
          if (!TT.unlockSystem(inp.value)) {
            msg.innerHTML = '<span style="color:var(--bad)">❌ Incorrect password</span>';
          }
        };
        btn.onclick = doUnlock;
        inp.onkeydown = function (e) { if (e.key === "Enter") doUnlock(); };
      }
    }, 60);
    return dqHtml;
  }

  // Tie-breaker UI
  var tb = TT.getTieBreaker ? TT.getTieBreaker(roundId) : null;
  var tbHtml = "";
  if (tb) {
    tbHtml = '<div class="card tight" style="border-color:var(--warn);margin-top:14px">' +
      '<h3 style="color:var(--warn)">⚖️ Tie-Breaker Available</h3>' +
      '<p class="hint">If your team is tied, enter the tie-breaker key to attempt ' + tb.questions.length + ' extra question(s).</p>' +
      '<div class="grid cols2" style="margin-top:10px">' +
        '<input class="input" id="tbKey_' + roundId + '" placeholder="Tie-breaker key" autocomplete="off">' +
        '<button class="btn" id="tbGo_' + roundId + '">Enter Tie-Breaker</button>' +
      '</div><div id="tbMsg_' + roundId + '"></div></div>';
  }

  // Next round navigation or Grand Total Final Screen for R4
  if (roundId === "r4") {
    var team = TT.getTeam() || { name: "Team" };
    var gt = TT.grandTotal();
    var bd = gt.breakdown;
    var totalTimeSec = (bd.r1.timeSec || 0) + (bd.r2.timeSec || 0) + (bd.r3.timeSec || 0) + (bd.r4.timeSec || 0);

    var r4Html =
      '<div class="card center" style="max-width:760px;margin:24px auto;border-color:var(--cyan);background:rgba(3,11,24,0.9);box-shadow:0 0 35px rgba(77,216,255,0.25)">' +
        '<div style="font-size:44px;margin-bottom:6px">🏆</div>' +
        '<h2 style="color:var(--cyan);font-size:28px;margin:0">Event Completed — All 4 Rounds Done!</h2>' +
        '<p class="hint" style="font-size:15px;margin:6px 0 16px">Team: <b style="color:#fff;font-size:16px">' + TT.esc(team.name) + '</b> · Total Time: <b style="color:var(--cyan)">' + TT.fmt(totalTimeSec) + '</b></p>' +

        '<div style="background:rgba(77,216,255,0.08);border:2px solid var(--cyan);border-radius:14px;padding:20px;margin:16px 0">' +
          '<div style="font-size:14px;letter-spacing:1px;text-transform:uppercase;color:var(--cyan)">🌟 Grand Event Total Score 🌟</div>' +
          '<div style="font-size:64px;font-weight:900;color:var(--good);margin:8px 0;text-shadow:0 0 20px rgba(61,220,132,0.4)">' + gt.total + ' <span style="font-size:24px;font-weight:600;color:var(--muted)">pts</span></div>' +
          '<div id="rankSlot" class="msg info" style="margin:10px auto 0;max-width:340px">Calculating final event rank…</div>' +
        '</div>' +

        '<h3 style="margin:20px 0 10px;text-align:left;color:var(--muted);font-size:13px;letter-spacing:1px;text-transform:uppercase">📋 Round-by-Round Breakdown</h3>' +
        '<div class="grid cols2" style="gap:12px;text-align:left">' +
          '<div class="card tight" style="border-color:var(--r1);background:rgba(77,216,255,0.03)">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<b style="color:var(--r1)">🧠 Round 1: Prelims</b>' +
              '<span style="font-size:18px;font-weight:800;color:var(--r1)">' + bd.r1.score + ' pts</span>' +
            '</div>' +
            '<div class="hint" style="font-size:12px;margin-top:4px">✓ Correct: ' + bd.r1.correct + ' · Time: ' + TT.fmt(bd.r1.timeSec) + '</div>' +
          '</div>' +

          '<div class="card tight" style="border-color:var(--r2);background:rgba(255,106,213,0.03)">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<b style="color:var(--r2)">🏢 Round 2: Corporate Clue</b>' +
              '<span style="font-size:18px;font-weight:800;color:var(--r2)">' + bd.r2.score + ' pts</span>' +
            '</div>' +
            '<div class="hint" style="font-size:12px;margin-top:4px">✓ Correct: ' + bd.r2.correct + ' · Time: ' + TT.fmt(bd.r2.timeSec) + '</div>' +
          '</div>' +

          '<div class="card tight" style="border-color:var(--r3);background:rgba(255,215,106,0.03)">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<b style="color:var(--r3)">🖼️ Round 3: Visual Logic</b>' +
              '<span style="font-size:18px;font-weight:800;color:var(--r3)">' + bd.r3.score + ' pts</span>' +
            '</div>' +
            '<div class="hint" style="font-size:12px;margin-top:4px">✓ Correct: ' + bd.r3.correct + ' · Time: ' + TT.fmt(bd.r3.timeSec) + '</div>' +
          '</div>' +

          '<div class="card tight" style="border-color:var(--r4);background:rgba(61,220,132,0.03)">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<b style="color:var(--r4)">⚡ Round 4: Rapid Rush</b>' +
              '<span style="font-size:18px;font-weight:800;color:var(--good)">' + bd.r4.score + ' pts</span>' +
            '</div>' +
            '<div class="hint" style="font-size:12px;margin-top:4px">Coding: ' + (st.codingScore || 0) + ' pts · Debug: +' + (st.debugScore || st.debugPartial || 0) + ' pts</div>' +
          '</div>' +
        '</div>' +

        tbHtml +
        '<div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
          '<a class="btn ghost" href="instructions.html">📖 Instructions</a>' +
          '<a class="btn" href="admin.html">📊 Admin &amp; Scoreboard</a>' +
        '</div>' +
      '</div>';

    setTimeout(function () {
      TT.fillRank("rankSlot", "total");
      if (tb) {
        var btn = document.getElementById("tbGo_r4");
        if (btn) btn.onclick = function () {
          var k = document.getElementById("tbKey_r4").value;
          if (!TT.checkTieBreakerKey("r4", k)) {
            document.getElementById("tbMsg_r4").innerHTML = '<div class="msg bad">❌ Wrong key.</div>';
            return;
          }
          TT.startTieBreaker("r4");
          location.href = "round1.html?tb=r4";
        };
      }
    }, 60);

    return r4Html;
  }

  var NEXT = {
    r1: { page: "round2.html", label: "Proceed to Round 2 - Corporate Clue" },
    r2: { page: "round3.html", label: "Proceed to Round 3 - Visual Logic" },
    r3: { page: "round4.html", label: "Proceed to Round 4 - Rapid Rush" },
    tiebreak: { page: "instructions.html", label: "Back to Instructions" }
  };
  var nxt = NEXT[roundId], navHtml = "";
  if (nxt) navHtml = '<a class="btn block" id="nextRoundBtn" style="margin-top:16px" href="' + nxt.page + '">' + nxt.label + " →</a>" +
    '<p class="hint center" style="margin-top:8px">Tip: Press <b>Enter</b> or <b>Right Arrow</b> to proceed</p>';

  var html =
    '<div class="card center narrow" style="margin:36px auto">' +
      '<div class="badge-icon" style="margin:0 auto 12px">🏁</div>' +
      '<h3>Round Complete</h3>' +
      '<div style="font-size:46px;font-weight:800;color:var(--cyan);margin:12px 0">' + (st.score || 0) + " pts</div>" +
      '<p class="hint">Correct: ' + (st.correct || 0) + " · Base: " + (st.base || 0) +
        " · Speed bonus: +" + (st.bonus || 0) + " · Time used: " + TT.fmt(st.timeSec || 0) + "</p>" +
      '<div id="rankSlot" class="msg info" style="margin-top:14px">Checking rank…</div>' +
    "</div>" + tbHtml + navHtml;

  setTimeout(function () {
    TT.fillRank("rankSlot", roundId);
    if (tb) {
      var btn = document.getElementById("tbGo_" + roundId);
      if (btn) btn.onclick = function () {
        var k = document.getElementById("tbKey_" + roundId).value;
        if (!TT.checkTieBreakerKey(roundId, k)) {
          document.getElementById("tbMsg_" + roundId).innerHTML = '<div class="msg bad">❌ Wrong key.</div>';
          return;
        }
        TT.startTieBreaker(roundId);
        location.href = "round1.html?tb=" + roundId;
      };
    }
    // Keyboard listener on result screen for fast advance
    var keyListener = function (e) {
      if (e.key === "Enter" || e.key === "ArrowRight") {
        var activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (activeTag === "INPUT") return;
        var nextBtn = document.getElementById("nextRoundBtn");
        if (nextBtn) {
          window.removeEventListener("keydown", keyListener);
          nextBtn.click();
        }
      }
    };
    window.addEventListener("keydown", keyListener);
  }, 60);
  return html;
};

TT.fillRank = function (slotId, roundId) {
  var slot = document.getElementById(slotId); if (!slot) return;
  var me = TT.getTeam();

  if (TT.cloud && TT.cloud.db) {
    TT.cloud.board(function (rows) {
      var rank = 0, i;
      for (i = 0; i < rows.length; i++) if (me && rows[i].code === me.code) { rank = i + 1; break; }
      slot.innerHTML = rank
        ? "🏆 Cloud Rank: <b>#" + rank + "</b> of " + rows.length + " teams"
        : "✅ Scores synced to cloud.";
    });
    return;
  }

  // Island / Local mode rank check
  var localList = TT.lsGet("tt_local_teams", []);
  if (localList && localList.length > 0 && me) {
    var sorted = localList.slice().sort(function (a, b) { return (b.total || 0) - (a.total || 0); });
    var localRank = 0;
    for (var j = 0; j < sorted.length; j++) {
      if (sorted[j].code === me.code || (sorted[j].name && sorted[j].name.toLowerCase() === me.name.toLowerCase())) {
        localRank = j + 1;
        break;
      }
    }
    if (localRank > 0) {
      slot.innerHTML = "🏆 Machine Rank: <b>#" + localRank + "</b> of " + sorted.length + " recorded local teams";
      return;
    }
  }

  slot.innerHTML = "✅ Score recorded successfully.";
};

})();