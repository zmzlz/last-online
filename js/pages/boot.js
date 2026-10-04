// 开场: Internet Archive Recovery System
import { el, clear } from "../components/dom.js";
import { Sound } from "../core/sound.js";
import { GameState } from "../core/state.js";
import { showDialog } from "../components/dialog.js";

export function renderBoot(container, onEnter) {
  const screen = el("div", { class: "boot-screen" });
  const box = el("div", { class: "boot-box" });

  box.appendChild(el("h1", { text: "Internet Archive Recovery System" }));

  box.appendChild(el("div", { class: "boot-meta", html: `
    <div><b>Archive ID:</b> LO-017</div>
    <div><b>Target:</b> Unknown Website</div>
    <div><b>Created:</b> 2002</div>
    <div><b>Last Update:</b> 2003-09-17</div>
    <div><b>Recovery Date:</b> ${new Date().toLocaleDateString("zh-CN")}</div>
  ` }));

  const prompt = el("div", { class: "boot-prompt", text: "检测到异常缓存。\n是否继续恢复？" });
  const actions = el("div", { class: "boot-actions" }, [
    el("button", { class: "xp-btn primary", text: "YES" }),
    el("button", { class: "xp-btn", text: "NO" }),
  ]);
  const log = el("div", { class: "boot-log" });

  box.appendChild(prompt);
  box.appendChild(actions);
  box.appendChild(log);
  screen.appendChild(box);
  container.appendChild(screen);

  const [yesBtn, noBtn] = actions.querySelectorAll("button");

  function appendLog(line) {
    const l = el("div", { class: "line", text: "> " + line });
    log.appendChild(l);
    log.scrollTop = log.scrollHeight;
  }

  async function startRecovery() {
    yesBtn.disabled = true; noBtn.disabled = true;
    Sound.boot();
    const steps = [
      "Initializing recovery core...",
      "Mounting archive LO-017...",
      "Reading index table... 416 records found.",
      "WARNING: cache signature mismatch.",
      "Reconstructing HTML fragments...",
      "Restoring stylesheet (Luna/XP)...",
      "Loading forum database...",
      "Loading chat log 2003-09-17...",
      "Anomaly detected: online counter = 13.",
      "Building visitor profile...",
      "Recovery complete. Launching browser.",
    ];
    for (const s of steps) {
      appendLog(s);
      Sound.type();
      await new Promise(r => setTimeout(r, 280 + Math.random() * 220));
    }
    await new Promise(r => setTimeout(r, 400));
    screen.style.transition = "opacity .5s";
    screen.style.opacity = "0";
    setTimeout(() => { screen.remove(); onEnter(); }, 500);
  }

  yesBtn.addEventListener("click", async () => {
    Sound.click();
    const state = GameState.get();
    if (state.endingTriggered) {
      // 已通关，询问是否重新开始
      const r = await showDialog({
        title: "档案已恢复", type: "question",
        message: "检测到历史访问记录。",
        detail: "你曾经访问过这个网站。\n是否以新访客身份重新进入？",
        buttons: ["重新进入", "继续上次"],
      });
      if (r === 0) GameState.reset();
    }
    startRecovery();
  });

  noBtn.addEventListener("click", async () => {
    Sound.error();
    await showDialog({
      title: "恢复警告", type: "warn",
      message: "无法中止恢复。",
      detail: "档案已被打开。\n访客也是数据。",
      buttons: ["继续"],
    });
    startRecovery();
  });
}
