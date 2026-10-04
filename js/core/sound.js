// 音效系统 - 使用 WebAudio 生成 XP 风格音效，无需外部资源
let ctx = null;
let enabled = true;

function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { enabled = false; }
  }
  return ctx;
}

// 生成一个简短音效
function tone(freq, dur, type = "sine", vol = 0.08, delay = 0) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const Sound = {
  resume() { const c = ac(); if (c && c.state === "suspended") c.resume(); },
  click() { tone(420, 0.05, "square", 0.05); },
  hover() { tone(880, 0.02, "sine", 0.02); },
  open() { tone(520, 0.06, "sine", 0.06); tone(700, 0.08, "sine", 0.05, 0.05); },
  close() { tone(360, 0.08, "sine", 0.05); tone(240, 0.1, "sine", 0.04, 0.04); },
  error() { tone(220, 0.18, "sawtooth", 0.07); tone(180, 0.22, "sawtooth", 0.06, 0.1); },
  success() { tone(660, 0.08, "sine", 0.06); tone(880, 0.1, "sine", 0.06, 0.08); tone(1320, 0.14, "sine", 0.05, 0.16); },
  type() { tone(1200 + Math.random()*200, 0.015, "square", 0.015); },
  loading() { tone(300, 0.4, "sine", 0.03); },
  boot() { tone(440, 0.1, "sine", 0.05); tone(660, 0.12, "sine", 0.05, 0.1); tone(880, 0.2, "sine", 0.04, 0.2); },
};
