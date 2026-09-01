/* ============================================================
   TECH TRIVIA — js/quiz.js
   MCQ + fill-up engine for Round 1, Round 2 and Tie-Breaker.
   ============================================================ */

(function () {
"use strict";
var D = window.TT_DATA, TT = window.TT;
TT.quiz = {};

TT.quiz.init = function (roundId, opts) {
  opts = opts || {};
  var main = document.getElementById("main");
  if (!TT.requireTeam()) return;

  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && !t.getAttribute("data-fb")) {
      t.setAttribute("data-fb", "1");
      t.style.display = "none";
      var d = document.createElement("div");
      d.className = "msg warn";
      d.textContent = "Image unavailable on this machine. Ask the organizer to replace it via Admin.";
      if (t.parentNode) t.parentNode.insertBefore(d, t.nextSibling);
    }
  }, true);

  var verdict = TT.enterRound(roundId);

  if (verdict === "locked") {
    TT.keyGate(roundId, "main", {
      title: opts.title || roundId,
      desc: opts.desc || ""
    }, function () {
      TT.setState(roundId, { entered: true });
      TT.arm(roundId);
      TT.quiz.run(roundId, opts.tiebreak);
    });
    return;
  }
  if (verdict === "start") { TT.quiz.run(roundId, opts.tiebreak); return; }

  main.innerHTML = TT.resultPanel(roundId);
};

