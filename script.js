// =====================================================
//  THE HAUNTED HOUSE: Escape Before Midnight
//  Idea: silver key -> gold key -> rusty key -> master key -> front door
// =====================================================
const $ = (id) => document.getElementById(id);

// ---------- 1. Intro screen (your Day 1 house) ----------
const startBtn = $("start-btn");
startBtn.addEventListener("click", function () {
  $("door").classList.add("open");
  $("message").textContent = "The door creaks open... then slams shut behind you.";
  startBtn.disabled = true;
  beep(110, 0.5, "square");
  setTimeout(function () {
    $("intro").classList.add("hidden");
    $("game").classList.remove("hidden");
    newGame();
    showHowTo();
  }, 2200);
});

// ---------- 2. Game data ----------
const KEYS = {
  silver: { icon: "🗝️", name: "Silver Key" },
  gold:   { icon: "🔑", name: "Gold Key" },
  rusty:  { icon: "🗝️", name: "Rusty Key" },
  master: { icon: "👑", name: "Master Key" },
};

// A random riddle is picked each game. Add your own here!
const RIDDLES = [
  { q: "I have keys but open no locks, and space but no room. You can enter, but never go outside. What am I?", a: ["keyboard", "a keyboard"] },
  { q: "The more of me you take, the more you leave behind. What am I?", a: ["footsteps", "steps", "footstep"] },
  { q: "I speak without a mouth and hear without ears. I come alive with sound. What am I?", a: ["echo", "an echo"] },
];

const SCARES = ["👻", "😱", "👤"];

// Each spot: id, icon, label, x/y (% position), optional lock (key needed), optional show()
const ROOMS = {
  hall: { name: "Entrance Hall", spots: [
    { id: "note",       icon: "📜", label: "Torn note",      x: 20, y: 64 },
    { id: "silver",     icon: "🗝️", label: "Silver key",     x: 48, y: 76, show: () => !has("silver") },
    { id: "toLibrary",  icon: "📚", label: "Library",        x: 12, y: 34 },
    { id: "toBedroom",  icon: "🪜", label: "Bedroom",        x: 50, y: 34, lock: "silver" },
    { id: "front",      icon: "🚪", label: "Front door",     x: 87, y: 40, lock: "master" },
    { id: "toBasement", icon: "⬇️", label: "Basement",       x: 82, y: 76, lock: "gold" },
  ]},
  library: { name: "Library", spots: [
    { id: "book",     icon: "📖", label: "Whispering book", x: 50, y: 62 },
    { id: "candle",   icon: "🕯️", label: "Candle",          x: 33, y: 74 },
    { id: "toHall",   icon: "↩️", label: "Hall",            x: 85, y: 76 },
  ]},
  bedroom: { name: "Bedroom", spots: [
    { id: "bed",    icon: "🛏️", label: "Under the bed", x: 50, y: 64 },
    { id: "toHall", icon: "↩️", label: "Hall",          x: 85, y: 76 },
  ]},
  basement: { name: "Basement", spots: [
    { id: "chest",  icon: "🧰", label: "Rusty chest", x: 50, y: 68 },
    { id: "toHall", icon: "🪜", label: "Stairs up",   x: 85, y: 76 },
  ]},
};

// ---------- Room artwork: each room is a pile of styled <div>s (see style.css) ----------
const DECOR = {
  hall:     '<div class="mist"></div><div class="stairs"></div><div class="doorframe"></div>' +
            '<div class="frame f1"></div><div class="frame f2"></div><div class="chandelier"></div>',
  library:  '<div class="mist"></div><div class="shelf s1"></div><div class="shelf s2"></div><div class="rug"></div>',
  bedroom:  '<div class="wallpaper"></div><div class="wainscot"></div><div class="bwindow"></div>' +
            '<div class="beam"></div><div class="rod"></div><div class="curtain c1"></div><div class="curtain c2"></div>' +
            '<div class="frame f1"></div><div class="frame f2"></div>' +
            '<div class="wardrobe"></div><div class="bdoor"></div><div class="mist"></div>' +
            '<div class="brug"></div><div class="stand st1"></div><div class="stand st2"></div>' +
            '<div class="bed"></div><div class="pillow pl1"></div><div class="pillow pl2"></div><div class="doll">🧸</div>' +
            '<div class="lampshade"></div><div class="mirror"></div><div class="lampglow"></div>',
  basement: '<div class="bricks"></div><div class="pipe"></div><div class="lantern"></div>' +
            '<div class="barrel"></div><div class="mist"></div>',
};

