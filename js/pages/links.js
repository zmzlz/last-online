// 友情链接（含隐藏 admin 入口）
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { FRIEND_LINKS } from "../data/site.js";
import { GameState } from "../core/state.js";

export function renderLinks(ctx) {
  const main = el("div");
  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "友情链接" }),
    el("div", { class: "box-body" }, [el("div", { class: "flinks" })]),
  ]));

  const fl = main.querySelector(".flinks");
  FRIEND_LINKS.forEach(l => {
    const a = el("a", { href: "#" + l.url, text: l.name, style: { fontSize: "12px" } });
    if (l.hidden) {
      // 隐藏入口：颜色与背景接近，hover 才显现
      a.className = "hidden-link";
      a.style.fontSize = "11px";
      a.title = "·";
      a.addEventListener("mouseenter", () => { a.style.color = "#c00"; });
    }
    a.addEventListener("click", e => {
      e.preventDefault();
      ctx.sound.click();
      if (l.url.startsWith("/")) ctx.navigate(l.url);
      else ctx.dialog.alert("外部链接，无法访问。\n（这是 2003 年的网页存档）", "提示", "warn");
    });
    fl.appendChild(a);
  });

  // 提示：若已获得 admin 入口线索
  if (GameState.has("admin_entry")) {
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "提示" }),
      el("div", { class: "box-body", html: `<span style="color:#c00">你发现了一个隐藏的管理入口。它就藏在友情链接里。</span>` }),
    ]));
  }

  return siteLayout(ctx, { main, active: "links" });
}