TT.quiz.run = function (roundId, tiebreak) {
  var main = document.getElementById("main");
  var st = TT.getState(roundId);
  var totalSec = (D.settings.durations[roundId] || 15) * 60;
  var left = Math.max(0, totalSec - TT.elapsed(st));
  var qs = TT.buildQuestions(roundId, tiebreak);
  var answers = st.answers || {};
  var cur = 0, finished = false;

  main.innerHTML =
    '<div class="topbar">' +
      '<div><b id="qProg"></b><br><span class="hint" id="qAns"></span></div>' +
      '<div class="timer" id="timerEl">--:--</div>' +
      '<button class="btn small danger" id="submitBtn">Submit Round</button>' +
    '</div>' +
    '<div id="qMount"></div>';

  TT.timer.start("timerEl", left, function () { doFinish(true); });

  function answeredCount() {
    var n = 0;
    qs.forEach(function (q) {
      var v = answers[q.id];
      if (v !== undefined && v !== null && v !== "") n++;
    });
    return n;
  }

  function commitFill() {
    var q = qs[cur];
    if (!q || q.opts) return;
    if (answers[q.id] !== undefined && answers[q.id] !== "") return;
    var inp = document.getElementById("fillIn");
    if (inp) {
      var v = inp.value.trim();
      if (v) {
        answers[q.id] = v;
        TT.setState(roundId, { answers: answers });
      }
    }
  }

  function renderQ() {
    var q = qs[cur];
    document.getElementById("qProg").textContent = "Question " + (cur + 1) + " / " + qs.length;
    document.getElementById("qAns").textContent =
      answeredCount() + " answered - answers lock once picked";

    var saved = answers[q.id];
    var h = '<div class="card">';
    h += '<div class="q-text">Q' + (cur + 1) + ". " + TT.esc(q.t) + "</div>";
    if (q.img) h += TT.imgHTML(q.img);

    if (q.opts) {
      h += '<div class="opts">';
      q.opts.forEach(function (o, i) {
        var sel = saved === o.orig;
        var locked = saved !== undefined;
        h += '<div class="opt' + (sel ? " selected" : "") + (locked ? " locked" : "") +
          '" data-orig="' + o.orig + '">' +
          '<span class="key">' + "ABCD".charAt(i) + "</span>" +
          "<span>" + TT.esc(o.text) + "</span></div>";
      });
      h += "</div>";
      if (saved !== undefined)
        h += '<p class="hint" style="margin-top:10px">Answer locked - you can revisit, never change.</p>';
    } else {
      var fLocked = saved !== undefined && saved !== "";
      h += '<input class="input" id="fillIn" placeholder="Type your answer..." autocomplete="off"' +
        (fLocked ? ' disabled value="' + TT.esc(saved) + '"' : "") + ">";
      h += '<p class="hint" style="margin-top:8px">Locks the moment you type and move away. Case does not matter.</p>';
    }
    h += "</div>";

    h += '<div class="card tight"><div class="q-nav" id="qnav"></div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:14px">' +
      '<button class="btn ghost" id="prevBtn"' + (cur === 0 ? " disabled" : "") + ">Prev</button>" +
      (cur === qs.length - 1 
        ? '<button class="btn warn" id="nextBtn">Submit Round</button>'
        : '<button class="btn" id="nextBtn">Next</button>') +
      "</div></div>";

    document.getElementById("qMount").innerHTML = h;

    var nav = document.getElementById("qnav");
    qs.forEach(function (qq, i) {
      var d = document.createElement("button");
      var hasAns = answers[qq.id] !== undefined && answers[qq.id] !== "";
      d.className = "q-dot" + (hasAns ? " answered" : "") + (i === cur ? " current" : "");
      d.textContent = i + 1;
      d.onclick = function () { commitFill(); cur = i; renderQ(); };
      nav.appendChild(d);
    });

    if (q.opts) {
      var els = document.querySelectorAll("#qMount .opt");
      Array.prototype.forEach.call(els, function (el) {
        el.onclick = function () {
          if (answers[q.id] !== undefined) {
            TT.toast("Answer locked - no changes allowed", "warn");
            return;
          }
          answers[q.id] = parseInt(el.getAttribute("data-orig"), 10);
          TT.setState(roundId, { answers: answers });
          // Auto-advance to next question after a short pause
          // renderQ() is called inside the timeout (or on last question we just re-render in place)
          if (cur < qs.length - 1) {
            setTimeout(function () {
              if (!finished) {
                cur++;
                renderQ();
              }
            }, 320);
          } else {
            // Last question — just re-render to show the lock state
            renderQ();
          }
        };
      });
    } else {
      var inp = document.getElementById("fillIn");
      if (inp && !inp.disabled) {
        inp.onchange = function () {
          var v = inp.value.trim();
          if (v) {
            answers[q.id] = v;
            TT.setState(roundId, { answers: answers });
            setTimeout(function() {
              if (document.getElementById("fillIn") === inp) {
                inp.disabled = true;
                TT.toast("Answer locked", "warn");
              }
            }, 150);
          }
        };
        inp.onkeydown = function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            var v = inp.value.trim();
            if (v) {
              answers[q.id] = v;
              TT.setState(roundId, { answers: answers });
              TT.toast("Answer locked", "warn");
            }
            if (cur < qs.length - 1) {
              cur++;
              renderQ();
            } else {
              renderQ();
              var sBtn = document.getElementById("submitBtn");
              if (sBtn) sBtn.focus();
            }
          }
        };
        inp.focus();
      }
    }

    document.getElementById("prevBtn").onclick = function () {
      commitFill(); if (cur > 0) { cur--; renderQ(); }
    };
    document.getElementById("nextBtn").onclick = function () {
      commitFill(); 
      if (cur < qs.length - 1) { 
        cur++; 
        renderQ(); 
      } else {
        document.getElementById("submitBtn").click();
      }
    };
  }

  function handleKeyDown(e) {
    if (finished) return;
    if (document.querySelector(".modal-back")) return;
    var activeTag = document.activeElement ? document.activeElement.tagName : "";
    var isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA";

    if (e.key === "ArrowRight") {
      commitFill();
      if (cur < qs.length - 1) { cur++; renderQ(); }
    } else if (e.key === "ArrowLeft") {
      commitFill();
      if (cur > 0) { cur--; renderQ(); }
    } else if (e.key === "Enter") {
      if (!isTyping) {
        if (cur < qs.length - 1) {
          commitFill();
          cur++;
          renderQ();
        } else {
          document.getElementById("submitBtn").click();
        }
      }
    } else if (!isTyping && qs[cur] && qs[cur].opts) {
      var keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      if (keyMap[e.key] !== undefined) {
        var optIdx = keyMap[e.key];
        var optEl = document.querySelectorAll("#qMount .opt")[optIdx];
        if (optEl) optEl.click();
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  function doFinish(auto) {
    if (finished) return;
    finished = true;
    window.removeEventListener("keydown", handleKeyDown);
    TT.timer.stop();
    if (TT.isDQ(roundId)) { main.innerHTML = TT.resultPanel(roundId); return; }
    var res = TT.gradeMCQFill(roundId, tiebreak);
    TT.finishRound(roundId, res);
    main.innerHTML = TT.resultPanel(roundId);
    if (auto) TT.toast("Time up - answers auto-submitted", "warn");
  }

  document.getElementById("submitBtn").onclick = function () {
    commitFill();
    var un = qs.length - answeredCount();
    TT.confirmBox(
      "Submit this round?" + (un ? " " + un + " question(s) still unanswered." : "") +
      " Once submitted you cannot return.",
      function () { doFinish(false); },
      "Submit Now"
    );
  };

  renderQ();
};

})();