// ---------- 3. Game state ----------
let state = {};
const TOTAL_SECONDS = 15 * 60;   // 11:45 PM -> midnight
const SECONDS_PER_ACTION = 40;   // every action costs time

function newGame() {
  state = { room: "hall", health: 3, keys: [], sec: 0, flags: {}, riddle: null, over: false, busy: false, muted: state.muted || false };
  closeModal();
  renderRoom();
  updateHud();
  say("The front door is locked. Midnight is close. Start with the note.");
}

// ---------- 4. Small helpers ----------
const has = (k) => state.keys.includes(k);
const say = (t) => { $("log").textContent = t; };

function updateHud() {
  $("hearts").textContent = "❤️".repeat(state.health) + "🖤".repeat(3 - state.health);
  $("keycount").textContent = state.keys.length + "/4";
  document.querySelectorAll(".slot").forEach(function (slot) {
    slot.classList.toggle("on", has(slot.dataset.key));   // lights up when collected
  });
  updateGoal();
  const minute = 45 + Math.floor(state.sec / 60);
  $("clock").textContent = minute >= 60 ? "12:00 AM" : "11:" + minute + " PM";
}

function tick() {
  state.sec += SECONDS_PER_ACTION;
  updateHud();
  if (state.sec >= TOTAL_SECONDS) end(false, "The clock strikes twelve. The house keeps you forever...");
}

function giveKey(k) {
  state.keys.push(k);
  beep(880, 0.12); setTimeout(() => beep(1320, 0.15), 120);
  say("You found the " + KEYS[k].name + "!");
  updateHud();
}

function hurt() {
  state.health--;
  updateHud();
  $("game").classList.add("hurt");
  setTimeout(() => $("game").classList.remove("hurt"), 400);
  if (state.health <= 0) end(false, "Your courage fades. The house wins this time...");
}

// ---------- Goal line: always tells the player what to do next ----------
function updateGoal() {
  let goal;
  if (!has("silver"))      goal = "Take the silver key from the hall.";
  else if (!has("gold"))   goal = "Solve the riddle in the library to get the gold key.";
  else if (!has("rusty"))  goal = "Open the bedroom and search under the bed.";
  else if (!has("master")) goal = "Unlock the basement and open the chest.";
  else                     goal = "Run to the front door and ESCAPE!";
  $("goal").textContent = "GOAL: " + goal;
}

// ---------- How to play screen ----------
function howCard(icon, title, text) {
  return '<div class="how-card"><div class="how-ico">' + icon + "</div><b>" + title + "</b><span>" + text + "</span></div>";
}
function showHowTo() {
  showModal(
    "<h3>How to play</h3>" +
    '<div class="howto">' +
      howCard("🔍", "EXPLORE", "Click the glowing things in each room.") +
      howCard("🧠", "SOLVE", "Answer riddles to win keys.") +
      howCard("👻", "SURVIVE", "Click BANISH IT! before a ghost grabs you.") +
      howCard("🚪", "ESCAPE", "Collect all 4 keys and leave before midnight.") +
    "</div>" +
    '<p class="fb">Every action costs time. Midnight is 15 minutes away.</p>' +
    '<button id="close" class="btn-pink">I\'M READY</button>',
    function () { $("close").onclick = closeModal; }
  );
}

