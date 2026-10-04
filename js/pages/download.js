// 下载中心 (PUZZLE_004: forum_backup.zip)
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { FILES, getFile, BACKUP_README } from "../data/files.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";
import { openXPWindow } from "../components/xp-window.js";
import { Sound } from "../core/sound.js";

const ICON_TEXT = { zip: "ZIP", rar: "RAR", txt: "TXT", jpg: "JPG", exe: "EXE", dat: "DAT", db: "DB" };

export function renderDownload(ctx) {
  const main = el("div");

  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "下载中心" }),
    el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">本站资源，仅供社区成员下载。</span>` }),
  ]));

  const table = el("table", { class: "dl-list" });
  table.appendChild(el("thead", {}, [el("tr", {}, [
    el("th", { text: "文件名" }), el("th", { text: "大小" }), el("th", { text: "上传时间" }),
    el("th", { text: "下载" }), el("th", { text: "说明" }),
  ])]));
  const tbody = el("tbody");
  FILES.forEach(f => {
    const tr = el("tr");
    const nameTd = el("td");
    nameTd.appendChild(el("span", { class: "dl-icon " + f.type, text: ICON_TEXT[f.type] || "?" }));
    nameTd.appendChild(el("span", { text: " " + f.name, style: { fontWeight: f.locked ? "bold" : "normal" } }));
    if (f.locked && !GameState.isPuzzleDone("PUZZLE_003")) {
      nameTd.appendChild(el("span", { class: "tag anomaly", text: "加密", style: { background: "#888", color: "#fff", fontSize: "10px", marginLeft: "4px", padding: "0 4px" } }));
    } else if (f.locked) {
      nameTd.appendChild(el("span", { class: "tag anomaly", text: "需密码", style: { background: "#c00", color: "#fff", fontSize: "10px", marginLeft: "4px", padding: "0 4px" } }));
    }
    tr.appendChild(nameTd);
    tr.appendChild(el("td", { text: f.size }));
    tr.appendChild(el("td", { text: f.time }));
    tr.appendChild(el("td", { text: String(f.downloads) }));
    tr.appendChild(el("td", { text: f.desc, style: { color: "#666", fontSize: "11px" } }));
    tr.addEventListener("click", () => {
      ctx.sound.click();
      handleFile(ctx, f);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  main.appendChild(table);

  // 若已解压，显示解压文件查看入口
  if (GameState.has("backup")) {
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "已解压文件 (forum_backup.zip)" }),
      el("div", { class: "box-body" }, buildExtractList(ctx)),
    ]));
  }

  return siteLayout(ctx, { main, active: "download" });
}

function buildExtractList(ctx) {
  const box = el("div");
  const items = [
    { name: "chat_log.txt", desc: "聊天室记录 2003-09-17", action: () => ctx.navigate("/chat") },
    { name: "readme.txt", desc: "备份说明（含隐藏信息）", action: () => viewReadme(ctx) },
    { name: "user.db", desc: "用户数据库", action: () => viewUserDb(ctx) },
  ];
  items.forEach(it => {
    const a = el("a", { href: "javascript:void(0)", text: "› " + it.name, style: { display: "block", padding: "3px 0", color: "#0033cc" } });
    a.appendChild(el("span", { text: "  — " + it.desc, style: { color: "#888", fontSize: "11px" } }));
    a.addEventListener("click", it.action);
    box.appendChild(a);
  });
  return box;
}

function handleFile(ctx, f) {
  if (f.fake) {
    fakeDownload(ctx, f);
    return;
  }
  if (f.id === "site_readme") { viewText(ctx, f.name, f.content); return; }
  if (f.id === "forum_backup") {
    if (!GameState.isPuzzleDone("PUZZLE_003")) {
      ctx.dialog.show({
        title: "访问被拒绝", type: "warn",
        message: "该文件需要更高访问权限。",
        detail: "forum_backup.zip 处于加密保护状态。\n\n提示：相册中似乎隐藏着什么……",
        buttons: ["知道"],
      });
      return;
    }
    promptBackupPassword(ctx, f);
    return;
  }
}

