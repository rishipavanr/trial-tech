/* ============================================================
   TECH TRIVIA — js/config.js
   Mode detection + global constants (loaded by every page)
   ============================================================ */

const TT_CONFIG = {
  appName: "TECH TRIVIA",
  version: "1.0",

  /* ---------- MODE DETECTION ----------
     localhost / 127.0.0.1 / LAN-IP / file://  -> ISLAND
     anything else (Cloudflare Pages domain)   -> HOSTED      */
  isIsland: (function () {
    try {
      const p = location.protocol, h = location.hostname;
      if (p === "file:") return true;
      if (!p.startsWith("http")) return true;
      return (
        h === "localhost" ||
        h === "127.0.0.1" ||
        h === "" ||
        /^192\.168\./.test(h) ||
        /^10\./.test(h) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(h)
      );
    } catch (e) {
      return true;
    }
  })(),

  /* ---------- localStorage keys ---------- */
  store: {
    team: "tt_team",        // {name, members:[], code}
    round: "tt_round_",     // + roundId -> session state (locked/finished)
    admin: "tt_admin_ok",   // admin login flag
    dq: "tt_dq"             // disqualified flag
  },

  /* ---------- Rounds ---------- */
  rounds: {
    r1: { id: "r1", name: "Prelims",        minutes: 15, bonusCap: 10 },
    r2: { id: "r2", name: "Corporate Clue", minutes: 10, bonusCap: 10 },
    r3: { id: "r3", name: "Visual Logic",   minutes: 15, bonusCap: 10 },
    r4: { id: "r4", name: "Rapid Rush",     minutes: 20 },
    tiebreak: { id: "tiebreak", name: "Tie-Breaker", minutes: 5 }
  },

  /* ---------- Admin ---------- */
  adminPassword: "trivia2026",

  /* ---------- Anti-cheat ---------- */
  antiCheat: {
    disqualifyOnTabSwitch: true,   // leaving tab = instant DQ
    noReentryOnRefresh: true,      // refresh mid-round = locked out
    pyodideTimeoutMs: 5000         // Python kill-switch (5s)
  },

  /* ---------- Pyodide (bundled locally in /pyodide) ---------- */
  pyodideBase: "pyodide/pyodide.js",

  /* ---------- Firebase (HOSTED live scoreboard ONLY) ----------
     Free Spark plan. Stores teams+scores, NEVER answers.
     Leave enabled:false until you create the project.           */
  firebase: {
    enabled: true,
    config: {
      apiKey: "AIzaSyC_e2vcQ1HbY2qZdhI32MyGNAh2mVXN3IM",
      authDomain: "tech-trivia-1703d.firebaseapp.com",
      projectId: "tech-trivia-1703d",
      storageBucket: "tech-trivia-1703d.firebasestorage.app",
      messagingSenderId: "523727706906",
      appId: "1:523727706906:web:3c3e0731c25a9a41f7aaa3"
    }
  }
};

/* Handy globals used everywhere */
const MODE = TT_CONFIG.isIsland ? "island" : "hosted";
console.log("%c[TECH TRIVIA] mode: " + MODE.toUpperCase(),
  "color:#4dd8ff;font-weight:bold");

window.TT_CONFIG = TT_CONFIG;
window.MODE = MODE;