// ---------- 5. Drawing the room ----------
function renderRoom() {
  const room = ROOMS[state.room];
  $("room").className = "room " + state.room;
  $("room-name").textContent = room.name;
  $("decor").innerHTML = DECOR[state.room];
  $("hotspots").innerHTML = "";
  room.spots.forEach(function (s) {
    if (s.show && !s.show()) return;
    const btn = document.createElement("button");
    btn.className = "spot";
    btn.style.left = s.x + "%";
    btn.style.top = s.y + "%";
    const locked = s.lock && !has(s.lock);
    btn.innerHTML = '<span class="ico">' + s.icon + '</span><span class="cap">' + s.label + (locked ? " 🔒" : "") + "</span>";
    btn.addEventListener("click", () => act(s.id));
    $("hotspots").appendChild(btn);
  });
}

function go(room) {
  state.room = room;
  tick();
  if (state.over) return;
  renderRoom();
  beep(150, 0.2, "square");
  if (room === "bedroom" && !state.flags.bedScare) {
    state.flags.bedScare = true;
    say("The bedroom is freezing cold...");
    scare();
  } else {
    say("You enter the " + ROOMS[room].name + ".");
    if (Math.random() < 0.25) scare();   // random scare!
  }
}

// ---------- 6. What happens when you click something ----------
function act(id) {
  if (state.over || state.busy) return;
  switch (id) {
    case "note":
      state.flags.note = true;
      say("The note: “Silver opens the stairs. Gold sleeps in the books. Rust hides in the dark. The master key waits below.”");
      tick(); break;
    case "silver": giveKey("silver"); renderRoom(); tick(); break;
    case "candle": say("The flame leans toward the old book..."); break;
    case "book": openRiddle(); break;
    case "bed":
      if (has("rusty")) { say("Nothing else under the bed. Just dust."); break; }
      giveKey("rusty"); tick(); break;
    case "chest":
      if (!has("rusty")) { say("The chest is locked. It needs something old and rusty."); break; }
      if (has("master")) { say("The chest is empty now."); break; }
      giveKey("master"); renderRoom(); tick(); break;
    case "toLibrary":  go("library"); break;
    case "toHall":     go("hall"); break;
    case "toBedroom":
      if (!has("silver")) { say("Locked. Something silver might open it."); break; }
      go("bedroom"); break;
    case "toBasement":
      if (!has("gold")) { say("Locked tight. It needs a gold key."); break; }
      go("basement"); break;
    case "front":
      if (!has("master")) { say("The front door is sealed. Only a master key will open it."); break; }
      end(true, "The master key turns. You stumble out into the night. You escaped!"); break;
  }
  renderRoom();
}

// ---------- 7. Riddle (modal pop-up) ----------
function openRiddle() {
  if (has("gold")) { say("The book is silent now. Its secret is yours."); return; }
  if (!state.riddle) state.riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
  showModal(
    "<h3>The Whispering Book</h3><p>" + state.riddle.q + "</p>" +
    '<input id="answer" placeholder="Type your answer" autocomplete="off">' +
    '<p class="fb" id="fb"></p>' +
    '<div class="row"><button id="submit" class="btn-cyan">ANSWER</button><button id="close">CLOSE</button></div>',
    function () {
      const input = $("answer");
      input.focus();
      const check = function () {
        const guess = input.value.trim().toLowerCase();
        if (state.riddle.a.includes(guess)) {
          closeModal(); giveKey("gold"); tick(); renderRoom();
        } else {
          tick();
          if (state.over) return;
          $("fb").textContent = "The book hisses: wrong. Time slips away...";
          beep(110, 0.3, "sawtooth");
        }
      };
      $("submit").onclick = check;
      input.onkeydown = (e) => { if (e.key === "Enter") check(); };
      $("close").onclick = closeModal;
    }
  );
}

