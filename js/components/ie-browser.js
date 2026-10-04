// IEBrowser 组件 - 模拟 IE6 浏览器外壳
import { el, clear } from "./dom.js";
import { Sound } from "../core/sound.js";
import { SITE } from "../data/site.js";

export function createIEBrowser() {
  const root = el("div", { class: "ie-shell" });

  // 标题栏
  const title = el("div", { class: "ie-title" }, [
    el("div", { class: "ie-title-text" }, [
      el("span", { class: "ie-favicon" }),
      el("span", { class: "ie-doc-title", text: SITE.name + " - Microsoft Internet Explorer" }),
    ]),
    el("div", { class: "ie-controls" }, [
      el("div", { class: "tb-btn", text: "_" }),
      el("div", { class: "tb-btn", text: "□" }),
      el("div", { class: "tb-btn close", text: "×" }),
    ]),
  ]);

  // 菜单栏
  const menu = el("div", { class: "ie-menubar" }, [
    "文件(F)", "编辑(E)", "查看(V)", "收藏(A)", "工具(T)", "帮助(H)"
  ].map(t => el("span", { text: t })));

  // 工具栏 + 地址栏
  const backBtn = el("div", { class: "ie-btn enabled", title: "后退" }, [el("span", { class: "ie-glyph", text: "←" })]);
  const fwdBtn = el("div", { class: "ie-btn", title: "前进" }, [el("span", { class: "ie-glyph", text: "→" })]);
  const refreshBtn = el("div", { class: "ie-btn enabled", title: "刷新" }, [el("span", { class: "ie-glyph", text: "⟳" })]);
  const homeBtn = el("div", { class: "ie-btn enabled", title: "主页" }, [el("span", { class: "ie-glyph", text: "⌂" })]);

  const addrInput = el("input", { readonly: "readonly" });
  const addr = el("div", { class: "ie-address" }, [
    el("span", { class: "addr-icon ie-favicon" }),
    addrInput,
  ]);
  const goBtn = el("button", { class: "xp-btn ie-go", text: "转到" });

  const toolbar = el("div", { class: "ie-toolbar" }, [
    backBtn, fwdBtn, el("div", { class: "ie-sep" }),
    refreshBtn, homeBtn, el("div", { class: "ie-sep" }),
    el("span", { class: "ie-address-label", text: "地址" }),
    addr, goBtn,
  ]);

  // 页面区
  const loading = el("div", { class: "ie-loading" });
  const content = el("div", { class: "ie-content" });
  const page = el("div", { class: "ie-page" }, [loading, content]);

  // 状态栏
  const sMsg = el("span", { class: "s-msg", text: "完成" });
  const status = el("div", { class: "ie-status" }, [
    sMsg,
    el("span", { class: "s-zone", text: "Internet" }),
    el("span", { class: "s-zone", text: "🛡" }),
  ]);

  root.appendChild(title);
  root.appendChild(menu);
  root.appendChild(toolbar);
  root.appendChild(page);
  root.appendChild(status);

  // 任务栏
  const taskbar = el("div", { class: "xp-taskbar" }, [
    el("div", { class: "xp-start" }, [el("span", { text: "start" })]),
    el("div", { class: "task-tasks" }, [
      el("div", { class: "xp-task-item active" }, [
        el("span", { class: "ie-favicon" }),
        el("span", { text: "Last Online - Microsoft Interne..." }),
      ]),
    ]),
    el("div", { class: "tray" }, [
      el("span", { class: "xp-clock", id: "xp-clock" }),
    ]),
  ]);

  function updateClock() {
    const d = new Date();
    const t = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
    const clk = taskbar.querySelector("#xp-clock");
    if (clk) clk.textContent = t;
  }
  updateClock();
  setInterval(updateClock, 1000 * 10);

  let historyStack = [];
  let historyIdx = -1;

  function setLoading(on, msg) {
    if (on) {
      sMsg.textContent = msg || "正在连接...";
      loading.style.transition = "none";
      loading.style.width = "0";
      void loading.offsetWidth;
      loading.style.transition = "width .6s ease-out";
      loading.style.width = "85%";
      Sound.loading();
    } else {
      loading.style.width = "100%";
      setTimeout(() => { loading.style.width = "0"; }, 250);
      sMsg.textContent = "完成";
    }
  }

  function setAddress(path) {
    const url = SITE.url + (path === "/" ? "" : path);
    addrInput.value = url;
  }

  function setDocTitle(t) {
    root.querySelector(".ie-doc-title").textContent = t + " - Microsoft Internet Explorer";
  }

  function renderPage(node, docTitle, path) {
    clear(content);
    if (typeof node === "string") content.innerHTML = node;
    else if (node instanceof Node) content.appendChild(node);
    content.classList.remove("ie-content");
    void content.offsetWidth;
    content.classList.add("ie-content");
    setDocTitle(docTitle || SITE.name);
    setAddress(path);
  }

  // 返回容器（浏览器壳 + 任务栏）
  const frame = el("div", { class: "ie-frame" });
  frame.appendChild(root);
  frame.appendChild(taskbar);

  // 按钮交互
  refreshBtn.addEventListener("click", () => { Sound.click(); window.dispatchEvent(new CustomEvent("lo:refresh")); });
  homeBtn.addEventListener("click", () => { Sound.click(); window.dispatchEvent(new CustomEvent("lo:navigate", { detail: "/" })); });
  backBtn.addEventListener("click", () => { Sound.click(); window.dispatchEvent(new CustomEvent("lo:back")); });
  goBtn.addEventListener("click", () => { Sound.click(); window.dispatchEvent(new CustomEvent("lo:navigate", { detail: addrInput.value.replace(SITE.url, "") || "/" })); });

  return {
    frame,
    content,
    setLoading,
    renderPage,
    setAddress,
    setDocTitle,
    pushHistory(path) {
      historyStack = historyStack.slice(0, historyIdx + 1);
      historyStack.push(path);
      historyIdx = historyStack.length - 1;
      backBtn.classList.toggle("enabled", historyIdx > 0);
      fwdBtn.classList.toggle("enabled", historyIdx < historyStack.length - 1);
    },
    back() {
      if (historyIdx > 0) { historyIdx--; return historyStack[historyIdx]; }
      return null;
    },
  };
}
