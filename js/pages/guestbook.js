// 留言板
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { GUESTBOOK } from "../data/site.js";
import { GameState } from "../core/state.js";

export function renderGuestbook(ctx) {
  const main = el("div");

  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "留言板" }),
    el("div", { class: "box-body", html: `<p style="color:#666;margin-bottom:8px">留下你想对青藤镇说的话。（仅本地保存）</p>` }),
  ]));

  const list = el("div", { class: "guest-list" });
  const stored = loadStored();
  [...GUESTBOOK, ...stored].forEach(g => {
    list.appendChild(el("div", { class: "guest-item" }, [
      el("div", { class: "gh", html: `${escapeHtml(g.user)} <span class="gt">${escapeHtml(g.time)}</span>` }),
      el("div", { text: g.msg, style: { fontSize: "12px", color: "#333", whiteSpace: "pre-wrap" } }),
    ]));
  });
  main.appendChild(list);

  // 留言表单
  const form = el("div", { class: "guest-form" });
  const nameInput = el("input", { class: "xp-input", placeholder: "昵称", value: GameState.get().nickname });
  const msgInput = el("textarea", { class: "xp-input", placeholder: "说点什么…", rows: 3, style: { width: "100%" } });
  const submit = el("button", { class: "xp-btn primary", text: "提交留言" });
  form.appendChild(el("div", {}, [el("span", { text: "昵称： " }), nameInput]));
  form.appendChild(msgInput);
  form.appendChild(el("div", { style: { textAlign: "right", marginTop: "6px" } }, [submit]));
  main.appendChild(form);

  submit.addEventListener("click", () => {
    ctx.sound.click();
    const name = nameInput.value.trim() || "匿名";
    const msg = msgInput.value.trim();
    if (!msg) { ctx.dialog.alert("请输入留言内容。"); return; }
    const entry = { user: name, time: new Date().toLocaleString("zh-CN", { hour12: false }), msg };
    const s = loadStored(); s.push(entry); saveStored(s);
    // 隐藏彩蛋：玩家留言后，留言板出现异常回复
    if (Math.random() > 0.3) {
      const s2 = loadStored();
      s2.push({ user: "未知用户", time: new Date().toLocaleString("zh-CN", { hour12: false }), msg: "我们也收到了你的留言。" });
      saveStored(s2);
    }
    ctx.rerender();
  });

  return siteLayout(ctx, { main, active: "guestbook" });
}

const KEY = "last_online_guestbook";
function loadStored() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
function saveStored(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {} }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
