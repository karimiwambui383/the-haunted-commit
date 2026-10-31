# the-haunted-commit
Developer humour meets haunted-house energy.
# 🎃 The Haunted House: Escape Before Midnight

A spooky browser adventure game built with plain **HTML, CSS and JavaScript**. Explore four rooms, solve a riddle, survive the scares, collect four keys and escape before the clock strikes twelve.

> Built for the **#KarimiBuilds Halloween challenge**: a week-long build, started as a beginner JavaScript and CSS project.

**▶ Play it:** `https://YOUR-USERNAME.github.io/haunted-house/`
*(replace with your live link)*

<!-- Add a screenshot or GIF here:
![Gameplay screenshot](assets/images/screenshot.png)
-->

---

## 🕯️ The story

You enter an abandoned house just before midnight. The front door locks behind you. It's **11:45 PM**, and you have 15 minutes to find a way out.

## 🎮 How to play

| | |
|---|---|
| 🔍 **Explore** | Click the glowing things in each room. |
| 🧠 **Solve** | Answer the library's riddle to win a key. |
| 👻 **Survive** | Click **BANISH IT!** before a ghost grabs you. |
| 🚪 **Escape** | Collect all 4 keys and reach the front door. |

**The key chain:** 🗝️ Silver → 🔑 Gold → 🗝️ Rusty → 👑 Master → 🚪 Front door

1. Take the **silver key** in the Entrance Hall. It opens the bedroom.
2. Solve the riddle in the **Library** to get the **gold key**. It opens the basement.
3. Search under the bed in the **Bedroom** for the **rusty key**.
4. Use the rusty key on the chest in the **Basement** to get the **master key**.
5. Run to the front door. 🦉

**The rules**
- ⏱️ Every action costs time. Midnight is 15 minutes away, and a hint costs time too.
- ❤️ You have 3 hearts. A scare you don't banish in time takes one.
- 👣 Mysterious footprints appear when you enter a room. Most of the time (70%) they lead you toward what you need next. The rest of the time (30%) they stop, and something is waiting.

## ✨ Features

- 🏚️ **Four rooms** drawn entirely in CSS: Entrance Hall, Library, Bedroom, Basement
- 🔑 **Key slots** in the HUD that light up as you collect them
- 🎯 **Goal line** that always tells you the next step
- 📖 **How to play** screen and a Hint button for new players
- 🎲 **Random riddles** picked each game, so replays differ
- 👣 **Footprint system**: a 70/30 mix of guidance and warnings
- 👻 **Jump scares** with a reaction challenge
- 🔊 **Sound effects** created in code with the Web Audio API (no audio files)
- 🌳 **Win scene**: a spooky tree with an owl, plus a shareable result card
- 📱 **Responsive** layout designed to fit phones and desktops without scrolling

## 🛠️ Built with

- **HTML5**: page structure
- **CSS3**: Grid and Flexbox layout, keyframe animations, `clip-path` shapes, gradients, CSS variables, container query units (`cqmin`), media queries
- **JavaScript (vanilla)**: game state, DOM manipulation, events, timers, random numbers, Web Audio API

No frameworks, libraries or build tools.

## 📁 Project structure

```
haunted-house/
├── index.html      # page structure: intro, game screen, pop-ups, win scene
├── style.css       # all visuals, room artwork and responsive rules
├── script.js       # game logic: rooms, keys, riddles, scares, footprint
├── README.md
└── LICENSE
```

## 🚀 Run it locally

1. Download or clone this repository:
   ```bash
   git clone https://github.com/karimiwambui383/the-haunted-commit
   ```
2. Open the folder and double-click `index.html`.

That's it. There's nothing to install. The **Copy result** button works best when the game is hosted online (for example on GitHub Pages).

## 🧩 Customise it

- **Add a riddle:** edit the `RIDDLES` list in `script.js`.
- **Change the difficulty:** adjust `SECONDS_PER_ACTION` (time per action) or the scare timeout in `scare()`.
- **Make footprints more or less trustworthy:** change `0.7` in `showFootprints()`.
- **Change the look:** edit the colour variables at the top of `style.css`.

## 📚 What I learned

- Connecting JavaScript to CSS by toggling classes
- Building a small game state: health, keys, time and rooms
- Drawing scenes with CSS shapes instead of images
- Making a layout fit any screen size
- Using AI as a coding partner while understanding, testing and changing the code myself

## 🔮 Ideas for next time

- Real illustrated room backgrounds
- A Python (FastAPI) backend for riddles and a leaderboard
- Background music and ambient sounds
- More rooms, items and endings

## 👩🏾‍💻 Author

Built by **Star** · #KarimiBuilds

Made for Halloween 🎃 with code, curiosity and a little vibe coding.

## 📄 License

See the [LICENSE](LICENSE) file for details.
