/* ============================================================
TECH TRIVIA — js/r3.js   Round 3: Visual Logic
Part A: Guess the Tech Word
Part B: Dynamic Crossword
============================================================ */
(function () {
"use strict";
var D = window.TT_DATA, TT = window.TT;
TT.r3 = {};

TT.r3.init = function () {
  var main = document.getElementById("main");
  if (!TT.requireTeam()) return;
  var verdict = TT.enterRound("r3");
  if (verdict === "locked") {
    TT.keyGate("r3", "main", {
      title: "🖼️ Round 3 — Visual Logic",
      desc: "Part A: Guess the Tech Word · Part B: Dynamic Crossword"
    }, function () {
      TT.setState("r3", { entered: true });
      TT.arm("r3");
      TT.r3.run();
    });
    return;
  }
  if (verdict === "start") { TT.r3.run(); return; }
  main.innerHTML = TT.resultPanel("r3");
};

TT.r3.run = function () {
  var main = document.getElementById("main");
  var st = TT.getState("r3");
  var totalSec = (D.settings.durations.r3 || 15) * 60;
  var used = TT.elapsed(st);
  var left = Math.max(0, totalSec - used);
  var guesses = st.guesses || {};
  var hints   = st.hints   || {};
  var cwAns   = st.cw      || {};

  var cwSeed = st.cwSeed || ("cw_" + Date.now());
  if (!st.cwSeed) TT.setState("r3", { cwSeed: cwSeed });
  var cw = TT.buildCrossword(cwSeed);
  var finished = false;

  main.innerHTML =
    '<div class="topbar">' +
      '<div><b>🖼️ Round 3 — Visual Logic</b><br><span class="hint">Part A: Tech Words · Part B: Crossword</span></div>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
        '<div class="timer" id="timerEl">⏱ --:--</div>' +
        '<button class="btn small" id="tabA">Part A: Puzzles</button>' +
        '<button class="btn ghost small" id="tabB">Part B: Crossword</button>' +
        '<button class="btn small success" id="finishBtn">Submit Round 3</button>' +
      '</div>' +
    '</div>' +
    '<div id="mountA"></div>' +
    '<div id="mountB" class="hide"></div>';

  TT.timer.start("timerEl", left, function () { doFinish(true); });

  function renderA() {
    document.getElementById("tabA").className = "btn small";
    document.getElementById("tabB").className = "btn ghost small";
    document.getElementById("mountA").classList.remove("hide");
    document.getElementById("mountB").classList.add("hide");

    var html = "";
    D.r3.forEach(function (p, i) {
      var hUsed = hints[p.id] || 0;
      var canonWord = TT.dec(p.a) || "";
      var words = canonWord.trim().split(/\s+/);
      var storedFlat = (guesses[p.id] || "").toUpperCase();
      
      var boxHtml = '<div class="letter-box-group" data-pid="' + p.id + '">';
      var flatIdx = 0;
      words.forEach(function (w, wIdx) {
        boxHtml += '<div class="letter-word">';
        for (var j = 0; j < w.length; j++) {
          var ch = storedFlat.charAt(flatIdx) || "";
          boxHtml += '<input class="letter-box' + (ch ? " filled" : "") + '"' +
            ' type="text" maxlength="1" placeholder="·"' +
            ' data-pid="' + p.id + '" data-idx="' + flatIdx + '"' +
            ' value="' + TT.esc(ch) + '" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" inputmode="text">';
          flatIdx++;
        }
        boxHtml += '</div>';
        if (wIdx < words.length - 1) boxHtml += '<span class="letter-word-gap">▪</span>';
      });
      boxHtml += '</div>';
      var wordDesc = words.map(function (w) { return w.length; }).join("+");
      
      html += '<div class="card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
          '<h3>Puzzle ' + (i + 1) + ' <span class="hint">(' + wordDesc + ' letters)</span></h3>' +
          '<div style="display:flex;gap:6px">' +
            '<button class="btn ghost small hintBtn" data-id="' + p.id + '" data-n="1"' + (hUsed >= 1 ? " disabled" : "") + '>Hint 1 (Free)</button>' +
            '<button class="btn ghost small hintBtn" data-id="' + p.id + '" data-n="2"' + (hUsed >= 2 ? " disabled" : "") + '>Hint 2 (-1 pt)</button>' +
          '</div>' +
        '</div>' +
        TT.imgsRow(p.img) +
        '<div id="hintBox_' + p.id + '" class="msg warn ' + (hUsed === 0 ? "hide" : "") + '" style="margin:8px 0">' +
          (hUsed >= 1 ? TT.esc(p.hint1) : "") + (hUsed >= 2 ? "<br>" + TT.esc(p.hint2) : "") +
        '</div>' +
        '<p style="margin:10px 0 4px;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px">Type answer:</p>' +
        '<div style="width:100%;overflow-x:auto;padding-bottom:10px;">' + boxHtml + '</div>' +
      '</div>';
    });
    document.getElementById("mountA").innerHTML = html;

    document.querySelectorAll(".hintBtn").forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-id");
        var n = parseInt(b.getAttribute("data-n"), 10);
        hints[id] = n;
        TT.setState("r3", { hints: hints });
        renderA();
      };
    });

    function syncPuzzleBoxes(pId) {
      var boxList = document.querySelectorAll('.letter-box[data-pid="' + pId + '"]');
      var str = "";
      boxList.forEach(function (b) { str += (b.value || "").toUpperCase(); });
      guesses[pId] = str;
      TT.setState("r3", { guesses: guesses });
    }

    document.querySelectorAll(".letter-box").forEach(function (inp) {
      var pId = inp.getAttribute("data-pid");
      var idx = parseInt(inp.getAttribute("data-idx"), 10);
      
      function safeFocus(el) {
        if (!el) return;
        el.focus({ preventScroll: true });
      }

      inp.oninput = function () {
        var raw = inp.value || "";
        var letter = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-1);
        inp.value = letter;
        if (letter) {
          inp.classList.add("filled");
          var next = document.querySelector('.letter-box[data-pid="' + pId + '"][data-idx="' + (idx + 1) + '"]');
          if (next) safeFocus(next);
        } else { inp.classList.remove("filled"); }
        syncPuzzleBoxes(pId);
      };
      inp.onkeydown = function (e) {
        if (e.key === "Backspace") {
          if (!inp.value) {
            var prev = document.querySelector('.letter-box[data-pid="' + pId + '"][data-idx="' + (idx - 1) + '"]');
            if (prev) { prev.value = ""; prev.classList.remove("filled"); safeFocus(prev); syncPuzzleBoxes(pId); }
          } else { inp.value = ""; inp.classList.remove("filled"); syncPuzzleBoxes(pId); }
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          var prevB = document.querySelector('.letter-box[data-pid="' + pId + '"][data-idx="' + (idx - 1) + '"]');
          if (prevB) safeFocus(prevB); e.preventDefault();
        } else if (e.key === "ArrowRight") {
          var nextB = document.querySelector('.letter-box[data-pid="' + pId + '"][data-idx="' + (idx + 1) + '"]');
          if (nextB) safeFocus(nextB); e.preventDefault();
        }
      };
    });
  }

  function renderB() {
    document.getElementById("tabA").className = "btn ghost small";
    document.getElementById("tabB").className = "btn small";
    document.getElementById("mountA").classList.add("hide");
    document.getElementById("mountB").classList.remove("hide");

    var cellClues = {};
    cw.clues.forEach(function (cl) {
      for (var i = 0; i < cl.len; i++) {
        var cr = cl.dir === "across" ? cl.r : cl.r + i;
        var cc = cl.dir === "across" ? cl.c + i : cl.c;
        var key = cr + "," + cc;
        if (!cellClues[key]) cellClues[key] = {};
        cellClues[key][cl.dir] = cl;
      }
    });

    var acrossClues = cw.clues.filter(function (c) { return c.dir === "across"; });
    var downClues   = cw.clues.filter(function (c) { return c.dir === "down"; });
    var currentClue = acrossClues[0] || cw.clues[0] || null;
    var currentDir = currentClue ? currentClue.dir : "across";
    var activeCell = currentClue ? { r: currentClue.r, c: currentClue.c } : null;

    var gridHtml = '<div class="cw-wrap"><div class="cw" id="cwGrid" style="grid-template-columns:repeat(' + cw.cols + ', var(--cw-size));grid-template-rows:repeat(' + cw.rows + ', var(--cw-size))">';
    
    var cellMap = {};
    cw.cells.forEach(function (c) { cellMap[c.r + "," + c.c] = c; });
    for (var r = 0; r < cw.rows; r++) {
      for (var c = 0; c < cw.cols; c++) {
        var cell = cellMap[r + "," + c];
        if (cell) {
          gridHtml += '<div class="cw-cell" id="cwc_' + r + '_' + c + '" style="grid-row:' + (r + 1) + ';grid-column:' + (c + 1) + '">';
          if (cell.n) gridHtml += '<span class="num">' + cell.n + '</span>';
          gridHtml += '<input maxlength="1" placeholder="·" data-r="' + r + '" data-c="' + c + '" value="' + TT.esc(cwAns[r + "," + c] || "") + '" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" inputmode="text">';
          gridHtml += '</div>';
        } else {
          gridHtml += '<div class="cw-cell blank" style="grid-row:' + (r + 1) + ';grid-column:' + (c + 1) + '"></div>';
        }
      }
    }
    gridHtml += '</div></div>';

    var cwHintAlreadyUsed = !!cwAns.__cwHintUsed || !!TT.getState("r3").cwHintUsed;
    var acrossHtml = '<h3 style="color:var(--cyan);margin-bottom:8px">➡️ Across</h3><ul class="clue-list" id="acrossList">';
    acrossClues.forEach(function (cl) {
      acrossHtml += '<li class="clue-item" id="clueItem_across_' + cl.num + '" data-num="' + cl.num + '" data-dir="across"><b>' + cl.num + '.</b> ' + TT.esc(cl.clue) + ' <span class="hint">(' + cl.len + ' letters)</span></li>';
    });
    acrossHtml += '</ul>';

    var downHtml = '<h3 style="color:var(--warn);margin-bottom:8px">⬇️ Down</h3><ul class="clue-list" id="downList">';
    downClues.forEach(function (cl) {
      downHtml += '<li class="clue-item" id="clueItem_down_' + cl.num + '" data-num="' + cl.num + '" data-dir="down"><b>' + cl.num + '.</b> ' + TT.esc(cl.clue) + ' <span class="hint">(' + cl.len + ' letters)</span></li>';
    });
    downHtml += '</ul>';

    var hintBannerHtml = cwHintAlreadyUsed
      ? '<div class="msg warn" style="margin:0 0 12px;padding:10px 14px;border-radius:10px">' +
          '💡 <b>Hint:</b> "Remember the phase before, that is linked with crossword answer" <span style="font-size:11px;opacity:0.8">(−2 pts applied)</span>' +
        '</div>'
      : '';

    document.getElementById("mountB").innerHTML =
      '<div class="card">' +
        hintBannerHtml +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;padding:10px 14px;background:rgba(3,11,24,.85);border:1px solid rgba(77,216,255,.2);border-radius:10px">' +
          '<div style="flex:1;min-width:240px">' +
            '<span class="hint" style="font-size:11px;text-transform:uppercase;letter-spacing:1px">Active Clue:</span><br>' +
            '<b id="cwBannerTitle" style="color:var(--cyan);font-size:16px;margin-right:6px">1 Across:</b> ' +
            '<span id="cwBannerText" style="font-size:14px">Select a clue below</span>' +
          '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
            '<button class="btn small ghost" id="cwToggleDirBtn" type="button" style="border-color:var(--cyan)">🔄 Switch Dir</button>' +
            (!cwHintAlreadyUsed
              ? '<button class="btn small warn" id="cwHintBtn" type="button">💡 Hint (−2 pts)</button>'
              : '<span style="font-size:12px;color:var(--warn);font-weight:600">Hint Used</span>') +
          '</div>' +
        '</div>' +
        gridHtml +
      '</div>' +
      '<div id="clueColumns">' +
        '<div class="grid cols2">' +
          '<div class="card tight" style="border-color:rgba(77,216,255,.25)">' + acrossHtml + '</div>' +
          '<div class="card tight" style="border-color:rgba(255,215,106,.25)">' + downHtml + '</div>' +
        '</div>' +
      '</div>';

    function updateHighlight() {
      document.querySelectorAll(".cw-cell").forEach(function (el) { el.classList.remove("active-word", "active-cell"); });
      document.querySelectorAll(".clue-item").forEach(function (el) { el.classList.remove("active-clue"); });
      var bTitle = document.getElementById("cwBannerTitle");
      var bText  = document.getElementById("cwBannerText");
      var bBtn   = document.getElementById("cwToggleDirBtn");
      if (currentClue) {
        if (bTitle) {
          bTitle.textContent = currentClue.num + " " + (currentClue.dir === "across" ? "Across ➡️" : "Down ⬇️") + ":";
          bTitle.style.color = currentClue.dir === "across" ? "var(--cyan)" : "var(--warn)";
        }
        if (bText) bText.textContent = currentClue.clue + " (" + currentClue.len + " letters)";
        if (bBtn) bBtn.textContent = currentDir === "across" ? "➡️ Typing Across" : "⬇️ Typing Down";
        var item = document.getElementById("clueItem_" + currentClue.dir + "_" + currentClue.num);
        if (item) item.classList.add("active-clue");
        for (var i = 0; i < currentClue.len; i++) {
          var wr = currentClue.dir === "across" ? currentClue.r : currentClue.r + i;
          var wc = currentClue.dir === "across" ? currentClue.c + i : currentClue.c;
          var cellEl = document.getElementById("cwc_" + wr + "_" + wc);
          if (cellEl) cellEl.classList.add("active-word");
        }
      }
      if (activeCell) {
        var curEl = document.getElementById("cwc_" + activeCell.r + "_" + activeCell.c);
        if (curEl) curEl.classList.add("active-cell");
      }
    }

    var programmaticFocus = false;
    function focusCellDirect(r, c) {
      var cellEl = document.getElementById("cwc_" + r + "_" + c);
      if (!cellEl) return;
      var inp = cellEl.querySelector("input");
      if (inp) {
        programmaticFocus = true;
        inp.focus({ preventScroll: true });
        activeCell = { r: r, c: c };
        updateHighlight();
        setTimeout(function () { 
          programmaticFocus = false; 
        }, 50);
      }
    }

    function setActiveClue(clue, autoFocus) {
      if (!clue) return;
      currentClue = clue;
      currentDir = clue.dir;
      activeCell = { r: clue.r, c: clue.c };
      updateHighlight();
      if (autoFocus) focusCellDirect(clue.r, clue.c);
    }

    acrossClues.forEach(function (cl) {
      var item = document.getElementById("clueItem_across_" + cl.num);
      if (item) item.onclick = function () { setActiveClue(cl, true); };
    });
    downClues.forEach(function (cl) {
      var item = document.getElementById("clueItem_down_" + cl.num);
      if (item) item.onclick = function () { setActiveClue(cl, true); };
    });

    var toggleBtn = document.getElementById("cwToggleDirBtn");
    if (toggleBtn) {
      toggleBtn.onclick = function () {
        if (!activeCell) return;
        var key = activeCell.r + "," + activeCell.c;
        var cClues = cellClues[key] || {};
        var newDir = currentDir === "across" ? "down" : "across";
        if (cClues[newDir]) {
          currentDir = newDir;
          currentClue = cClues[newDir];
          updateHighlight();
          focusCellDirect(activeCell.r, activeCell.c);
        } else {
          var candidate = (newDir === "across" ? acrossClues : downClues)[0];
          if (candidate) setActiveClue(candidate, true);
        }
      };
    }

    var cwHintBtn = document.getElementById("cwHintBtn");
    if (cwHintBtn) {
      cwHintBtn.onclick = function () {
        TT.confirmBox("If you use this you will lose more marks", function () {
          TT.setState("r3", { cwHintUsed: true });
          TT.toast("Hint: Remember the phase before, that is linked with crossword answer", "warn");
          renderB();
        }, "Use Hint");
      };
    }

    function stepNext(r, c) {
      if (!currentClue) return;
      var nextR = currentDir === "across" ? r : r + 1;
      var nextC = currentDir === "across" ? c + 1 : c;
      var ok = currentDir === "across"
        ? (nextR === currentClue.r && nextC < currentClue.c + currentClue.len)
        : (nextC === currentClue.c && nextR < currentClue.r + currentClue.len);
      if (ok) focusCellDirect(nextR, nextC);
    }

    function stepPrev(r, c) {
      if (!currentClue) return;
      var prevR = currentDir === "across" ? r : r - 1;
      var prevC = currentDir === "across" ? c - 1 : c;
      var ok = currentDir === "across"
        ? (prevR === currentClue.r && prevC >= currentClue.c)
        : (prevC === currentClue.c && prevR >= currentClue.r);
      if (ok) focusCellDirect(prevR, prevC);
    }

    document.querySelectorAll(".cw-cell input").forEach(function (inp) {
      var r = parseInt(inp.getAttribute("data-r"), 10);
      var c = parseInt(inp.getAttribute("data-c"), 10);
      
      inp.onfocus = function () {
        if (programmaticFocus) return;
        activeCell = { r: r, c: c };
        var key = r + "," + c;
        var cClues = cellClues[key] || {};
        if (cClues[currentDir]) currentClue = cClues[currentDir];
        else if (cClues.across) { currentClue = cClues.across; currentDir = "across"; }
        else if (cClues.down) { currentClue = cClues.down; currentDir = "down"; }
        updateHighlight();
      };
      
      inp.oninput = function () {
        var v = inp.value.toUpperCase();
        inp.value = v.slice(-1);
        cwAns[r + "," + c] = inp.value;
        TT.setState("r3", { cw: cwAns });
        if (inp.value) stepNext(r, c);
      };
      
      inp.onkeydown = function (e) {
        if (e.key === "Backspace") {
          if (!inp.value) { stepPrev(r, c); e.preventDefault(); }
          else { inp.value = ""; cwAns[r + "," + c] = ""; TT.setState("r3", { cw: cwAns }); stepPrev(r, c); e.preventDefault(); }
        } else if (e.key === "ArrowLeft") {
          currentDir = "across"; if (cellClues[r + "," + c] && cellClues[r + "," + c].across) currentClue = cellClues[r + "," + c].across; stepPrev(r, c); e.preventDefault();
        } else if (e.key === "ArrowRight") {
          currentDir = "across"; if (cellClues[r + "," + c] && cellClues[r + "," + c].across) currentClue = cellClues[r + "," + c].across; stepNext(r, c); e.preventDefault();
        } else if (e.key === "ArrowUp") {
          currentDir = "down"; if (cellClues[r + "," + c] && cellClues[r + "," + c].down) currentClue = cellClues[r + "," + c].down; stepPrev(r, c); e.preventDefault();
        } else if (e.key === "ArrowDown") {
          currentDir = "down"; if (cellClues[r + "," + c] && cellClues[r + "," + c].down) currentClue = cellClues[r + "," + c].down; stepNext(r, c); e.preventDefault();
        }
      };
    });

    updateHighlight();
  }

  document.getElementById("tabA").onclick = renderA;
  document.getElementById("tabB").onclick = renderB;

  function doFinish(auto) {
    if (finished) return;
    finished = true;
    TT.disarm();
    if (TT.timer && TT.timer.stop) TT.timer.stop();
    if (TT.isDQ("r3")) { main.innerHTML = TT.resultPanel("r3"); return; }
    var res = TT.gradeR3();
    TT.finishRound("r3", res);
    main.innerHTML = TT.resultPanel("r3");
    if (auto) TT.toast("Time up — Round 3 complete", "warn");
  }

  document.getElementById("finishBtn").onclick = function () {
    TT.disarm();
    TT.confirmBox("Submit Round 3? Both puzzles and crossword will be scored.", function () {
      doFinish(false);
    }, "Submit Round 3");
  };

  renderA();
};
})();
