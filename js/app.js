// 主应用：启动 -> IE浏览器 -> 路由分发到各页面
import { clear } from "./components/dom.js";
import { createIEBrowser } from "./components/ie-browser.js";
import { renderBoot } from "./pages/boot.js";
import { GameState } from "./core/state.js";
import { Events } from "./core/events.js";
import { Sound } from "./core/sound.js";
import { floatXPWindow } from "./components/xp-window.js";
import { showDialog, alertBox, confirmBox } from "./components/dialog.js";
import { showBriefing } from "./components/briefing.js";
import { SITE } from "./data/site.js";
import { getPuzzle } from "./data/puzzles.js";

import { renderHome } from "./pages/home.js";
import { renderForum, renderPost } from "./pages/forum.js";
import { renderPhoto } from "./pages/photo.js";
import { renderChat } from "./pages/chat.js";
import { renderDownload } from "./pages/download.js";
import { renderAdmin } from "./pages/admin.js";
import { renderGuestbook } from "./pages/guestbook.js";
import { renderLinks } from "./pages/links.js";

let ie = null;
let currentPath = "/";

function start() {
  const app = document.getElementById("app");
  renderBoot(app, () => {
    showBriefing(() => {
      ie = createIEBrowser();
      app.appendChild(ie.frame);
      window.addEventListener("hashchange", handleRoute);
      window.addEventListener("lo:navigate", e => navigate(e.detail));
      window.addEventListener("lo:back", () => {
        const p = ie.back();
        if (p) navigate(p, true);
      });
      window.addEventListener("lo:refresh", () => handleRoute());
      // 默认进入首页
      if (!location.hash) location.hash = "/";
      else handleRoute();
      Sound.resume();
    });
  });
}

function parseHash() {
  let h = location.hash.slice(1) || "/";
  const [path, qs] = h.split("?");
  const query = {};
  if (qs) qs.split("&").forEach(kv => {
    const [k, v] = kv.split("=");
    query[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return { path: path || "/", query };
}

export function navigate(path, fromBack = false) {
  if (location.hash.slice(1) === path) { handleRoute(); return; }
  location.hash = path;
}

function buildCtx() {
  return {
    navigate,
    state: GameState.get(),
    sound: Sound,
    dialog: { show: showDialog, alert: alertBox, confirm: confirmBox },
    openWindow: (opts) => floatXPWindow({ ...opts, parent: ie.content }),
    rerender: () => handleRoute(),
    firePuzzle: (id) => {
      if (!GameState.isPuzzleDone(id)) {
        GameState.completePuzzle(id);
        const pz = getPuzzleEvent(id);
        if (pz) Events.emit(pz);
      }
    },
    fireEvent: (ev) => Events.emit(ev),
  };
}

function getPuzzleEvent(id) {
  const pz = getPuzzle(id);
  return pz ? pz.event : null;
}

function handleRoute() {
  if (!ie) return;
  const { path, query } = parseHash();
  currentPath = path;
  GameState.visit(path);
  ie.setLoading(true, "正在打开页面...");
  Sound.loading();

  // 模拟加载延迟，呈现 IE 加载感
  setTimeout(() => {
    const ctx = buildCtx();
    let node = null, title = SITE.name, addrPath = path;
    try {
      if (path === "/") { node = renderHome(ctx); title = SITE.name; }
      else if (path === "/forum") { node = renderForum(ctx); title = "论坛"; }
      else if (path === "/forum/post") { node = renderPost(ctx, query.id); title = "帖子"; addrPath = `/forum/post?id=${query.id||""}`; }
      else if (path === "/photo") { node = renderPhoto(ctx); title = "相册"; }
      else if (path === "/chat") { node = renderChat(ctx); title = "聊天室"; }
      else if (path === "/download") { node = renderDownload(ctx); title = "下载中心"; }
      else if (path === "/admin") { node = renderAdmin(ctx); title = "ADMIN PANEL"; }
      else if (path === "/guestbook") { node = renderGuestbook(ctx); title = "留言板"; }
      else if (path === "/links") { node = renderLinks(ctx); title = "友情链接"; }
      else {
        node = render404(ctx, path);
        title = "无法显示网页";
      }
    } catch (e) {
      console.error(e);
      node = document.createElement("div");
      node.innerHTML = `<div style="padding:40px;color:#c00">页面加载错误: ${e.message}</div>`;
    }
    ie.renderPage(node, title, addrPath);
    ie.pushHistory(addrPath);
    ie.setLoading(false);
    ie.content.scrollTop = 0;
  }, 420);
}

function render404(ctx, path) {
  const d = document.createElement("div");
  d.style.cssText = "padding:40px;font-family:Tahoma;font-size:13px;color:#333;background:#fff;min-height:400px;";
  d.innerHTML = `
    <h2 style="color:#c00">无法显示网页</h2>
    <p>您正在查找的页可能已经删除、更名或暂时不可用。</p>
    <p style="color:#888">地址: ${SITE.url}${path}</p>
    <p style="margin-top:20px"><a href="#/">返回首页</a></p>
  `;
  return d;
}

start();