function fakeDownload(ctx, f) {
  const body = el("div");
  body.appendChild(el("div", { text: "正在下载：" + f.name, style: { fontSize: "12px", marginBottom: "6px" } }));
  const prog = el("div", { class: "dl-progress" });
  const bar = el("div", { class: "bar" });
  prog.appendChild(bar);
  body.appendChild(prog);
  body.appendChild(el("div", { class: "dl-status", text: "0%", style: { fontSize: "11px", color: "#666", textAlign: "right" } }));
  const win = openXPWindow({ title: "文件下载", width: 380, body });
  let p = 0;
  const t = setInterval(() => {
    p += 8 + Math.random() * 12;
    if (p >= 100) { p = 100; clearInterval(t); bar.style.width = "100%"; win.body.querySelector(".dl-status").textContent = "100%";
      setTimeout(() => {
        win.close();
        ctx.dialog.show({
          title: "下载完成", type: "warn",
          message: "文件无法打开。",
          detail: `${f.name}\n\n该文件为 2003 年存档资源，\n当前系统无法识别或文件已损坏。\n（这是互联网遗迹的一部分。）`,
          buttons: ["关闭"],
        });
      }, 300);
    } else { bar.style.width = p + "%"; win.body.querySelector(".dl-status").textContent = Math.floor(p) + "%"; }
  }, 180);
}

function promptBackupPassword(ctx, f) {
  const body = el("div");
  body.appendChild(el("div", { style: { fontSize: "12px", marginBottom: "8px", color: "#333" }, text: "forum_backup.zip 已加密。请输入解压密码。" }));
  body.appendChild(el("div", { style: { fontSize: "11px", color: "#888", marginBottom: "8px" }, text: "线索：网站成立日期 / 管理员信息 / 首页公告" }));
  const input = el("input", { class: "xp-input", type: "text", placeholder: "password", style: { width: "100%" } });
  body.appendChild(input);
  const errBox = el("div");
  body.appendChild(errBox);
  const btn = el("button", { class: "xp-btn primary", text: "解压", style: { marginTop: "8px" } });
  body.appendChild(el("div", { style: { textAlign: "right" } }, [btn]));

  const pwdWin = openXPWindow({ title: "forum_backup.zip - 解压", width: 420, body });

  btn.addEventListener("click", () => {
    ctx.sound.click();
    const val = input.value.trim();
    if (val === f.password) {
      ctx.sound.success();
      GameState.completePuzzle("PUZZLE_004");
      Events.emit("EVT_BACKUP_EXTRACT");
      pwdWin.close();
      extractBackup(ctx, f);
    } else {
      ctx.sound.error();
      errBox.innerHTML = "";
      errBox.appendChild(el("div", { style: { color: "#c00", fontSize: "11px", marginTop: "6px", whiteSpace: "pre-wrap" }, text: "Access Denied.\nMaybe the answer is somewhere on this website." }));
      input.value = "";
    }
  });
}

function extractBackup(ctx, f) {
  const body = el("div");
  body.appendChild(el("div", { text: "正在解压 forum_backup.zip ...", style: { fontSize: "12px", marginBottom: "6px" } }));
  const prog = el("div", { class: "dl-progress" }); const bar = el("div", { class: "bar" }); prog.appendChild(bar);
  body.appendChild(prog);
  const list = el("div", { class: "dl-extract-list", text: "" });
  body.appendChild(list);
  openXPWindow({ title: "解压完成", width: 420, body });

  let p = 0; let idx = 0;
  const t = setInterval(() => {
    p += 14; if (p > 100) p = 100; bar.style.width = p + "%";
    if (idx < f.extract.length && p > (idx + 1) * 30) {
      list.appendChild(el("div", { text: "✓ " + f.extract[idx], style: { color: "#0a8a0a" } }));
      idx++;
    }
    if (p >= 100 && idx >= f.extract.length) {
      clearInterval(t);
      list.appendChild(el("div", { text: "✓ 解压完成。", style: { color: "#0a8a0a", fontWeight: "bold", marginTop: "4px" } }));
      setTimeout(() => {
        ctx.dialog.show({
          title: "备份已解压", type: "info",
          message: "获得 3 个文件。",
          detail: "• chat_log.txt — 聊天室最后记录\n• user.db — 用户数据库\n• readme.txt — 备份说明\n\n聊天室历史记录已恢复，可前往查看。",
          buttons: ["前往聊天室", "稍后"],
        }).then(r => { ctx.rerender(); if (r === 0) ctx.navigate("/chat"); });
      }, 500);
    }
  }, 220);
}

