// 聊天室 (PUZZLE_005)
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { CHAT_LOG, CHAT_USERS } from "../data/chat.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";

export function renderChat(ctx) {
  const main = el("div");

  const unlocked = GameState.hasEvent("EVT_BACKUP_EXTRACT");

  if (!unlocked) {
    // 维护中
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "聊天室" }),
      el("div", { class: "box-body", html: `
        <p style="color:#c00;font-weight:bold">⚠ 聊天室维护中</p>
        <p style="color:#666;font-size:12px">自 2003-09-17 起暂停服务。</p>
        <p style="color:#666;font-size:12px;margin-top:8px">历史记录已随 <b>forum_backup.zip</b> 备份。</p>
        <p style="color:#888;font-size:11px;margin-top:8px">提示：前往<a href="#/download" id="goto-dl" style="color:#0033cc">下载中心</a>获取备份。</p>
      ` }),
    ]));
    main.querySelector("#goto-dl")?.addEventListener("click", e => { e.preventDefault(); ctx.navigate("/download"); });
    return siteLayout(ctx, { main, active: "chat" });
  }

  // 聊天室界面
  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "聊天室 — 青藤镇社区 (历史记录 2003-09-17)" }),
    el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">当前为只读模式，无法发送消息。</span>` }),
  ]));

  const wrap = el("div", { class: "chat-wrap" });
  wrap.appendChild(el("div", { class: "chat-head", text: "青藤镇聊天室 #1" }));

  const layout = el("div", { class: "chat-layout" });

  // 用户列表
  const users = el("div", { class: "chat-users" });
  users.appendChild(el("div", { style: { fontWeight: "bold", borderBottom: "1px solid #ccc", marginBottom: "4px" }, text: "在线用户" }));
  CHAT_USERS.forEach(u => {
    users.appendChild(el("div", { class: "cu" + (u.sys ? " sys" : "") }, [
      el("span", { class: "dot" }),
      el("span", { text: u.name, style: { fontSize: "11px" } }),
    ]));
  });
  layout.appendChild(users);

  // 聊天记录
  const log = el("div", { class: "chat-log" });
  CHAT_LOG.forEach(l => {
    const line = el("div", { class: "chat-line" + (l.system ? " system" : "") + (l.unknown ? " unknown" : "") });
    if (l.system) {
      line.appendChild(el("span", { class: "cl-time", text: l.time }));
      line.appendChild(el("span", { class: "cl-user system", text: l.user + "：" }));
      line.appendChild(el("span", { class: "cl-msg", text: l.msg }));
    } else if (l.unknown) {
      line.appendChild(el("span", { class: "cl-time", text: l.time }));
      line.appendChild(el("span", { class: "cl-user", style: { color: "#c00" }, text: l.user + "：" }));
      line.appendChild(el("span", { class: "cl-msg", style: { color: "#c00", fontStyle: "italic" }, text: l.msg }));
    } else {
      line.appendChild(el("span", { class: "cl-time", text: l.time }));
      line.appendChild(el("span", { class: "cl-user" + (l.role === "admin" ? " admin" : ""), text: l.user + "：" }));
      line.appendChild(el("span", { class: "cl-msg", text: l.msg }));
    }
    log.appendChild(line);
  });
  layout.appendChild(log);

  wrap.appendChild(layout);

  // 输入框（不可用）
  const inputArea = el("div", { class: "chat-input" });
  const inp = el("input", { class: "xp-input", disabled: "disabled", value: "（服务已关闭，无法发送消息）" });
  inp.style.color = "#999";
  const send = el("button", { class: "xp-btn", text: "发送", disabled: "disabled" });
  inputArea.appendChild(inp);
  inputArea.appendChild(send);
  wrap.appendChild(inputArea);

  main.appendChild(wrap);

  // PUZZLE_005：查看聊天记录（已解锁进入即视为调查）
  if (!GameState.isPuzzleDone("PUZZLE_005")) {
    GameState.completePuzzle("PUZZLE_005");
    Events.emit("EVT_CHAT_REVIEWED");
    setTimeout(() => {
      ctx.dialog.show({
        title: "调查记录", type: "info",
        message: "你阅读了最后的聊天记录。",
        detail: "2003-09-17 23:50 — 00:00\n\n张诚发现数据库多了一条用户记录。\n管理员下令关闭网站。\n00:00 所有用户离线。\n\n「他不是第一个。」\n\n管理员后台入口线索已获得。",
        buttons: ["继续"],
      }).then(() => ctx.rerender());
    }, 400);
  }

  return siteLayout(ctx, { main, active: "chat" });
}
