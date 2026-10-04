// XPWindow 组件 - 模拟 Windows XP 窗口
import { el } from "./dom.js";
import { Sound } from "../core/sound.js";

// 在指定容器内打开一个 XP 窗口（模态遮罩）
export function openXPWindow({ title = "窗口", icon = "", width = 460, body, onClose, modal = true }) {
  Sound.open();

  const mask = el("div", { class: "xp-dialog-mask" });
  if (!modal) mask.style.background = "transparent";

  const win = el("div", { class: "xp-window", style: { width: width + "px", maxWidth: "92vw", maxHeight: "86vh" } });

  // 标题栏
  const tb = el("div", { class: "title-bar" });
  const tt = el("div", { class: "tb-title" });
  if (icon) tt.appendChild(el("span", { class: "tb-icon", html: icon }));
  tt.appendChild(el("span", { text: title }));
  const ctrl = el("div", { class: "tb-controls" });
  const btnClose = el("div", { class: "tb-btn close", text: "×", title: "关闭" });
  ctrl.appendChild(btnClose);
  tb.appendChild(tt);
  tb.appendChild(ctrl);

  const winBody = el("div", { class: "win-body", style: { maxHeight: "70vh" } });
  if (typeof body === "string") winBody.innerHTML = body;
  else if (body instanceof Node) winBody.appendChild(body);

  win.appendChild(tb);
  win.appendChild(winBody);
  mask.appendChild(win);

  let closed = false;
  function close() {
    if (closed) return; closed = true;
    Sound.close();
    mask.remove();
    if (onClose) onClose();
  }
  btnClose.addEventListener("click", close);
  tb.addEventListener("dblclick", close);
  mask.addEventListener("mousedown", e => { if (e.target === mask) close(); });

  document.body.appendChild(mask);
  return { win, body: winBody, close };
}

// 非模态浮动窗口（贴在页面区内）
export function floatXPWindow({ title = "窗口", width = 360, body, parent, onClose, x, y }) {
  Sound.open();
  const win = el("div", { class: "xp-window", style: { position: "absolute", width: width + "px", zIndex: 100, left: (x||20)+"px", top: (y||20)+"px" } });
  const tb = el("div", { class: "title-bar", style: { cursor: "move" } });
  const tt = el("div", { class: "tb-title" }, [el("span", { text: title })]);
  const ctrl = el("div", { class: "tb-controls" });
  const btnClose = el("div", { class: "tb-btn close", text: "×" });
  ctrl.appendChild(btnClose);
  tb.appendChild(tt); tb.appendChild(ctrl);
  const winBody = el("div", { class: "win-body" });
  if (typeof body === "string") winBody.innerHTML = body;
  else if (body instanceof Node) winBody.appendChild(body);
  win.appendChild(tb); win.appendChild(winBody);

  // 拖拽
  let drag = null;
  tb.addEventListener("mousedown", e => {
    if (e.target.classList.contains("tb-btn")) return;
    if (!parent) return;
    const rect = win.getBoundingClientRect();
    const prect = parent.getBoundingClientRect();
    drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top, prect };
    e.preventDefault();
  });
  document.addEventListener("mousemove", e => {
    if (!drag) return;
    let nx = e.clientX - drag.dx - drag.prect.left;
    let ny = e.clientY - drag.dy - drag.prect.top;
    nx = Math.max(0, Math.min(nx, drag.prect.width - 80));
    ny = Math.max(0, Math.min(ny, drag.prect.height - 28));
    win.style.left = nx + "px";
    win.style.top = ny + "px";
  });
  document.addEventListener("mouseup", () => drag = null);

  let closed = false;
  function close() {
    if (closed) return; closed = true;
    Sound.close();
    win.remove();
    if (onClose) onClose();
  }
  btnClose.addEventListener("click", close);

  (parent || document.body).appendChild(win);
  return { win, body: winBody, close };
}
