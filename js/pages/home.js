// 首页
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { SITE } from "../data/site.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";

export function renderHome(ctx) {
  const state = GameState.get();
  const main = el("div");

  // 欢迎横幅
  const banner = el("div", { class: "lo-box" });
  banner.appendChild(el("div", { class: "box-head", text: state.sitePhase >= 7 ? "Last Online - Online" : "欢迎光临" }));
  const bb = el("div", { class: "box-body", style: { fontSize: "13px", lineHeight: "1.8" } });
  if (state.sitePhase >= 7) {
    bb.innerHTML = `欢迎回来，<b style="color:#c00">${state.nickname}</b>。<br>
      你已经成为本站第 <b style="color:#c00">416</b> 位成员。<br>
      <span class="glitch">数据已记录。服务器运行中。</span>`;
  } else if (state.sitePhase >= 1) {
    bb.innerHTML = `欢迎来到青藤镇社区。<br>
      <span style="color:#c00">系统检测到新访客。正在同步数据……</span>`;
  } else {
    bb.innerHTML = `欢迎来到 <b>青藤镇社区</b>！<br>
      这里是我们的网上家园，论坛、相册、聊天室长期开放。<br>
      本站由 <b>${SITE.admin}</b> 创建于 2002 年 12 月 25 日。`;
  }
  banner.appendChild(bb);
  main.appendChild(banner);

  // 网站介绍
  const intro = el("div", { class: "lo-box" });
  intro.appendChild(el("div", { class: "box-head", text: "关于本站" }));
  intro.appendChild(el("div", { class: "box-body", html: `
    Last Online 是青藤镇中学 2003 届毕业生的网上社区。<br>
    自 2002 年 12 月 25 日上线以来，共有 12 位活跃成员。<br>
    提供论坛、聊天室、相册、下载中心等服务。<br><br>
    <span style="color:#888;font-size:11px">站长：${SITE.admin} (Lin Qiming) ｜ 最后更新：${SITE.lastUpdate}</span>
  ` }));
  main.appendChild(intro);

  // 最新帖子速览
  const recent = el("div", { class: "lo-box" });
  recent.appendChild(el("div", { class: "box-head", text: "最新讨论" }));
  const rb = el("div", { class: "box-body" });
  [
    { t: "秋季摄影作品征集", path: "/forum/post?id=2" },
    { t: "毕业聚会照片已上传", path: "/forum/post?id=4" },
    { t: "服务器最近总是卡顿", path: "/forum/post?id=3" },
  ].forEach(it => {
    const a = el("a", { href: "#" + it.path, text: "› " + it.t, style: { display: "block", padding: "2px 0" } });
    a.addEventListener("click", e => { e.preventDefault(); ctx.navigate(it.path); });
    rb.appendChild(a);
  });
  recent.appendChild(rb);
  main.appendChild(recent);

  // 首次访问触发"新访客记录"的隐式提示（首页第一关不强制）
  // 当玩家从论坛发现第13人后回到首页，人数变化已在信息栏体现

  // 如果已通关，触发结局展示
  if (state.sitePhase >= 7) {
    const end = el("div", { class: "lo-box" });
    end.appendChild(el("div", { class: "box-head", text: "SYSTEM" }));
    end.appendChild(el("div", { class: "box-body" }, [
      el("div", { class: "glitch", html: `Server Running...<br>Waiting For Next Visitor.<br><br>User 417: pending.` }),
    ]));
    main.appendChild(end);
  }

  return siteLayout(ctx, { main, active: "home" });
}
