// 对话框组件 - XP 风格提示框
import { el } from "./dom.js";
import { Sound } from "../core/sound.js";

// type: info / warn / error / question
export function showDialog({ title = "提示", type = "info", message, detail = "", buttons = ["确定"] }) {
  Sound.open();
  const iconMap = { info: "i", warn: "!", error: "×", question: "?" };
  const clsMap = { info: "info", warn: "warn", error: "error", question: "question" };

  const mask = el("div", { class: "xp-dialog-mask" });
  const dlg = el("div", { class: "xp-dialog" });

  const tb = el("div", { class: "title-bar" }, [
    el("div", { class: "tb-title" }, [el("span", { text: title })]),
    el("div", { class: "tb-controls" }),
  ]);

  const body = el("div", { class: "dlg-body" }, [
    el("div", { class: "dlg-icon " + clsMap[type], text: iconMap[type] }),
    el("div", { class: "dlg-content" }, [
      el("b", { text: typeof message === "string" ? message : "" }),
      detail ? el("div", { style: { whiteSpace: "pre-wrap" }, text: detail }) : null,
    ]),
  ]);

  const actions = el("div", { class: "dlg-actions" });
  let resolveFn;
  const promise = new Promise(r => resolveFn = r);

  buttons.forEach((b, i) => {
    const btn = el("button", { class: "xp-btn" + (i === 0 ? " primary" : ""), text: b });
    btn.addEventListener("click", () => {
      Sound.click();
      mask.remove();
      resolveFn(i);
    });
    actions.appendChild(btn);
  });

  dlg.appendChild(tb);
  dlg.appendChild(body);
  dlg.appendChild(actions);
  mask.appendChild(dlg);
  document.body.appendChild(mask);
  return promise;
}

export const alertBox = (message, title = "提示", type = "info") =>
  showDialog({ title, type, message, buttons: ["确定"] });

export const confirmBox = (message, title = "确认", type = "question") =>
  showDialog({ title, type, message, buttons: ["是", "否"] });