function viewText(ctx, name, content) {
  const fv = el("div", { class: "file-viewer", text: content });
  openXPWindow({ title: "记事本 - " + name, width: 520, body: fv });
}

function viewReadme(ctx) {
  const body = el("div");
  const fv = el("div", { class: "file-viewer" });
  const lines = BACKUP_README.split("\n");
  lines.forEach(line => {
    if (line.includes("访客也是数据")) {
      const span = el("span", { class: "hidden-msg", text: line, style: { color: "#bbb" } });
      span.style.cursor = "pointer";
      span.title = "点击查看";
      span.addEventListener("click", () => { span.classList.add("revealed"); span.style.color = "#c00"; span.style.fontStyle = "italic"; ctx.sound.click(); });
      fv.appendChild(span);
    } else {
      fv.appendChild(el("div", { text: line || " " }));
    }
  });
  body.appendChild(fv);
  body.appendChild(el("div", { style: { fontSize: "11px", color: "#888", marginTop: "6px" }, text: "提示：某些隐藏文字需点击揭示。结合管理员第一次上线日期可解锁后台。" }));
  openXPWindow({ title: "记事本 - readme.txt", width: 520, body });
}

function viewUserDb(ctx) {
  const body = el("div", { class: "admin-panel", style: { maxHeight: "none" } });
  body.appendChild(el("div", { class: "admin-head", text: "USER.DB — 用户数据库" }));
  body.appendChild(el("div", { class: "admin-sub", text: "> 表 USER_RECORDS  |  共 416 条记录" }));
  const tbl = el("table", { class: "admin-table" });
  tbl.appendChild(el("thead", {}, [el("tr", {}, [
    el("th", { text: "ID" }), el("th", { text: "USER" }), el("th", { text: "FIRST_VISIT" }), el("th", { text: "STATUS" }),
  ])]));
  const tb = el("tbody");
  const sample = [
    { id: 1, user: "林启明", fv: "2002-12-25 10:00", st: "ARCHIVED" },
    { id: 2, user: "小林", fv: "2002-12-26 08:14", st: "ARCHIVED" },
    { id: 5, user: "张诚", fv: "2002-12-28 22:05", st: "ARCHIVED" },
    { id: 415, user: "Unknown 415", fv: "2025-12-31 23:59", st: "ARCHIVED" },
  ];
  sample.forEach(r => tb.appendChild(row(r)));
  tb.appendChild(row({ id: 416, user: GameState.get().nickname, fv: GameState.get().firstVisit, st: "ONLINE" }, true));
  tbl.appendChild(tb);
  body.appendChild(tbl);
  body.appendChild(el("div", { style: { color: "#0a8a0a", fontSize: "11px", padding: "8px" }, text: "> 完整数据需管理员后台权限查看。" }));
  openXPWindow({ title: "user.db", width: 560, body });
}

function row(r, me) {
  return el("tr", { class: me ? "me" : "" }, [
    el("td", { text: String(r.id).padStart(3, "0") }),
    el("td", { text: r.user }),
    el("td", { text: r.fv }),
    el("td", { text: r.st, style: { color: r.st === "ONLINE" ? "#0a8a0a" : "#888" } }),
  ]);
}