// ---------- 8. Scares: click BANISH IT before time runs out ----------
function scare() {
  state.busy = true;
  $("scare-face").textContent = SCARES[Math.floor(Math.random() * SCARES.length)];
  const btn = $("banish");
  btn.style.left = 15 + Math.random() * 60 + "%";
  btn.style.top = 55 + Math.random() * 30 + "%";
  $("scare").classList.remove("hidden");
  beep(90, 0.6, "sawtooth", 0.15);
  const timer = setTimeout(function () {
    finish();
    say("It touched you! You lose a heart.");
    hurt();
  }, 2200);
  function finish() { clearTimeout(timer); $("scare").classList.add("hidden"); state.busy = false; }
  btn.onclick = function () { finish(); beep(660, 0.15); say("You banished it! Keep going."); };
}

// ---------- 9. Pop-ups, buttons, sound ----------
function showModal(html, setup) {
  $("modal-box").innerHTML = html;
  $("modal").classList.remove("hidden");
  if (setup) setup();
}
function closeModal() { $("modal").classList.add("hidden"); }

function end(win, text) {
  state.over = true;
  const left = Math.max(0, Math.round((TOTAL_SECONDS - state.sec) / 60));
  const hearts = "❤️".repeat(state.health) + "🖤".repeat(3 - state.health);
  const shareText = "🎃 I escaped The Haunted House with " + hearts + " and " + left + " min to spare! #KarimiBuilds";

  if (win) {
    showModal(
      '<h3>YOU ESCAPED!</h3><p>' + text + "</p>" +
      '<div class="share-card"><div class="share-title">ESCAPED!</div>' +
      "<div>" + hearts + "</div><p>" + left + " min to spare</p><small>#KarimiBuilds</small></div>" +
      '<div class="row"><button id="copy" class="btn-cyan">COPY RESULT</button>' +
      '<button id="again" class="btn-pink">PLAY AGAIN</button></div>',
      function () {
        $("again").onclick = newGame;
        $("copy").onclick = function () {
          navigator.clipboard.writeText(shareText)
            .then(function () { $("copy").textContent = "COPIED!"; })
            .catch(function () { $("copy").textContent = "SCREENSHOT IT!"; });
        };
      }
    );
  } else {
    showModal("<h3>GAME OVER</h3><p>" + text + '</p><button id="again" class="btn-pink">TRY AGAIN</button>',
      function () { $("again").onclick = newGame; });
  }
  beep(win ? 1000 : 80, 0.5, win ? "sine" : "sawtooth");
}

$("btn-inventory").onclick = function () {
  if (state.over) return;
  let list = "";
  for (const k in KEYS) {
    list += '<div class="keyitem ' + (has(k) ? "" : "missing") + '">' + KEYS[k].icon + "<br>" + KEYS[k].name + "</div>";
  }
  showModal('<h3>Inventory</h3><div class="keylist">' + list + "</div>" +
    "<p>" + (state.flags.note ? "📜 Torn note collected" : "No notes yet") + '</p><button id="close">CLOSE</button>',
    () => { $("close").onclick = closeModal; });
};

$("btn-pause").onclick = function () {
  if (state.over) return;
  showModal('<h3>Paused</h3><p>The house waits. Time stands still.</p><button id="close">RESUME</button>',
    () => { $("close").onclick = closeModal; });
};

$("btn-hint").onclick = function () {
  if (state.over || state.busy) return;
  tick();                               // hints cost time!
  if (state.over) return;
  if (!state.flags.note)  say("Hint: read the torn note in the hall.");
  else if (!has("silver")) say("Hint: take the silver key from the hall.");
  else if (!has("gold"))   say("Hint: the library has a whispering book with a riddle.");
  else if (!has("rusty"))  say("Hint: the silver key opens the bedroom. Search under the bed.");
  else if (!has("master")) say("Hint: the gold key opens the basement. Check the chest.");
  else                     say("Hint: you have the master key. Go to the front door!");
};

$("btn-help").onclick = function () { if (!state.over && !state.busy) showHowTo(); };

$("btn-sound").onclick = function () {
  state.muted = !state.muted;
  $("btn-sound").textContent = state.muted ? "SOUND OFF" : "SOUND ON";
};

// Sounds made with code (no mp3 files needed yet)
let audioCtx;
function beep(freq, dur, type, vol) {
  if (state.muted) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.value = vol || 0.08;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}
