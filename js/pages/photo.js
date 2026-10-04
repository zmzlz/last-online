// 相册 (PUZZLE_002 EXIF, PUZZLE_003 shadow_fragment.dat)
import { el } from "../components/dom.js";
import { siteLayout } from "../components/site-layout.js";
import { PHOTOS, getPhoto } from "../data/photos.js";
import { SHADOW_MESSAGE } from "../data/puzzles.js";
import { GameState } from "../core/state.js";
import { Events } from "../core/events.js";
import { openXPWindow } from "../components/xp-window.js";
import { Sound } from "../core/sound.js";

export function renderPhoto(ctx) {
  const main = el("div");

  main.appendChild(el("div", { class: "lo-box" }, [
    el("div", { class: "box-head", text: "社区相册" }),
    el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">记录青藤镇的时光</span>` }),
  ]));

  const grid = el("div", { class: "photo-grid" });

  // 正常照片
  PHOTOS.forEach(p => {
    grid.appendChild(photoThumb(ctx, p));
  });

  // 解锁 shadow_fragment.dat 后，出现隐藏文件项
  if (GameState.has("shadow_fragment.dat") && !GameState.has("shadow_message")) {
    const dat = el("div", { class: "photo-thumb", style: { borderColor: "#c00" } });
    dat.appendChild(el("div", { class: "ph-img", style: { background: "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#c00", fontFamily: "Consolas", fontSize: "13px" }, text: "shadow_fragment.dat" }));
    dat.appendChild(el("div", { class: "ph-name", text: "shadow_fragment.dat", style: { color: "#c00" } }));
    dat.addEventListener("click", () => openShadowFile(ctx));
    grid.appendChild(dat);
  }

  // 解锁后显示提示信息
  if (GameState.has("shadow_message")) {
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "shadow_fragment.dat" }),
      el("div", { class: "box-body", style: { whiteSpace: "pre-wrap", color: "#c00" }, text: SHADOW_MESSAGE }),
    ]));
  }

  main.appendChild(grid);

  if (GameState.has("shadow_message") && !GameState.isPuzzleDone("PUZZLE_003")) {
    // 进入这一分支说明已查看
  }

  return siteLayout(ctx, { main, active: "photo" });
}

function photoThumb(ctx, p) {
  const t = el("div", { class: "photo-thumb" });
  const img = el("div", { class: "ph-img" });
  img.appendChild(renderScene(p));
  t.appendChild(img);
  t.appendChild(el("div", { class: "ph-name", text: p.name }));
  t.addEventListener("click", () => {
    ctx.sound.click();
    openPhotoViewer(ctx, p);
  });
  return t;
}

// 用 CSS 绘制老照片场景
function renderScene(p) {
  const wrap = el("div", { style: { position: "absolute", inset: 0, overflow: "hidden", filter: "sepia(.3) contrast(.95)" } });
  if (p.scene === "school") {
    wrap.style.background = "linear-gradient(to bottom,#9ec9ff 0%,#9ec9ff 55%,#7fb86a 55%,#5a9a4a 100%)";
    wrap.appendChild(el("div", { style: { position: "absolute", left: "10%", bottom: "35%", width: "40%", height: "30%", background: "#d8d2c0", border: "1px solid #a8a090" } }));
    wrap.appendChild(el("div", { style: { position: "absolute", left: "20%", bottom: "45%", width: "8%", height: "20%", background: "#888" } }));
    appendPeople(wrap, 5, 0.62);
  } else if (p.scene === "spring") {
    wrap.style.background = "linear-gradient(to bottom,#bfe0ff 0%,#bfe0ff 50%,#8fc06a 50%,#6fa850 100%)";
    wrap.appendChild(el("div", { style: { position: "absolute", left: "8%", bottom: "40%", width: "12%", height: "40%", background: "radial-gradient(circle,#5a8a3a,#3a6a22)" } }));
    wrap.appendChild(el("div", { style: { position: "absolute", right: "10%", bottom: "40%", width: "14%", height: "38%", background: "radial-gradient(circle,#6aa04a,#4a8032)" } }));
    appendPeople(wrap, 4, 0.6);
  } else if (p.scene === "graduation") {
    wrap.style.background = "linear-gradient(to bottom,#c9ddff 0%,#c9ddff 45%,#b8a888 45%,#9a8868 100%)";
    // 12 个人
    appendPeople(wrap, 12, 0.55);
    // 第 13 个：影子，无人
    wrap.appendChild(el("div", { class: "shadow13", style: { position: "absolute", right: "6%", bottom: "20%", width: "8%", height: "30%", background: "rgba(40,30,20,.35)", transform: "skewX(-8deg)", filter: "blur(.5px)", borderRadius: "40% 40% 10% 10%" } }));
    // 顶部文字
    wrap.appendChild(el("div", { style: { position: "absolute", top: "8%", left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: "11px", fontFamily: "Microsoft YaHei", textShadow: "1px 1px 2px #000" }, text: "2003 毕业聚会" }));
  }
  return wrap;
}

