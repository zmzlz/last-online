// 调查员简报 — 在恢复界面与网站之间展示故事背景与玩法
import { el, clear } from "./dom.js";
import { Sound } from "../core/sound.js";

const PAGES = [
  {
    head: "任务背景",
    icon: "档案",
    html: `
      <div class="brief-row"><b>身份：</b>互联网档案恢复项目 · 调查员</div>
      <div class="brief-row"><b>日期：</b>2026 年 7 月 15 日</div>
      <div class="brief-row"><b>档案编号：</b>LO-017</div>
      <div class="brief-row"><b>目标网站：</b>Last Online（最后在线）</div>
      <div class="brief-row"><b>网站性质：</b>2002 年上线的青藤镇社区（论坛 / 聊天室 / 相册 / 下载中心）</div>
      <div class="brief-row"><b>最后更新：</b>2003 年 9 月 17 日</div>
      <div class="brief-sep"></div>
      <div class="brief-para"><b style="color:#c00">异常情况：</b>网站停止更新后，12 名活跃用户全部消失。没有新闻，没有警方记录，没有尸体。唯一留下的，是这个仍然在线的网站。</div>
      <div class="brief-para">你的任务：恢复该网页档案，评估其内容，查明 13 年前那个夜晚的真相。</div>
    `,
  },
  {
    head: "调查方式",
    icon: "线索",
    html: `
      <div class="brief-para">这不是一个游戏界面，而是一个"真实存在过"的 2003 年网站。请像调查真实网站一样行动。</div>
      <div class="brief-para"><b>线索藏在：</b></div>
      <div class="brief-list">• 论坛帖子里的异常回复</div>
      <div class="brief-list">• 照片的图片信息（EXIF）与影子细节</div>
      <div class="brief-list">• 聊天记录的时间线</div>
      <div class="brief-list">• 压缩包、文本文件中的隐藏文字</div>
      <div class="brief-list">• 网页里颜色异常或可点击的隐藏入口</div>
      <div class="brief-para"><b>解谜原则：</b>所有密码都来自网站本身的细节（日期、人名、公告等），不要随机猜测。错误反馈不会直接告诉你答案。</div>
      <div class="brief-para"><b>注意：</b>网站会"记住"你的行为。随着调查深入，首页在线人数、公告、标题都会发生变化。</div>
    `,
  },
  {
    head: "操作与目标",
    icon: "目标",
    html: `
      <div class="brief-para"><b>操作：</b></div>
      <div class="brief-list">• 点击顶部导航切换页面</div>
      <div class="brief-list">• 点击论坛帖子 / 相册照片 / 下载文件查看详情</div>
      <div class="brief-list">• 在密码框中输入你找到的线索</div>
      <div class="brief-list">• 留意颜色异常或可点击的隐藏文字</div>
      <div class="brief-para"><b>目标：</b></div>
      <div class="brief-list">① 查明"第 13 个人"是谁</div>
      <div class="brief-list">② 弄清 2003 年 9 月 17 日那个夜晚发生了什么</div>
      <div class="brief-list">③ 在管理员后台，找到属于你的那份档案</div>
      <div class="brief-para"><b>存档：</b>进度自动保存到本地，可随时关闭后继续。</div>
      <div class="brief-para" style="color:#888;font-size:11px">提示：若卡住，回到首页公告、下载中心的"网站说明"、或照片注释里寻找线索。</div>
    `,
  },
];

export function showBriefing(onDone) {
  Sound.open();
  const mask = el("div", { class: "xp-dialog-mask", style: { zIndex: 9800 } });
  const win = el("div", { class: "xp-window", style: { width: "560px", maxWidth: "94vw" } });

  const tb = el("div", { class: "title-bar" }, [
    el("div", { class: "tb-title" }, [el("span", { text: "调查员简报 — 档案 LO-017" })]),
    el("div", { class: "tb-controls" }),
  ]);

  const body = el("div", { class: "win-body", style: { padding: "16px", minHeight: "320px", maxHeight: "60vh" } });
  const foot = el("div", { class: "dlg-actions", style: { justifyContent: "space-between" } });

  win.appendChild(tb);
  win.appendChild(body);
  win.appendChild(foot);
  mask.appendChild(win);
  document.body.appendChild(mask);

  let idx = 0;
  const pageLabel = el("span", { style: { fontSize: "11px", color: "#666" } });
  const prevBtn = el("button", { class: "xp-btn", text: "‹ 上一页" });
  const nextBtn = el("button", { class: "xp-btn primary", text: "下一页 ›" });
  const startBtn = el("button", { class: "xp-btn primary", text: "开始调查" });

  const right = el("div", { style: { display: "flex", gap: "8px" } });
  right.appendChild(prevBtn);
  right.appendChild(nextBtn);
  right.appendChild(startBtn);
  foot.appendChild(pageLabel);
  foot.appendChild(right);

  function render() {
    const p = PAGES[idx];
    clear(body);
    body.appendChild(el("div", { style: { fontSize: "16px", fontWeight: "bold", color: "#0a57d6", borderBottom: "2px solid #b9c9e8", paddingBottom: "6px", marginBottom: "10px" } }, [
      el("span", { text: "【" + p.icon + "】 ", style: { color: "#c00" } }),
      el("span", { text: p.head }),
    ]));
    body.appendChild(el("div", { class: "brief-content", html: p.html }));
    pageLabel.textContent = `第 ${idx + 1} / ${PAGES.length} 页`;
    prevBtn.style.visibility = idx === 0 ? "hidden" : "visible";
    nextBtn.style.display = idx === PAGES.length - 1 ? "none" : "inline-block";
    startBtn.style.display = idx === PAGES.length - 1 ? "inline-block" : "none";
  }

  prevBtn.addEventListener("click", () => { Sound.click(); if (idx > 0) { idx--; render(); } });
  nextBtn.addEventListener("click", () => { Sound.click(); if (idx < PAGES.length - 1) { idx++; render(); } });
  startBtn.addEventListener("click", () => {
    Sound.click();
    Sound.close();
    mask.remove();
    onDone();
  });

  render();
}
