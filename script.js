import Soundfont from "https://cdn.skypack.dev/soundfont-player";

const NOTES = {
  "keyz": "G3",
  "keyx": "A3",
  "keyc": "B3",
  "keyv": "C4",
  "keyb": "D4",
  "keyn": "E4",
  "keym": "F4",
  "keyq": "G4",
  "keyw": "A4",
  "keye": "B4",
  "keyr": "C5",
  "keyt": "D5",
  "keyy": "E5",
  "keyu": "F5",
  "keyi": "G5",
  "keyo": "A5",
  "keyp": "B5",
  "keys": "G#3",
  "keyd": "A#3",
  "keyg": "C#4",
  "keyh": "D#4",
  "keyk": "F#4",
  "keyl": "G#4",
  "keyñ": "A#4",
  "key5": "C#5",
  "key6": "D#5",
  "key8": "F#5",
  "key9": "G#5",
  "key0": "A#5" };


const ac = new AudioContext();
const options = { soundfont: "FluidR3_GM" };
const cumbiaSong = new Audio("https://manzdev.github.io/twitch-casio-pt1/cumbia.mp3");
cumbiaSong.volume = 0.45;
const playingNotes = {};
let currentInstrument = "piano";
let currentVolume = 1;
let thanosMode = false;

const COLORMODES = [
{ bgcolor: "#171e27", color: "#909eb4" },
{ bgcolor: "#c0beaf", color: "#4d1210" },
{ bgcolor: "#c02628", color: "#e17d75" },
{ bgcolor: "#becedd", color: "#6b799e" }];


const colorsButtons = document.querySelectorAll(".colorButtons button");
colorsButtons.forEach((button, index) => {
  button.style.setProperty("--casio-bgcolor", COLORMODES[index].bgcolor);
  button.style.setProperty("--casio-color", COLORMODES[index].color);
  button.addEventListener("click", () => {
    document.body.style.setProperty("--casio-bgcolor", COLORMODES[index].bgcolor);
    document.body.style.setProperty("--casio-color", COLORMODES[index].color);
  });
});

const instruments = {
  piano: "acoustic_grand_piano",
  fantasy: "lead_2_sawtooth",
  violin: "violin",
  flute: "flute" };


for (const pair of Object.entries(instruments)) {
  const [key, value] = pair;
  Soundfont.instrument(ac, value, options).
  then(data => {instruments[key] = data;});
}

const play = (instrument, note, duration = 6) => {
  playingNotes[note] = instruments[instrument].start(note, ac.currentTime, { duration, gain: currentVolume });
};

const stop = note => {
  const playingNote = playingNotes[note];
  playingNote.stop();
  playingNotes[note] = null;
};

const pianoKeys = document.querySelectorAll(".key");
pianoKeys.forEach(key => {
  const note = key.dataset.note;
  key.addEventListener("mousedown", () => play(currentInstrument, note));
  key.addEventListener("mouseleave", () => playingNotes[note] && stop(note));
  key.addEventListener("mouseup", () => playingNotes[note] && stop(note));
});

document.addEventListener("keydown", ev => {
  const id = `key${ev.key}`;
  const note = NOTES[id];
  if (!playingNotes[note] && note) {
    const key = document.querySelector(`[data-note="${note}"]`);
    key.classList.add("active");
    play(currentInstrument, note);
  }
});

document.addEventListener("keyup", ev => {
  const id = `key${ev.key}`;
  const note = NOTES[id];
  if (playingNotes[note] && note) {
    const key = document.querySelector(`[data-note="${note}"]`);
    key.classList.remove("active");
    stop(note);
  }
});

const toneSliders = document.querySelectorAll(".tone input");
toneSliders.forEach(input => {
  input.addEventListener("click", () => {
    const instrument = input.id;
    currentInstrument = String(instrument);
  });
});

const volumeSliders = document.querySelectorAll(".volume input");
volumeSliders.forEach(input => {
  input.addEventListener("click", () => {
    const volume = input.value;
    currentVolume = Number(volume);
  });
});

// Thanos egg easter
const COLORS = ["#d81313", "#eace17", "#33ea12", "#12eae3", "#101eea", "#ea10e3"];

const changeColor = () => {
  setTimeout(() => {
    const color = COLORS[~~(Math.random() * COLORS.length)];
    document.body.classList.remove("dark");
    document.body.style.setProperty("--body-color", color);
    if (thanosMode) {setTimeout(() => changeColor(), 350);}
  }, 350);
};

const disableThanosMode = () => {
  document.body.classList.remove(...["dark", "party"]);
  const thanosImage = document.querySelector(".thanos");
  thanosImage && thanosImage.remove();
  thanosMode = false;
  cumbiaSong.pause();
};

const enableThanosMode = () => {
  thanosMode = true;
  cumbiaSong.currentTime = 0;
  cumbiaSong.play();
  document.body.classList.add("dark");

  // Thanos image add
  setTimeout(() => {
    const image = document.createElement("img");
    image.src = "https://manzdev.github.io/twitch-casio-pt1/thanos.png";
    image.className = "thanos";
    document.body.appendChild(image);
  }, 18000);

  // Party mode
  setTimeout(() => {
    document.body.classList.add("party");
    changeColor();
  }, 27000);
};

const demoButton = document.querySelector("[data-type=demo");
demoButton.addEventListener("click", () => {
  if (cumbiaSong.paused) {enableThanosMode();} else {disableThanosMode();}
});