function appendPeople(wrap, n, bottomRatio) {
  for (let i = 0; i < n; i++) {
    const left = 6 + (i * (88 / Math.max(n - 1, 1)));
    // 身体
    wrap.appendChild(el("div", { style: { position: "absolute", left: left + "%", bottom: (bottomRatio * 100 - 18) + "%", width: "6%", height: "18%", background: "#445", borderRadius: "30% 30% 10% 10%" } }));
    // 头
    wrap.appendChild(el("div", { style: { position: "absolute", left: (left + 1) + "%", bottom: (bottomRatio * 100) + "%", width: "4%", height: "8%", background: "#e8c9a0", borderRadius: "50%" } }));
    // 影子
    wrap.appendChild(el("div", { style: { position: "absolute", left: left + "%", bottom: (bottomRatio * 100 - 20) + "%", width: "8%", height: "4%", background: "rgba(40,30,20,.3)", borderRadius: "50%", filter: "blur(.5px)" } }));
  }
}

function openPhotoViewer(ctx, p) {
  const body = el("div");
  const imgArea = el("div", { class: "photo-viewer-img" });
  imgArea.appendChild(renderScene(p));
  body.appendChild(imgArea);

  // 控制条
  const ctrl = el("div", { style: { textAlign: "center", margin: "8px 0", display: "flex", justifyContent: "center", gap: "8px" } });
  const infoBtn = el("button", { class: "xp-btn", text: "图片信息(EXIF)" });
  ctrl.appendChild(infoBtn);
  body.appendChild(ctrl);

  // 信息区
  const metaArea = el("div");
  body.appendChild(metaArea);

  infoBtn.addEventListener("click", () => {
    ctx.sound.click();
    metaArea.innerHTML = "";
    const meta = el("div", { class: "photo-meta" });
    meta.appendChild(el("div", { html: `<table>
      <tr><td>文件名</td><td>${p.name}</td></tr>
      <tr><td>拍摄时间</td><td>${p.date}</td></tr>
      ${p.modified ? `<tr><td>修改时间</td><td>${p.modified}</td></tr>` : ""}
      <tr><td>相机</td><td>${p.camera}</td></tr>
      <tr><td>所有者</td><td>${p.owner}</td></tr>
      <tr><td>注释</td><td><span style="color:#c00">${p.comment}</span></td></tr>
    </table>` }));
    metaArea.appendChild(meta);

    // PUZZLE_002：查看毕业照片 EXIF
    if (p.id === "graduation" && !GameState.isPuzzleDone("PUZZLE_002")) {
      GameState.completePuzzle("PUZZLE_002");
      Events.emit("EVT_PHOTO_EXIF");
      setTimeout(() => {
        ctx.dialog.show({
          title: "隐藏文件发现", type: "info",
          message: "照片注释异常。",
          detail: `「${p.comment}」\n\n相机所有者：${p.owner}\n\n从照片影子区域提取出隐藏文件：\nshadow_fragment.dat\n（已添加到相册，需密码打开）`,
          buttons: ["查看"],
        }).then(() => ctx.rerender());
      }, 250);
    }
  });

  openXPWindow({
    title: "图片和传真查看器 - " + p.name,
    width: 520,
    body,
  });
}

// PUZZLE_003：打开 shadow_fragment.dat
function openShadowFile(ctx) {
  const body = el("div");
  body.appendChild(el("div", { style: { marginBottom: "8px", color: "#333", fontSize: "12px" }, text: "shadow_fragment.dat 已加密。请输入访问密码。" }));
  const input = el("input", { class: "xp-input", type: "text", placeholder: "password", style: { width: "100%" } });
  body.appendChild(input);
  body.appendChild(el("div", { style: { marginTop: "8px", textAlign: "right" } }, [
    (() => {
      const btn = el("button", { class: "xp-btn primary", text: "解锁" });
      btn.addEventListener("click", async () => {
        ctx.sound.click();
        const val = input.value.trim().toLowerCase();
        if (val === "online") {
          ctx.sound.success();
          GameState.completePuzzle("PUZZLE_003");
          Events.emit("EVT_SHADOW_OPEN");
          ctx.dialog.show({
            title: "解锁成功", type: "info",
            message: "shadow_fragment.dat",
            detail: SHADOW_MESSAGE + "\n\n下载中心已解锁隐藏文件。",
            buttons: ["继续"],
          }).then(() => ctx.rerender());
        } else {
          ctx.sound.error();
          input.value = "";
          body.querySelector(".err")?.remove();
          body.appendChild(el("div", { class: "err", style: { color: "#c00", fontSize: "11px", marginTop: "6px", whiteSpace: "pre-wrap" }, text: "Password Incorrect.\nTry another clue.\n\n提示：照片里隐藏着一句话——他们一直____。" }));
        }
      });
      return btn;
    })(),
  ]));

  openXPWindow({ title: "shadow_fragment.dat - 加密访问", width: 420, body });
}
