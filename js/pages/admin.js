// 管理员后台 (PUZZLE_006 登录 / 007 发现416 / 008 结局)
import { el } from "../components/dom.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";
import { buildUserDatabase } from "../data/users.js";
import { openXPWindow } from "../components/xp-window.js";

export function renderAdmin(ctx) {
  const state = GameState.get();

  // 登录阶段
  if (!GameState.isPuzzleDone("PUZZLE_006")) {
    return loginScreen(ctx, state);
  }

  // 已登录：用户数据库
  return panelScreen(ctx, state);
}

function loginScreen(ctx, state) {
  const wrap = el("div", { class: "admin-panel", style: { minHeight: "420px" } });
  wrap.appendChild(el("div", { class: "admin-head", text: "ADMIN PANEL" }));
  wrap.appendChild(el("div", { class: "admin-sub", text: "> Last Online 管理后台  |  授权访问" }));

  const login = el("div", { class: "admin-login" });
  login.appendChild(el("div", { style: { color: "#7fd0ff", marginBottom: "12px", fontFamily: "Tahoma" }, text: "ACCESS CONTROL" }));
  login.appendChild(el("div", { style: { color: "#999", fontSize: "11px", marginBottom: "14px" }, text: "请输入管理员口令。访客也是数据。" }));
  const input = el("input", { class: "xp-input", type: "password", placeholder: "password", style: { width: "220px", background: "#111", color: "#7fd0ff", border: "1px solid #444" } });
  login.appendChild(input);
  login.appendChild(el("br"));
  const btn = el("button", { class: "xp-btn primary", text: "登录", style: { marginTop: "10px" } });
  login.appendChild(btn);
  const err = el("div", { style: { color: "#c00", fontSize: "11px", marginTop: "8px", minHeight: "14px" } });
  login.appendChild(err);

  btn.addEventListener("click", () => {
    ctx.sound.click();
    const val = input.value.trim();
    if (val === "20021225") {
      ctx.sound.success();
      GameState.completePuzzle("PUZZLE_006");
      Events.emit("EVT_ADMIN_OPEN");
      ctx.rerender();
    } else {
      ctx.sound.error();
      err.textContent = "Access Denied. 访客也是数据。";
      input.value = "";
    }
  });
  input.addEventListener("keydown", e => { if (e.key === "Enter") btn.click(); });

  wrap.appendChild(login);
  return wrap;
}

function panelScreen(ctx, state) {
  const wrap = el("div", { class: "admin-panel", style: { minHeight: "420px" } });
  wrap.appendChild(el("div", { class: "admin-head", text: "ADMIN PANEL" }));
  wrap.appendChild(el("div", { class: "admin-sub", text: "> USER DATABASE  |  welcome, administrator" }));

  // 工具栏
  const bar = el("div", { style: { padding: "6px 10px", background: "#1a1a1a", borderBottom: "1px solid #333", fontSize: "11px", color: "#888" } }, [
    el("span", { text: "共 416 条记录  |  在线：1  |  归档：415" }),
  ]);
  wrap.appendChild(bar);

  // 表格
  const tblWrap = el("div", { style: { maxHeight: "320px", overflow: "auto" } });
  const tbl = el("table", { class: "admin-table" });
  tbl.appendChild(el("thead", {}, [el("tr", {}, [
    el("th", { text: "ID" }), el("th", { text: "USER" }), el("th", { text: "ROLE" }), el("th", { text: "FIRST_VISIT" }), el("th", { text: "STATUS" }),
  ])]));
  const tb = el("tbody");
  const db = buildUserDatabase(state.nickname, state.firstVisit);
  // 分段显示：前5 + 省略 + 后几条（含416）
  db.slice(0, 5).forEach(r => tb.appendChild(adminRow(r)));
  tb.appendChild(el("tr", {}, [el("td", { colspan: "5", style: { textAlign: "center", color: "#555", padding: "6px" }, text: "... 409 条已归档记录 ..." })]));
  db.slice(-3).forEach(r => tb.appendChild(adminRow(r)));
  tbl.appendChild(tb);
  tblWrap.appendChild(tbl);
  wrap.appendChild(tblWrap);

  wrap.appendChild(el("div", { style: { padding: "8px 10px", color: "#0a8a0a", fontSize: "11px" }, text: "> 点击任一记录查看详情。" }));

  // 提示已发现自我
  if (GameState.isPuzzleDone("PUZZLE_007")) {
    wrap.appendChild(el("div", { style: { padding: "8px 10px", background: "#2a1010", color: "#ff5a3a", fontSize: "12px" }, text: "> WARNING: 当前访客已被记录为 USER 416。Status: ONLINE" }));
    if (!GameState.isPuzzleDone("PUZZLE_008")) {
      const endBtn = el("button", { class: "xp-btn", text: "返回首页", style: { margin: "8px 10px" } });
      endBtn.addEventListener("click", () => {
        ctx.sound.click();
        GameState.completePuzzle("PUZZLE_008");
        Events.emit("EVT_ENDING");
        ctx.navigate("/");
      });
      wrap.appendChild(endBtn);
    }
  }

  function adminRow(r) {
    const tr = el("tr", { class: r.me ? "me" : "" }, [
      el("td", { text: String(r.id).padStart(3, "0") }),
      el("td", { text: r.user }),
      el("td", { text: r.role }),
      el("td", { text: r.firstVisit }),
      el("td", { text: r.status, style: { color: r.status === "ONLINE" ? "#0a8a0a" : "#888" } }),
    ]);
    tr.addEventListener("click", () => showDetail(ctx, r));
    return tr;
  }

  return wrap;
}

function showDetail(ctx, r) {
  ctx.sound.click();
  const body = el("div", { class: "admin-detail" });
  body.appendChild(el("div", { class: "admin-head", text: "USER RECORD #" + String(r.id).padStart(3, "0") }));
  body.appendChild(el("div", { class: "drow", html: `<b>User:</b> ${r.user}` }));
  body.appendChild(el("div", { class: "drow", html: `<b>Role:</b> ${r.role}` }));
  body.appendChild(el("div", { class: "drow", html: `<b>First Visit:</b> ${r.firstVisit}` }));
  body.appendChild(el("div", { class: "drow", html: `<b>Status:</b> <span class="${r.status === "ONLINE" ? "online" : ""}">${r.status}</span>` }));
  if (r.me) {
    body.appendChild(el("div", { style: { color: "#ff5a3a", marginTop: "10px", fontStyle: "italic" }, text: "> 这不是历史用户。这是你。" }));
    // PUZZLE_007
    if (!GameState.isPuzzleDone("PUZZLE_007")) {
      GameState.completePuzzle("PUZZLE_007");
      Events.emit("EVT_FOUND_SELF");
      setTimeout(() => {
        ctx.dialog.show({
          title: "用户档案", type: "warn",
          message: "USER 416",
          detail: `User: ${r.user}\nFirst Visit: ${r.firstVisit}\nStatus: ONLINE\n\n你成为了第 416 位访问者。\n网站已记录你的全部行为。\n\n返回首页，完成最后的确认。`,
          buttons: ["返回首页", "关闭"],
        }).then(r2 => {
          ctx.rerender();
          if (r2 === 0) {
            GameState.completePuzzle("PUZZLE_008");
            Events.emit("EVT_ENDING");
            ctx.navigate("/");
          }
        });
      }, 300);
    }
  } else if (r.id < 416) {
    body.appendChild(el("div", { style: { color: "#888", marginTop: "10px" }, text: "> 该用户已归档。ARCHIVED." }));
  }
  openXPWindow({ title: "USER #" + r.id, width: 420, body });
}
