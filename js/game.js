(() => {
  const overlay = document.getElementById("forge-overlay");
  const intro = document.getElementById("forge-intro");
  const battle = document.getElementById("forge-battle");
  const result = document.getElementById("forge-result");
  const trigger = document.getElementById("forge-trigger");
  const hint = document.getElementById("footer-hint");
  const brand = document.querySelector("[data-brand]");
  const closeBtn = document.getElementById("forge-close");
  const againBtn = document.getElementById("forge-again");
  const exitBtn = document.getElementById("forge-exit");
  const starterPick = document.getElementById("starter-pick");
  const battleActions = document.getElementById("battle-actions");
  const battleLog = document.getElementById("battle-log");
  const playerHpEl = document.getElementById("player-hp");
  const enemyHpEl = document.getElementById("enemy-hp");
  const playerName = document.getElementById("player-name");
  const playerSprite = document.getElementById("player-sprite");
  const resultTitle = document.getElementById("result-title");
  const resultCopy = document.getElementById("result-copy");

  if (!overlay) return;

  const STARTERS = {
    cinderpaw: {
      name: "Cinderpaw",
      sprite: "assets/cinderpaw_idle.png",
      special: "Ember Bite",
      color: "#e8a54b",
    },
    aquafin: {
      name: "Aquafin",
      sprite: "assets/aquafin_idle.png",
      special: "Tidal Surge",
      color: "#3ecfbf",
    },
    voltwig: {
      name: "Voltwig",
      sprite: "assets/voltwig_idle.png",
      special: "Static Burst",
      color: "#f0d35a",
    },
  };

  const state = {
    unlocked: false,
    spoolClicks: 0,
    player: null,
    playerHp: 100,
    enemyHp: 100,
    busy: false,
    shielded: false,
  };

  const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;
  let typed = "";

  function unlock(reason) {
    if (state.unlocked) {
      openForge();
      return;
    }
    state.unlocked = true;
    localStorage.setItem("printforge-unlocked", "1");
    if (hint) {
      hint.hidden = false;
      hint.textContent =
        reason === "konami"
          ? "Konami accepted. The forge is open."
          : reason === "type"
            ? "You typed the password. The forge is open."
            : "Filament heated. The forge is open.";
    }
    if (brand) brand.classList.add("is-pulse");
    if (trigger) trigger.classList.add("is-hot");
    openForge();
  }

  function openForge() {
    showScreen("intro");
    overlay.hidden = false;
    document.body.classList.add("forge-open");
    closeBtn?.focus();
  }

  function closeForge() {
    overlay.hidden = true;
    document.body.classList.remove("forge-open");
  }

  function showScreen(name) {
    intro.hidden = name !== "intro";
    battle.hidden = name !== "battle";
    result.hidden = name !== "result";
  }

  function setHp(el, value) {
    el.style.width = `${Math.max(0, Math.min(100, value))}%`;
  }

  function setActionsEnabled(on) {
    battleActions.querySelectorAll("button").forEach((btn) => {
      btn.disabled = !on;
    });
  }

  function startBattle(key) {
    const starter = STARTERS[key];
    if (!starter) return;
    state.player = starter;
    state.playerHp = 100;
    state.enemyHp = 100;
    state.busy = false;
    state.shielded = false;
    playerName.textContent = starter.name;
    playerSprite.src = starter.sprite;
    playerSprite.alt = starter.name;
    setHp(playerHpEl, 100);
    setHp(enemyHpEl, 100);
    battleLog.textContent = `A wild Stonepup blocks the workshop door! ${starter.name} is ready.`;
    showScreen("battle");
    setActionsEnabled(true);
  }

  function endBattle(won) {
    showScreen("result");
    if (won) {
      resultTitle.textContent = "Print complete!";
      resultCopy.textContent =
        `Stonepup retreated. ${state.player.name} holds the workshop. ` +
        "If you made it here, you already know I care about craft — and a little mischief.";
    } else {
      resultTitle.textContent = "Print failed";
      resultCopy.textContent =
        "Stonepup won this round. Heat the nozzle and try another filament.";
    }
  }

  function enemyTurn() {
    const moves = [
      { name: "Rock Slam", dmg: [12, 20] },
      { name: "Pebble Barrage", dmg: [8, 16] },
      { name: "Dust Cloud", dmg: [6, 12] },
    ];
    const move = moves[Math.floor(Math.random() * moves.length)];
    let dmg =
      move.dmg[0] + Math.floor(Math.random() * (move.dmg[1] - move.dmg[0] + 1));
    if (state.shielded) {
      dmg = Math.floor(dmg * 0.4);
      state.shielded = false;
      battleLog.textContent = `Stonepup used ${move.name}! Layer Shield absorbed most of it (−${dmg}).`;
    } else {
      battleLog.textContent = `Stonepup used ${move.name}! (−${dmg} HP)`;
    }
    state.playerHp -= dmg;
    setHp(playerHpEl, state.playerHp);
    if (state.playerHp <= 0) {
      state.playerHp = 0;
      setHp(playerHpEl, 0);
      setTimeout(() => endBattle(false), 700);
      return;
    }
    state.busy = false;
    setActionsEnabled(true);
  }

  function playerMove(type) {
    if (state.busy || !state.player) return;
    state.busy = true;
    setActionsEnabled(false);

    if (type === "shield") {
      state.shielded = true;
      battleLog.textContent = `${state.player.name} printed a Layer Shield!`;
      setTimeout(enemyTurn, 850);
      return;
    }

    let dmg;
    let label;
    if (type === "special") {
      dmg = 22 + Math.floor(Math.random() * 14);
      label = state.player.special;
    } else {
      dmg = 14 + Math.floor(Math.random() * 12);
      label = "Strike";
    }

    // Small crit chance
    if (Math.random() < 0.18) {
      dmg = Math.floor(dmg * 1.45);
      battleLog.textContent = `Critical print! ${state.player.name} used ${label}! (−${dmg})`;
    } else {
      battleLog.textContent = `${state.player.name} used ${label}! (−${dmg})`;
    }

    state.enemyHp -= dmg;
    setHp(enemyHpEl, state.enemyHp);

    if (state.enemyHp <= 0) {
      state.enemyHp = 0;
      setHp(enemyHpEl, 0);
      setTimeout(() => endBattle(true), 700);
      return;
    }

    setTimeout(enemyTurn, 900);
  }

  // Unlock: spool clicks
  trigger?.addEventListener("click", () => {
    state.spoolClicks += 1;
    trigger.classList.add("is-hot");
    setTimeout(() => {
      if (!state.unlocked) trigger.classList.remove("is-hot");
    }, 400);
    if (state.spoolClicks >= 5 || state.unlocked) {
      unlock("spool");
      state.spoolClicks = 0;
    }
  });

  // Unlock: Konami + typing "forge" / "printforge"
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) {
      closeForge();
      return;
    }

    // Don't capture typing inside inputs (none currently, but safe)
    if (e.target.matches("input, textarea, [contenteditable]")) return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        unlock("konami");
      }
    } else {
      konamiIndex = key === KONAMI[0] ? 1 : 0;
    }

    if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith("forge") || typed.endsWith("printforge") || typed.endsWith("unicorn")) {
        unlock("type");
        typed = "";
      }
    }
  });

  starterPick?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-starter]");
    if (!btn) return;
    startBattle(btn.dataset.starter);
  });

  battleActions?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-move]");
    if (!btn) return;
    playerMove(btn.dataset.move);
  });

  closeBtn?.addEventListener("click", closeForge);
  exitBtn?.addEventListener("click", closeForge);
  againBtn?.addEventListener("click", () => showScreen("intro"));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeForge();
  });

  // Persist unlock so returning visitors keep the hint
  if (localStorage.getItem("printforge-unlocked") === "1") {
    state.unlocked = true;
    if (hint) {
      hint.hidden = false;
      hint.textContent = "The forge remembers you. Click the spool anytime.";
    }
    if (trigger) trigger.classList.add("is-hot");
  }
})();
