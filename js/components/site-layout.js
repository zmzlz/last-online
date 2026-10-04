// 网站统一布局：LOGO + 导航 + 主内容 + 信息栏 + 页脚
import { el } from "./dom.js";
import { Sound } from "../core/sound.js";
import { SITE, ANNOUNCEMENTS } from "../data/site.js";
import { GameState } from "../core/state.js";

export function siteLayout(ctx, { main, active = "home", side = null, infoExtra = null }) {
  const state = GameState.get();
  const site = el("div", { class: "lo-site" });

  // LOGO
  const logo = el("div", { class: "lo-logo" }, [
    el("span", { class: "logo-text", text: state.sitePhase >= 7 ? "Last Online - Online" : SITE.name }),
    el("span", { class: "logo-sub", text: SITE.nameZh }),
    el("span", { class: "logo-since", text: SITE.since }),
    el("span", { class: "logo-banner", text: state.sitePhase >= 7 ? `欢迎回来，${state.nickname}` : "欢迎来到青藤镇社区" }),
  ]);

  // 导航
  const nav = el("div", { class: "lo-nav" });
  SITE.nav.forEach(n => {
    const a = el("a", { href: "#" + n.path, text: n.label });
    if (n.key === active) a.classList.add("cur");
    let locked = false;
    if (n.key === "chat" && !GameState.hasEvent("EVT_BACKUP_EXTRACT")) locked = false; // 可进入但显示维护
    a.addEventListener("click", (e) => {
      e.preventDefault();
      Sound.click();
      ctx.navigate(n.path);
    });
    nav.appendChild(a);
  });

  // 三栏
  const cols = el("div", { class: "lo-cols" });

  // 左侧
  const sideEl = el("div", { class: "lo-side" });
  if (side) sideEl.appendChild(side);
  else sideEl.appendChild(defaultSide(ctx));

  // 主内容
  const mainEl = el("div", { class: "lo-main" });
  if (typeof main === "string") mainEl.innerHTML = main;
  else if (main instanceof Node) mainEl.appendChild(main);

  // 右侧信息栏
  const info = el("div", { class: "lo-info" });
  info.appendChild(onlineBox(ctx));
  if (infoExtra) info.appendChild(infoExtra);
  info.appendChild(announceBox(ctx));

  cols.appendChild(sideEl);
  cols.appendChild(mainEl);
  cols.appendChild(info);

  // 页脚
  const footer = el("div", { class: "lo-footer" }, [
    el("div", { html: `${SITE.name} &copy; 2002-2003 青藤镇社区  | 管理员：${SITE.admin} | 本站最后更新：${SITE.lastUpdate}` }),
    el("div", { style: { marginTop: "4px" }, html: `Powered by Internet. 访客也是数据。` }),
  ]);

  site.appendChild(logo);
  site.appendChild(nav);
  site.appendChild(cols);
  site.appendChild(footer);
  return site;
}

function defaultSide(ctx) {
  const box = el("div", { class: "lo-box" });
  box.appendChild(el("div", { class: "box-head", text: "快速通道" }));
  const body = el("div", { class: "box-body" });
  [
    { label: "› 进入论坛", path: "/forum" },
    { label: "› 浏览相册", path: "/photo" },
    { label: "› 下载中心", path: "/download" },
    { label: "› 写留言", path: "/guestbook" },
  ].forEach(it => {
    const a = el("a", { href: "#" + it.path, text: it.label, style: { display: "block", padding: "2px 0" } });
    a.addEventListener("click", e => { e.preventDefault(); Sound.click(); ctx.navigate(it.path); });
    body.appendChild(a);
  });
  box.appendChild(body);
  return box;
}

function onlineBox(ctx) {
  const state = GameState.get();
  const final = state.sitePhase >= 7;
  const box = el("div", { class: "lo-box" });
  box.appendChild(el("div", { class: "box-head", text: "当前在线" }));
  const oc = el("div", { class: "online-count" + (final ? " final" : "") });
  oc.appendChild(el("span", { class: "num", text: final ? "13/13" : String(state.onlineCount) }));
  oc.appendChild(el("div", { text: final ? "服务器运行中" : "位网友在线" }));
  if (final) oc.appendChild(el("div", { class: "glitch", text: "Waiting For Next Visitor", style: { fontSize: "11px", marginTop: "4px" } }));
  box.appendChild(oc);
  return box;
}

function announceBox(ctx) {
  const state = GameState.get();
  let list;
  if (state.sitePhase >= 7) list = ANNOUNCEMENTS.final;
  else if (state.sitePhase >= 1) list = ANNOUNCEMENTS.revealed;
  else list = ANNOUNCEMENTS.initial;

  const box = el("div", { class: "lo-box" });
  box.appendChild(el("div", { class: "box-head", text: "站内公告" }));
  const body = el("div", { class: "box-body" });
  list.forEach(a => {
    body.appendChild(el("div", { style: { borderBottom: "1px dashed #ccc", paddingBottom: "4px", marginBottom: "4px" } }, [
      el("div", { html: `<b style="color:#c00">[${a.date}]</b> ${a.title}` }),
      el("div", { text: a.body, style: { color: "#444", fontSize: "11px" } }),
    ]));
  });
  box.appendChild(body);
  return box;
}
