// 论坛列表 + 帖子详情 (PUZZLE_001)
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { POSTS, getPost } from "../data/posts.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";

export function renderForum(ctx) {
  const main = el("div");

  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "青藤镇社区论坛" }),
    el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">共 ${POSTS.length} 个主题 · 最后更新 2003-09-17</span>` }),
  ]));

  const table = el("table", { class: "forum-list" });
  table.appendChild(el("thead", {}, [el("tr", {}, [
    el("th", { class: "col-title", text: "主题" }),
    el("th", { class: "col-author", text: "作者" }),
    el("th", { class: "col-replies", text: "回复" }),
    el("th", { class: "col-time", text: "发表时间" }),
  ])]));

  const tbody = el("tbody");
  POSTS.forEach(p => {
    const tr = el("tr");
    const titleCell = el("td", { class: "col-title" });
    if (p.anomaly) titleCell.appendChild(el("span", { class: "tag anomaly", text: "异常" }));
    titleCell.appendChild(el("span", { text: " " + p.title, style: { fontWeight: p.anomaly ? "bold" : "normal" } }));
    tr.appendChild(titleCell);
    tr.appendChild(el("td", { class: "col-author", text: p.author }));
    tr.appendChild(el("td", { class: "col-replies", text: String(p.replies) }));
    tr.appendChild(el("td", { class: "col-time", text: p.time }));
    tr.addEventListener("click", () => {
      ctx.sound.click();
      ctx.navigate(`/forum/post?id=${p.id}`);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  main.appendChild(table);

  return siteLayout(ctx, { main, active: "forum" });
}

export function renderPost(ctx, id) {
  const post = getPost(id);
  const main = el("div");
  if (!post) {
    main.appendChild(el("div", { style: { padding: "40px", color: "#c00" }, text: "帖子不存在或已被删除。" }));
    return siteLayout(ctx, { main, active: "forum" });
  }

  const wrap = el("div", { class: "post-wrap" });
  wrap.appendChild(el("div", { class: "post-title", text: post.title }));

  // 楼主
  wrap.appendChild(renderFloor(ctx, {
    user: post.author, role: post.authorRole, reg: post.reg,
    time: post.time, body: post.body, online: post.online,
  }));

  // 回复
  post.repliesList.forEach(r => {
    wrap.appendChild(renderFloor(ctx, {
      user: r.user, role: r.role || "会员", reg: r.reg || "2003-01-01",
      time: r.time, body: r.body, unknown: r.unknown,
    }));
  });

  // PUZZLE_001：阅读异常帖（id=13）并看到"他不是第一个"
  if (post.id === 13 && !GameState.isPuzzleDone("PUZZLE_001")) {
    GameState.completePuzzle("PUZZLE_001");
    Events.emit("EVT_FORUM_ANOMALY");
    setTimeout(() => {
      ctx.dialog.show({
        title: "线索发现", type: "info",
        message: "你发现了一条异常回复。",
        detail: "「他不是第一个。」\n\n关键词已记录：第13个人\n\n返回首页时，网站状态似乎发生了变化。",
        buttons: ["继续"],
      }).then(() => ctx.rerender());
    }, 300);
  }

  main.appendChild(wrap);

  // 提示
  const hint = el("div", { class: "hint-line", text: "› 返回论坛列表" });
  hint.style.cursor = "pointer";
  hint.addEventListener("click", () => ctx.navigate("/forum"));
  main.appendChild(hint);

  return siteLayout(ctx, { main, active: "forum" });
}

function renderFloor(ctx, { user, role, reg, time, body, online, unknown }) {
  const row = el("div", { class: "post-row" + (unknown ? " unknown" : "") });
  const left = el("div", { class: "post-left" });
  left.appendChild(el("div", { class: "post-avatar", text: user.slice(0, 1) }));
  left.appendChild(el("div", { class: "uname", text: user, style: unknown ? { color: "#c00" } : null }));
  left.appendChild(el("div", { class: "umeta", text: role }));
  left.appendChild(el("div", { class: "umeta", text: "注册：" + reg }));
  if (online) left.appendChild(el("div", { class: "ustat", text: "● 在线" }));
  if (unknown) left.appendChild(el("div", { class: "ustat", text: "● 在线", style: { color: "#c00" } }));

  const right = el("div", { class: "post-right" });
  right.appendChild(el("div", { class: "ptime", text: "发表于 " + time }));
  const content = el("div", { class: "pcontent" });
  if (unknown) content.classList.add("anomaly");
  content.style.whiteSpace = "pre-wrap";
  content.textContent = body;
  right.appendChild(content);

  // 异常回复的签名彩蛋
  if (unknown) {
    right.appendChild(el("div", { class: "signature", html: `<span style="color:#c00">—— 他不是第一个，也不会是最后一个。</span>` }));
  }

  row.appendChild(left);
  row.appendChild(right);
  return row;
}
