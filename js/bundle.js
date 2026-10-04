(() => {
  // js/components/dom.js
  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k === "text") e.textContent = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") {
        e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (k === "style" && typeof attrs[k] === "object") {
        Object.assign(e.style, attrs[k]);
      } else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    const kids = Array.isArray(children) ? children : [children];
    kids.forEach((c) => {
      if (c == null) return;
      if (typeof c === "string" || typeof c === "number") e.appendChild(document.createTextNode(String(c)));
      else e.appendChild(c);
    });
    return e;
  }
  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  // js/core/sound.js
  var ctx = null;
  var enabled = true;
  function ac() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        enabled = false;
      }
    }
    return ctx;
  }
  function tone(freq, dur, type = "sine", vol = 0.08, delay = 0) {
    if (!enabled) return;
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  var Sound = {
    resume() {
      const c = ac();
      if (c && c.state === "suspended") c.resume();
    },
    click() {
      tone(420, 0.05, "square", 0.05);
    },
    hover() {
      tone(880, 0.02, "sine", 0.02);
    },
    open() {
      tone(520, 0.06, "sine", 0.06);
      tone(700, 0.08, "sine", 0.05, 0.05);
    },
    close() {
      tone(360, 0.08, "sine", 0.05);
      tone(240, 0.1, "sine", 0.04, 0.04);
    },
    error() {
      tone(220, 0.18, "sawtooth", 0.07);
      tone(180, 0.22, "sawtooth", 0.06, 0.1);
    },
    success() {
      tone(660, 0.08, "sine", 0.06);
      tone(880, 0.1, "sine", 0.06, 0.08);
      tone(1320, 0.14, "sine", 0.05, 0.16);
    },
    type() {
      tone(1200 + Math.random() * 200, 0.015, "square", 0.015);
    },
    loading() {
      tone(300, 0.4, "sine", 0.03);
    },
    boot() {
      tone(440, 0.1, "sine", 0.05);
      tone(660, 0.12, "sine", 0.05, 0.1);
      tone(880, 0.2, "sine", 0.04, 0.2);
    }
  };

  // js/data/site.js
  var SITE = {
    name: "Last Online",
    nameZh: "\u6700\u540E\u5728\u7EBF",
    since: "Since 2002",
    founded: "2002-12-25",
    // 网站上线日期，也是多个谜题密码
    lastUpdate: "2003-09-17",
    url: "http://last-online.cn",
    community: "\u9752\u85E4\u9547\u793E\u533A",
    admin: "\u6797\u542F\u660E",
    adminId: "Lin Qiming",
    nav: [
      { key: "home", label: "\u9996\u9875", path: "/" },
      { key: "forum", label: "\u8BBA\u575B", path: "/forum" },
      { key: "chat", label: "\u804A\u5929\u5BA4", path: "/chat" },
      { key: "photo", label: "\u76F8\u518C", path: "/photo" },
      { key: "download", label: "\u4E0B\u8F7D\u4E2D\u5FC3", path: "/download" },
      { key: "guestbook", label: "\u7559\u8A00\u677F", path: "/guestbook" },
      { key: "links", label: "\u53CB\u60C5\u94FE\u63A5", path: "/links" }
    ]
  };
  var ANNOUNCEMENTS = {
    initial: [
      { date: "2003-09-12", title: "\u670D\u52A1\u5668\u7EF4\u62A4\u901A\u77E5", body: "\u672C\u5468\u670D\u52A1\u5668\u53EF\u80FD\u51FA\u73B0\u5361\u987F\uFF0C\u8BF7\u5404\u4F4D\u7F51\u53CB\u89C1\u8C05\u3002" },
      { date: "2003-09-15", title: "\u79CB\u5B63\u805A\u4F1A\u7167\u7247\u5DF2\u4E0A\u4F20", body: "\u6BD5\u4E1A\u805A\u4F1A\u7167\u7247\u5DF2\u4E0A\u4F20\u81F3\u76F8\u518C\uFF0C\u6B22\u8FCE\u5927\u5BB6\u67E5\u770B\u3002" },
      { date: "2003-09-17", title: "\u7CFB\u7EDF\u516C\u544A", body: "\u7531\u4E8E\u6570\u636E\u5E93\u5F02\u5E38\uFF0C\u7F51\u7AD9\u6682\u505C\u66F4\u65B0\u3002\u6062\u590D\u65F6\u95F4\u5F85\u5B9A\u3002" }
    ],
    revealed: [
      { date: "2003-09-17", title: "\u7CFB\u7EDF\u516C\u544A", body: "\u670D\u52A1\u5668\u5DF2\u6062\u590D\u3002\u6B63\u5728\u540C\u6B65\u8BBF\u95EE\u8005\u6570\u636E\u2026\u2026" },
      { date: "2026-07-15", title: "\u65B0\u7528\u6237\u4E0A\u7EBF", body: "\u6B22\u8FCE\u65B0\u6210\u5458\u52A0\u5165\u3002\u4F60\u4E00\u76F4\u5728\u6211\u4EEC\u4E4B\u4E2D\u3002" }
    ],
    final: [
      { date: "\u221E", title: "Last Online", body: "Server Running... Waiting For Next Visitor." }
    ]
  };
  var FRIEND_LINKS = [
    { name: "\u9752\u85E4\u9547\u4E2D\u5B66", url: "http://qingteng-school.cn" },
    { name: "2003\u5C4A\u6BD5\u4E1A\u7559\u5FF5", url: "http://grad2003.cn" },
    { name: "\u7F51\u6613\u9996\u9875", url: "http://www.163.com" },
    { name: "\u641C\u72D0", url: "http://www.sohu.com" },
    { name: "Google", url: "http://www.google.com" },
    { name: "\u300E\u9690\u85CF\u5165\u53E3\u300F", url: "/admin", hidden: true }
  ];
  var GUESTBOOK = [
    { user: "\u5C0F\u96E8", time: "2003-09-10 21:14", msg: "\u7EC8\u4E8E\u5F00\u5B66\u4E86\uFF0C\u8FD9\u5B66\u671F\u8981\u597D\u597D\u5B66\u4E60\u4E86\u3002" },
    { user: "\u963F\u660E", time: "2003-09-11 19:02", msg: "\u8BBA\u575B\u7684\u670D\u52A1\u5668\u53C8\u5361\u4E86\uFF0C\u7BA1\u7406\u5458\u4EC0\u4E48\u65F6\u5019\u4FEE\u4E00\u4E0B\u554A\u3002" },
    { user: "\u5C0F\u6797", time: "2003-09-13 12:30", msg: "\u805A\u4F1A\u7167\u7247\u62CD\u5F97\u771F\u597D\u770B\uFF0C\u6211\u5DF2\u7ECF\u5B58\u4E0B\u6765\u4E86\u3002" },
    { user: "\u533F\u540D", time: "2003-09-17 23:30", msg: "\u5728\u7EBF\u4EBA\u6570\u662F\u4E0D\u662F\u4E0D\u5BF9\uFF1F\u6211\u6570\u4E86\u597D\u51E0\u904D\u3002" },
    { user: "\u6797\u542F\u660E", time: "2003-09-17 23:31", msg: "\u53EA\u662F\u7F13\u5B58\u95EE\u9898\uFF0C\u5927\u5BB6\u4E0D\u8981\u7D27\u5F20\u3002" }
  ];

  // js/components/ie-browser.js
  function createIEBrowser() {
    const root = el("div", { class: "ie-shell" });
    const title = el("div", { class: "ie-title" }, [
      el("div", { class: "ie-title-text" }, [
        el("span", { class: "ie-favicon" }),
        el("span", { class: "ie-doc-title", text: SITE.name + " - Microsoft Internet Explorer" })
      ]),
      el("div", { class: "ie-controls" }, [
        el("div", { class: "tb-btn", text: "_" }),
        el("div", { class: "tb-btn", text: "\u25A1" }),
        el("div", { class: "tb-btn close", text: "\xD7" })
      ])
    ]);
    const menu = el("div", { class: "ie-menubar" }, [
      "\u6587\u4EF6(F)",
      "\u7F16\u8F91(E)",
      "\u67E5\u770B(V)",
      "\u6536\u85CF(A)",
      "\u5DE5\u5177(T)",
      "\u5E2E\u52A9(H)"
    ].map((t) => el("span", { text: t })));
    const backBtn = el("div", { class: "ie-btn enabled", title: "\u540E\u9000" }, [el("span", { class: "ie-glyph", text: "\u2190" })]);
    const fwdBtn = el("div", { class: "ie-btn", title: "\u524D\u8FDB" }, [el("span", { class: "ie-glyph", text: "\u2192" })]);
    const refreshBtn = el("div", { class: "ie-btn enabled", title: "\u5237\u65B0" }, [el("span", { class: "ie-glyph", text: "\u27F3" })]);
    const homeBtn = el("div", { class: "ie-btn enabled", title: "\u4E3B\u9875" }, [el("span", { class: "ie-glyph", text: "\u2302" })]);
    const addrInput = el("input", { readonly: "readonly" });
    const addr = el("div", { class: "ie-address" }, [
      el("span", { class: "addr-icon ie-favicon" }),
      addrInput
    ]);
    const goBtn = el("button", { class: "xp-btn ie-go", text: "\u8F6C\u5230" });
    const toolbar = el("div", { class: "ie-toolbar" }, [
      backBtn,
      fwdBtn,
      el("div", { class: "ie-sep" }),
      refreshBtn,
      homeBtn,
      el("div", { class: "ie-sep" }),
      el("span", { class: "ie-address-label", text: "\u5730\u5740" }),
      addr,
      goBtn
    ]);
    const loading = el("div", { class: "ie-loading" });
    const content = el("div", { class: "ie-content" });
    const page = el("div", { class: "ie-page" }, [loading, content]);
    const sMsg = el("span", { class: "s-msg", text: "\u5B8C\u6210" });
    const status = el("div", { class: "ie-status" }, [
      sMsg,
      el("span", { class: "s-zone", text: "Internet" }),
      el("span", { class: "s-zone", text: "\u{1F6E1}" })
    ]);
    root.appendChild(title);
    root.appendChild(menu);
    root.appendChild(toolbar);
    root.appendChild(page);
    root.appendChild(status);
    const taskbar = el("div", { class: "xp-taskbar" }, [
      el("div", { class: "xp-start" }, [el("span", { text: "start" })]),
      el("div", { class: "task-tasks" }, [
        el("div", { class: "xp-task-item active" }, [
          el("span", { class: "ie-favicon" }),
          el("span", { text: "Last Online - Microsoft Interne..." })
        ])
      ]),
      el("div", { class: "tray" }, [
        el("span", { class: "xp-clock", id: "xp-clock" })
      ])
    ]);
    function updateClock() {
      const d = /* @__PURE__ */ new Date();
      const t = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
      const clk = taskbar.querySelector("#xp-clock");
      if (clk) clk.textContent = t;
    }
    updateClock();
    setInterval(updateClock, 1e3 * 10);
    let historyStack = [];
    let historyIdx = -1;
    function setLoading(on, msg) {
      if (on) {
        sMsg.textContent = msg || "\u6B63\u5728\u8FDE\u63A5...";
        loading.style.transition = "none";
        loading.style.width = "0";
        void loading.offsetWidth;
        loading.style.transition = "width .6s ease-out";
        loading.style.width = "85%";
        Sound.loading();
      } else {
        loading.style.width = "100%";
        setTimeout(() => {
          loading.style.width = "0";
        }, 250);
        sMsg.textContent = "\u5B8C\u6210";
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
    const frame = el("div", { class: "ie-frame" });
    frame.appendChild(root);
    frame.appendChild(taskbar);
    refreshBtn.addEventListener("click", () => {
      Sound.click();
      window.dispatchEvent(new CustomEvent("lo:refresh"));
    });
    homeBtn.addEventListener("click", () => {
      Sound.click();
      window.dispatchEvent(new CustomEvent("lo:navigate", { detail: "/" }));
    });
    backBtn.addEventListener("click", () => {
      Sound.click();
      window.dispatchEvent(new CustomEvent("lo:back"));
    });
    goBtn.addEventListener("click", () => {
      Sound.click();
      window.dispatchEvent(new CustomEvent("lo:navigate", { detail: addrInput.value.replace(SITE.url, "") || "/" }));
    });
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
        if (historyIdx > 0) {
          historyIdx--;
          return historyStack[historyIdx];
        }
        return null;
      }
    };
  }

  // js/data/puzzles.js
  var PUZZLES = [
    {
      id: "PUZZLE_001",
      chapter: "\u7B2C\u4E00\u9636\u6BB5",
      type: "observation",
      location: "\u8BBA\u575B",
      page: "/forum/post?id=13",
      desc: "\u53D1\u73B0\u7F51\u7AD9\u5B58\u5728\u300E\u7B2C13\u4E2A\u4EBA\u300F",
      answer: null,
      reward: "clue_13th",
      // 获得关键词"第13个人"
      event: "EVT_FORUM_ANOMALY"
    },
    {
      id: "PUZZLE_002",
      chapter: "\u7B2C\u4E8C\u9636\u6BB5",
      type: "observation",
      location: "\u76F8\u518C",
      page: "/photo/graduation",
      desc: "\u53D1\u73B0\u6BD5\u4E1A\u7167\u7247\u9690\u85CF\u4FE1\u606F",
      answer: null,
      reward: "file_shadow",
      // 获得文件 shadow_fragment.dat
      event: "EVT_PHOTO_EXIF"
    },
    {
      id: "PUZZLE_003",
      chapter: "\u7B2C\u4E8C\u9636\u6BB5",
      type: "password",
      location: "\u7167\u7247\u9690\u85CF\u6587\u4EF6",
      desc: "\u6253\u5F00 shadow_fragment.dat",
      answer: "online",
      hint: "\u7167\u7247\u9690\u85CF\u6587\u5B57\uFF1A\u300E\u4ED6\u4EEC\u4E00\u76F4\u5728\u7EBF\u3002\u300F",
      wrongFeedback: "Password Incorrect.\nTry another clue.",
      reward: "shadow_message",
      // 解锁下载中心隐藏文件
      event: "EVT_SHADOW_OPEN"
    },
    {
      id: "PUZZLE_004",
      chapter: "\u7B2C\u4E09\u9636\u6BB5",
      type: "password",
      location: "\u4E0B\u8F7D\u4E2D\u5FC3",
      page: "/download",
      desc: "\u83B7\u53D6\u7F51\u7AD9\u5907\u4EFD forum_backup.zip",
      answer: "20021225",
      hint: "\u5BC6\u7801\u6765\u6E90\uFF1A\u7F51\u7AD9\u6210\u7ACB\u65E5\u671F / \u7BA1\u7406\u5458\u4FE1\u606F / \u9996\u9875\u516C\u544A",
      wrongFeedback: "Access Denied.\nMaybe the answer is somewhere on this website.",
      reward: "backup_extract",
      // 解压获得 chat_log.txt / user.db / readme.txt
      event: "EVT_BACKUP_EXTRACT"
    },
    {
      id: "PUZZLE_005",
      chapter: "\u7B2C\u4E09\u9636\u6BB5",
      type: "timeline",
      location: "chat_log.txt",
      desc: "\u7406\u89E32003-09-17\u53D1\u751F\u7684\u4E8B\uFF0C\u89C2\u5BDF 23:50\u201300:00 \u7684\u8BB0\u5F55",
      answer: null,
      reward: "admin_entry",
      // 获得管理员后台入口线索
      event: "EVT_CHAT_REVIEWED"
    },
    {
      id: "PUZZLE_006",
      chapter: "\u7B2C\u56DB\u9636\u6BB5",
      type: "password",
      location: "admin\u5165\u53E3",
      desc: "\u8FDB\u5165\u7BA1\u7406\u5458\u540E\u53F0",
      answer: "20021225",
      hint: "readme.txt \u9690\u85CF\u6587\u5B57\u300E\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u300F+ \u7BA1\u7406\u5458\u7B2C\u4E00\u6B21\u4E0A\u7EBF\u65E5\u671F",
      wrongFeedback: "Access Denied.\n\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002",
      reward: "admin_panel",
      event: "EVT_ADMIN_OPEN"
    },
    {
      id: "PUZZLE_007",
      chapter: "\u7B2C\u4E94\u9636\u6BB5",
      type: "observation",
      location: "\u7BA1\u7406\u5458\u540E\u53F0",
      desc: "\u67E5\u770B\u7528\u6237\u5217\u8868\uFF0C\u70B9\u51FB 416 \u53F7\u6863\u6848",
      answer: null,
      reward: "found_self",
      event: "EVT_FOUND_SELF"
    },
    {
      id: "PUZZLE_008",
      chapter: "\u7ED3\u5C40",
      type: "trigger",
      location: "\u9996\u9875",
      desc: "\u6700\u7EC8\u786E\u8BA4\uFF1A\u7F51\u7AD9\u6539\u5199",
      answer: null,
      reward: "ending",
      event: "EVT_ENDING"
    }
  ];
  function getPuzzle(id) {
    return PUZZLES.find((p) => p.id === id);
  }
  var SHADOW_MESSAGE = `\u4ED6\u4EEC\u4E00\u76F4\u5728\u7EBF\u3002
\u53EA\u662F\u6CA1\u6709\u4EBA\u770B\u89C1\u3002`;

  // js/core/state.js
  var SAVE_KEY = "last_online_save";
  var defaultState = {
    nickname: "\u8BBF\u5BA2",
    firstVisit: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }),
    startedAt: Date.now(),
    visitedPages: [],
    completedPuzzles: [],
    discoveredClues: [],
    events: [],
    files: [],
    // 玩家已获得/已解锁的文件
    onlineCount: 12,
    sitePhase: 0,
    // 0:初始 1:论坛异常已发现 2:照片已查 3:影子已开 4:备份已解 5:聊天已读 6:后台已开 7:结局
    title: "Last Online",
    welcome: "\u6B22\u8FCE\u6765\u5230\u9752\u85E4\u9547\u793E\u533A",
    endingTriggered: false
  };
  var state = load();
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return Object.assign({}, defaultState, JSON.parse(raw));
    } catch (e) {
    }
    return JSON.parse(JSON.stringify(defaultState));
  }
  var GameState = {
    get() {
      return state;
    },
    reset() {
      const fv = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false });
      state = Object.assign({}, JSON.parse(JSON.stringify(defaultState)), { firstVisit: fv });
      save();
    },
    has(key) {
      return state.discoveredClues.includes(key) || state.files.includes(key);
    },
    visit(page) {
      if (!state.visitedPages.includes(page)) {
        state.visitedPages.push(page);
        save();
      }
    },
    addClue(clue) {
      if (!state.discoveredClues.includes(clue)) {
        state.discoveredClues.push(clue);
        save();
      }
    },
    addFile(file) {
      if (!state.files.includes(file)) {
        state.files.push(file);
        save();
      }
    },
    completePuzzle(id) {
      if (!state.completedPuzzles.includes(id)) {
        state.completedPuzzles.push(id);
        const pz = PUZZLES.find((p) => p.id === id);
        if (pz) {
          if (pz.reward === "clue_13th") this.addClue("\u7B2C13\u4E2A\u4EBA");
          if (pz.reward === "file_shadow") this.addFile("shadow_fragment.dat");
          if (pz.reward === "shadow_message") this.addFile("shadow_message");
          if (pz.reward === "backup_extract") this.addFile("backup");
          if (pz.reward === "admin_entry") this.addClue("admin_entry");
          if (pz.reward === "admin_panel") this.addClue("admin_open");
          if (pz.reward === "found_self") this.addClue("found_self");
          if (pz.reward === "ending") {
            state.endingTriggered = true;
          }
        }
        save();
      }
    },
    isPuzzleDone(id) {
      return state.completedPuzzles.includes(id);
    },
    fireEvent(eventId) {
      if (!state.events.includes(eventId)) {
        state.events.push(eventId);
      }
      applyEvent(eventId);
      save();
    },
    hasEvent(eventId) {
      return state.events.includes(eventId);
    },
    setPhase(phase) {
      if (phase > state.sitePhase) {
        state.sitePhase = phase;
        save();
      }
    },
    setNickname(name) {
      state.nickname = name || "\u8BBF\u5BA2";
      save();
    },
    save() {
      save();
    }
  };
  function applyEvent(eventId) {
    switch (eventId) {
      case "EVT_FORUM_ANOMALY":
        state.setPhase ? null : null;
        if (state.sitePhase < 1) state.sitePhase = 1;
        break;
      case "EVT_PHOTO_EXIF":
        if (state.sitePhase < 2) state.sitePhase = 2;
        break;
      case "EVT_SHADOW_OPEN":
        if (state.sitePhase < 3) state.sitePhase = 3;
        break;
      case "EVT_BACKUP_EXTRACT":
        if (state.sitePhase < 4) state.sitePhase = 4;
        break;
      case "EVT_CHAT_REVIEWED":
        if (state.sitePhase < 5) state.sitePhase = 5;
        break;
      case "EVT_ADMIN_OPEN":
        if (state.sitePhase < 6) state.sitePhase = 6;
        break;
      case "EVT_ENDING":
        state.sitePhase = 7;
        state.onlineCount = 13;
        state.title = "Last Online - Online";
        state.welcome = `\u6B22\u8FCE\u56DE\u6765\uFF0C${state.nickname}`;
        state.endingTriggered = true;
        break;
      default:
        break;
    }
  }
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
    }
  }

  // js/components/dialog.js
  function showDialog({ title = "\u63D0\u793A", type = "info", message, detail = "", buttons = ["\u786E\u5B9A"] }) {
    Sound.open();
    const iconMap = { info: "i", warn: "!", error: "\xD7", question: "?" };
    const clsMap = { info: "info", warn: "warn", error: "error", question: "question" };
    const mask = el("div", { class: "xp-dialog-mask" });
    const dlg = el("div", { class: "xp-dialog" });
    const tb = el("div", { class: "title-bar" }, [
      el("div", { class: "tb-title" }, [el("span", { text: title })]),
      el("div", { class: "tb-controls" })
    ]);
    const body = el("div", { class: "dlg-body" }, [
      el("div", { class: "dlg-icon " + clsMap[type], text: iconMap[type] }),
      el("div", { class: "dlg-content" }, [
        el("b", { text: typeof message === "string" ? message : "" }),
        detail ? el("div", { style: { whiteSpace: "pre-wrap" }, text: detail }) : null
      ])
    ]);
    const actions = el("div", { class: "dlg-actions" });
    let resolveFn;
    const promise = new Promise((r) => resolveFn = r);
    buttons.forEach((b, i) => {
      const btn = el("button", { class: "xp-btn" + (i === 0 ? " primary" : ""), text: b });
      btn.addEventListener("click", () => {
        Sound.click();
        mask.remove();
        resolveFn(i);
      });
      actions.appendChild(btn);
    });
    dlg.appendChild(tb);
    dlg.appendChild(body);
    dlg.appendChild(actions);
    mask.appendChild(dlg);
    document.body.appendChild(mask);
    return promise;
  }
  var alertBox = (message, title = "\u63D0\u793A", type = "info") => showDialog({ title, type, message, buttons: ["\u786E\u5B9A"] });
  var confirmBox = (message, title = "\u786E\u8BA4", type = "question") => showDialog({ title, type, message, buttons: ["\u662F", "\u5426"] });

  // js/pages/boot.js
  function renderBoot(container, onEnter) {
    const screen = el("div", { class: "boot-screen" });
    const box = el("div", { class: "boot-box" });
    box.appendChild(el("h1", { text: "Internet Archive Recovery System" }));
    box.appendChild(el("div", { class: "boot-meta", html: `
    <div><b>Archive ID:</b> LO-017</div>
    <div><b>Target:</b> Unknown Website</div>
    <div><b>Created:</b> 2002</div>
    <div><b>Last Update:</b> 2003-09-17</div>
    <div><b>Recovery Date:</b> ${(/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN")}</div>
  ` }));
    const prompt = el("div", { class: "boot-prompt", text: "\u68C0\u6D4B\u5230\u5F02\u5E38\u7F13\u5B58\u3002\n\u662F\u5426\u7EE7\u7EED\u6062\u590D\uFF1F" });
    const actions = el("div", { class: "boot-actions" }, [
      el("button", { class: "xp-btn primary", text: "YES" }),
      el("button", { class: "xp-btn", text: "NO" })
    ]);
    const log = el("div", { class: "boot-log" });
    box.appendChild(prompt);
    box.appendChild(actions);
    box.appendChild(log);
    screen.appendChild(box);
    container.appendChild(screen);
    const [yesBtn, noBtn] = actions.querySelectorAll("button");
    function appendLog(line) {
      const l = el("div", { class: "line", text: "> " + line });
      log.appendChild(l);
      log.scrollTop = log.scrollHeight;
    }
    async function startRecovery() {
      yesBtn.disabled = true;
      noBtn.disabled = true;
      Sound.boot();
      const steps = [
        "Initializing recovery core...",
        "Mounting archive LO-017...",
        "Reading index table... 416 records found.",
        "WARNING: cache signature mismatch.",
        "Reconstructing HTML fragments...",
        "Restoring stylesheet (Luna/XP)...",
        "Loading forum database...",
        "Loading chat log 2003-09-17...",
        "Anomaly detected: online counter = 13.",
        "Building visitor profile...",
        "Recovery complete. Launching browser."
      ];
      for (const s of steps) {
        appendLog(s);
        Sound.type();
        await new Promise((r) => setTimeout(r, 280 + Math.random() * 220));
      }
      await new Promise((r) => setTimeout(r, 400));
      screen.style.transition = "opacity .5s";
      screen.style.opacity = "0";
      setTimeout(() => {
        screen.remove();
        onEnter();
      }, 500);
    }
    yesBtn.addEventListener("click", async () => {
      Sound.click();
      const state2 = GameState.get();
      if (state2.endingTriggered) {
        const r = await showDialog({
          title: "\u6863\u6848\u5DF2\u6062\u590D",
          type: "question",
          message: "\u68C0\u6D4B\u5230\u5386\u53F2\u8BBF\u95EE\u8BB0\u5F55\u3002",
          detail: "\u4F60\u66FE\u7ECF\u8BBF\u95EE\u8FC7\u8FD9\u4E2A\u7F51\u7AD9\u3002\n\u662F\u5426\u4EE5\u65B0\u8BBF\u5BA2\u8EAB\u4EFD\u91CD\u65B0\u8FDB\u5165\uFF1F",
          buttons: ["\u91CD\u65B0\u8FDB\u5165", "\u7EE7\u7EED\u4E0A\u6B21"]
        });
        if (r === 0) GameState.reset();
      }
      startRecovery();
    });
    noBtn.addEventListener("click", async () => {
      Sound.error();
      await showDialog({
        title: "\u6062\u590D\u8B66\u544A",
        type: "warn",
        message: "\u65E0\u6CD5\u4E2D\u6B62\u6062\u590D\u3002",
        detail: "\u6863\u6848\u5DF2\u88AB\u6253\u5F00\u3002\n\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002",
        buttons: ["\u7EE7\u7EED"]
      });
      startRecovery();
    });
  }

  // js/core/events.js
  var listeners = /* @__PURE__ */ new Map();
  var Events = {
    on(name, fn) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(fn);
    },
    off(name, fn) {
      const arr = listeners.get(name);
      if (arr) {
        const i = arr.indexOf(fn);
        if (i >= 0) arr.splice(i, 1);
      }
    },
    emit(name, payload) {
      if (name.startsWith("EVT_")) {
        GameState.fireEvent(name);
      }
      const arr = listeners.get(name);
      if (arr) arr.forEach((fn) => {
        try {
          fn(payload);
        } catch (e) {
          console.error(e);
        }
      });
    },
    // 检查条件触发
    checkCondition(cond) {
      switch (cond) {
        case "PUZZLE_002_COMPLETE":
          return GameState.isPuzzleDone("PUZZLE_002");
        case "PUZZLE_004_COMPLETE":
          return GameState.isPuzzleDone("PUZZLE_004");
        case "ALL_INVESTIGATED":
          return ["PUZZLE_001", "PUZZLE_002", "PUZZLE_003", "PUZZLE_004", "PUZZLE_005", "PUZZLE_006", "PUZZLE_007"].every((id) => GameState.isPuzzleDone(id));
        default:
          return false;
      }
    }
  };

  // js/components/xp-window.js
  function openXPWindow({ title = "\u7A97\u53E3", icon = "", width = 460, body, onClose, modal = true }) {
    Sound.open();
    const mask = el("div", { class: "xp-dialog-mask" });
    if (!modal) mask.style.background = "transparent";
    const win = el("div", { class: "xp-window", style: { width: width + "px", maxWidth: "92vw", maxHeight: "86vh" } });
    const tb = el("div", { class: "title-bar" });
    const tt = el("div", { class: "tb-title" });
    if (icon) tt.appendChild(el("span", { class: "tb-icon", html: icon }));
    tt.appendChild(el("span", { text: title }));
    const ctrl = el("div", { class: "tb-controls" });
    const btnClose = el("div", { class: "tb-btn close", text: "\xD7", title: "\u5173\u95ED" });
    ctrl.appendChild(btnClose);
    tb.appendChild(tt);
    tb.appendChild(ctrl);
    const winBody = el("div", { class: "win-body", style: { maxHeight: "70vh" } });
    if (typeof body === "string") winBody.innerHTML = body;
    else if (body instanceof Node) winBody.appendChild(body);
    win.appendChild(tb);
    win.appendChild(winBody);
    mask.appendChild(win);
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      Sound.close();
      mask.remove();
      if (onClose) onClose();
    }
    btnClose.addEventListener("click", close);
    tb.addEventListener("dblclick", close);
    mask.addEventListener("mousedown", (e) => {
      if (e.target === mask) close();
    });
    document.body.appendChild(mask);
    return { win, body: winBody, close };
  }
  function floatXPWindow({ title = "\u7A97\u53E3", width = 360, body, parent, onClose, x, y }) {
    Sound.open();
    const win = el("div", { class: "xp-window", style: { position: "absolute", width: width + "px", zIndex: 100, left: (x || 20) + "px", top: (y || 20) + "px" } });
    const tb = el("div", { class: "title-bar", style: { cursor: "move" } });
    const tt = el("div", { class: "tb-title" }, [el("span", { text: title })]);
    const ctrl = el("div", { class: "tb-controls" });
    const btnClose = el("div", { class: "tb-btn close", text: "\xD7" });
    ctrl.appendChild(btnClose);
    tb.appendChild(tt);
    tb.appendChild(ctrl);
    const winBody = el("div", { class: "win-body" });
    if (typeof body === "string") winBody.innerHTML = body;
    else if (body instanceof Node) winBody.appendChild(body);
    win.appendChild(tb);
    win.appendChild(winBody);
    let drag = null;
    tb.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("tb-btn")) return;
      if (!parent) return;
      const rect = win.getBoundingClientRect();
      const prect = parent.getBoundingClientRect();
      drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top, prect };
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!drag) return;
      let nx = e.clientX - drag.dx - drag.prect.left;
      let ny = e.clientY - drag.dy - drag.prect.top;
      nx = Math.max(0, Math.min(nx, drag.prect.width - 80));
      ny = Math.max(0, Math.min(ny, drag.prect.height - 28));
      win.style.left = nx + "px";
      win.style.top = ny + "px";
    });
    document.addEventListener("mouseup", () => drag = null);
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      Sound.close();
      win.remove();
      if (onClose) onClose();
    }
    btnClose.addEventListener("click", close);
    (parent || document.body).appendChild(win);
    return { win, body: winBody, close };
  }

  // js/components/briefing.js
  var PAGES = [
    {
      head: "\u4EFB\u52A1\u80CC\u666F",
      icon: "\u6863\u6848",
      html: `
      <div class="brief-row"><b>\u8EAB\u4EFD\uFF1A</b>\u4E92\u8054\u7F51\u6863\u6848\u6062\u590D\u9879\u76EE \xB7 \u8C03\u67E5\u5458</div>
      <div class="brief-row"><b>\u65E5\u671F\uFF1A</b>2026 \u5E74 7 \u6708 15 \u65E5</div>
      <div class="brief-row"><b>\u6863\u6848\u7F16\u53F7\uFF1A</b>LO-017</div>
      <div class="brief-row"><b>\u76EE\u6807\u7F51\u7AD9\uFF1A</b>Last Online\uFF08\u6700\u540E\u5728\u7EBF\uFF09</div>
      <div class="brief-row"><b>\u7F51\u7AD9\u6027\u8D28\uFF1A</b>2002 \u5E74\u4E0A\u7EBF\u7684\u9752\u85E4\u9547\u793E\u533A\uFF08\u8BBA\u575B / \u804A\u5929\u5BA4 / \u76F8\u518C / \u4E0B\u8F7D\u4E2D\u5FC3\uFF09</div>
      <div class="brief-row"><b>\u6700\u540E\u66F4\u65B0\uFF1A</b>2003 \u5E74 9 \u6708 17 \u65E5</div>
      <div class="brief-sep"></div>
      <div class="brief-para"><b style="color:#c00">\u5F02\u5E38\u60C5\u51B5\uFF1A</b>\u7F51\u7AD9\u505C\u6B62\u66F4\u65B0\u540E\uFF0C12 \u540D\u6D3B\u8DC3\u7528\u6237\u5168\u90E8\u6D88\u5931\u3002\u6CA1\u6709\u65B0\u95FB\uFF0C\u6CA1\u6709\u8B66\u65B9\u8BB0\u5F55\uFF0C\u6CA1\u6709\u5C38\u4F53\u3002\u552F\u4E00\u7559\u4E0B\u7684\uFF0C\u662F\u8FD9\u4E2A\u4ECD\u7136\u5728\u7EBF\u7684\u7F51\u7AD9\u3002</div>
      <div class="brief-para">\u4F60\u7684\u4EFB\u52A1\uFF1A\u6062\u590D\u8BE5\u7F51\u9875\u6863\u6848\uFF0C\u8BC4\u4F30\u5176\u5185\u5BB9\uFF0C\u67E5\u660E 13 \u5E74\u524D\u90A3\u4E2A\u591C\u665A\u7684\u771F\u76F8\u3002</div>
    `
    },
    {
      head: "\u8C03\u67E5\u65B9\u5F0F",
      icon: "\u7EBF\u7D22",
      html: `
      <div class="brief-para">\u8FD9\u4E0D\u662F\u4E00\u4E2A\u6E38\u620F\u754C\u9762\uFF0C\u800C\u662F\u4E00\u4E2A"\u771F\u5B9E\u5B58\u5728\u8FC7"\u7684 2003 \u5E74\u7F51\u7AD9\u3002\u8BF7\u50CF\u8C03\u67E5\u771F\u5B9E\u7F51\u7AD9\u4E00\u6837\u884C\u52A8\u3002</div>
      <div class="brief-para"><b>\u7EBF\u7D22\u85CF\u5728\uFF1A</b></div>
      <div class="brief-list">\u2022 \u8BBA\u575B\u5E16\u5B50\u91CC\u7684\u5F02\u5E38\u56DE\u590D</div>
      <div class="brief-list">\u2022 \u7167\u7247\u7684\u56FE\u7247\u4FE1\u606F\uFF08EXIF\uFF09\u4E0E\u5F71\u5B50\u7EC6\u8282</div>
      <div class="brief-list">\u2022 \u804A\u5929\u8BB0\u5F55\u7684\u65F6\u95F4\u7EBF</div>
      <div class="brief-list">\u2022 \u538B\u7F29\u5305\u3001\u6587\u672C\u6587\u4EF6\u4E2D\u7684\u9690\u85CF\u6587\u5B57</div>
      <div class="brief-list">\u2022 \u7F51\u9875\u91CC\u989C\u8272\u5F02\u5E38\u6216\u53EF\u70B9\u51FB\u7684\u9690\u85CF\u5165\u53E3</div>
      <div class="brief-para"><b>\u89E3\u8C1C\u539F\u5219\uFF1A</b>\u6240\u6709\u5BC6\u7801\u90FD\u6765\u81EA\u7F51\u7AD9\u672C\u8EAB\u7684\u7EC6\u8282\uFF08\u65E5\u671F\u3001\u4EBA\u540D\u3001\u516C\u544A\u7B49\uFF09\uFF0C\u4E0D\u8981\u968F\u673A\u731C\u6D4B\u3002\u9519\u8BEF\u53CD\u9988\u4E0D\u4F1A\u76F4\u63A5\u544A\u8BC9\u4F60\u7B54\u6848\u3002</div>
      <div class="brief-para"><b>\u6CE8\u610F\uFF1A</b>\u7F51\u7AD9\u4F1A"\u8BB0\u4F4F"\u4F60\u7684\u884C\u4E3A\u3002\u968F\u7740\u8C03\u67E5\u6DF1\u5165\uFF0C\u9996\u9875\u5728\u7EBF\u4EBA\u6570\u3001\u516C\u544A\u3001\u6807\u9898\u90FD\u4F1A\u53D1\u751F\u53D8\u5316\u3002</div>
    `
    },
    {
      head: "\u64CD\u4F5C\u4E0E\u76EE\u6807",
      icon: "\u76EE\u6807",
      html: `
      <div class="brief-para"><b>\u64CD\u4F5C\uFF1A</b></div>
      <div class="brief-list">\u2022 \u70B9\u51FB\u9876\u90E8\u5BFC\u822A\u5207\u6362\u9875\u9762</div>
      <div class="brief-list">\u2022 \u70B9\u51FB\u8BBA\u575B\u5E16\u5B50 / \u76F8\u518C\u7167\u7247 / \u4E0B\u8F7D\u6587\u4EF6\u67E5\u770B\u8BE6\u60C5</div>
      <div class="brief-list">\u2022 \u5728\u5BC6\u7801\u6846\u4E2D\u8F93\u5165\u4F60\u627E\u5230\u7684\u7EBF\u7D22</div>
      <div class="brief-list">\u2022 \u7559\u610F\u989C\u8272\u5F02\u5E38\u6216\u53EF\u70B9\u51FB\u7684\u9690\u85CF\u6587\u5B57</div>
      <div class="brief-para"><b>\u76EE\u6807\uFF1A</b></div>
      <div class="brief-list">\u2460 \u67E5\u660E"\u7B2C 13 \u4E2A\u4EBA"\u662F\u8C01</div>
      <div class="brief-list">\u2461 \u5F04\u6E05 2003 \u5E74 9 \u6708 17 \u65E5\u90A3\u4E2A\u591C\u665A\u53D1\u751F\u4E86\u4EC0\u4E48</div>
      <div class="brief-list">\u2462 \u5728\u7BA1\u7406\u5458\u540E\u53F0\uFF0C\u627E\u5230\u5C5E\u4E8E\u4F60\u7684\u90A3\u4EFD\u6863\u6848</div>
      <div class="brief-para"><b>\u5B58\u6863\uFF1A</b>\u8FDB\u5EA6\u81EA\u52A8\u4FDD\u5B58\u5230\u672C\u5730\uFF0C\u53EF\u968F\u65F6\u5173\u95ED\u540E\u7EE7\u7EED\u3002</div>
      <div class="brief-para" style="color:#888;font-size:11px">\u63D0\u793A\uFF1A\u82E5\u5361\u4F4F\uFF0C\u56DE\u5230\u9996\u9875\u516C\u544A\u3001\u4E0B\u8F7D\u4E2D\u5FC3\u7684"\u7F51\u7AD9\u8BF4\u660E"\u3001\u6216\u7167\u7247\u6CE8\u91CA\u91CC\u5BFB\u627E\u7EBF\u7D22\u3002</div>
    `
    }
  ];
  function showBriefing(onDone) {
    Sound.open();
    const mask = el("div", { class: "xp-dialog-mask", style: { zIndex: 9800 } });
    const win = el("div", { class: "xp-window", style: { width: "560px", maxWidth: "94vw" } });
    const tb = el("div", { class: "title-bar" }, [
      el("div", { class: "tb-title" }, [el("span", { text: "\u8C03\u67E5\u5458\u7B80\u62A5 \u2014 \u6863\u6848 LO-017" })]),
      el("div", { class: "tb-controls" })
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
    const prevBtn = el("button", { class: "xp-btn", text: "\u2039 \u4E0A\u4E00\u9875" });
    const nextBtn = el("button", { class: "xp-btn primary", text: "\u4E0B\u4E00\u9875 \u203A" });
    const startBtn = el("button", { class: "xp-btn primary", text: "\u5F00\u59CB\u8C03\u67E5" });
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
        el("span", { text: "\u3010" + p.icon + "\u3011 ", style: { color: "#c00" } }),
        el("span", { text: p.head })
      ]));
      body.appendChild(el("div", { class: "brief-content", html: p.html }));
      pageLabel.textContent = `\u7B2C ${idx + 1} / ${PAGES.length} \u9875`;
      prevBtn.style.visibility = idx === 0 ? "hidden" : "visible";
      nextBtn.style.display = idx === PAGES.length - 1 ? "none" : "inline-block";
      startBtn.style.display = idx === PAGES.length - 1 ? "inline-block" : "none";
    }
    prevBtn.addEventListener("click", () => {
      Sound.click();
      if (idx > 0) {
        idx--;
        render();
      }
    });
    nextBtn.addEventListener("click", () => {
      Sound.click();
      if (idx < PAGES.length - 1) {
        idx++;
        render();
      }
    });
    startBtn.addEventListener("click", () => {
      Sound.click();
      Sound.close();
      mask.remove();
      onDone();
    });
    render();
  }

  // js/components/site-layout.js
  function siteLayout(ctx2, { main, active = "home", side = null, infoExtra = null }) {
    const state2 = GameState.get();
    const site = el("div", { class: "lo-site" });
    const logo = el("div", { class: "lo-logo" }, [
      el("span", { class: "logo-text", text: state2.sitePhase >= 7 ? "Last Online - Online" : SITE.name }),
      el("span", { class: "logo-sub", text: SITE.nameZh }),
      el("span", { class: "logo-since", text: SITE.since }),
      el("span", { class: "logo-banner", text: state2.sitePhase >= 7 ? `\u6B22\u8FCE\u56DE\u6765\uFF0C${state2.nickname}` : "\u6B22\u8FCE\u6765\u5230\u9752\u85E4\u9547\u793E\u533A" })
    ]);
    const nav = el("div", { class: "lo-nav" });
    SITE.nav.forEach((n) => {
      const a = el("a", { href: "#" + n.path, text: n.label });
      if (n.key === active) a.classList.add("cur");
      let locked = false;
      if (n.key === "chat" && !GameState.hasEvent("EVT_BACKUP_EXTRACT")) locked = false;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        Sound.click();
        ctx2.navigate(n.path);
      });
      nav.appendChild(a);
    });
    const cols = el("div", { class: "lo-cols" });
    const sideEl = el("div", { class: "lo-side" });
    if (side) sideEl.appendChild(side);
    else sideEl.appendChild(defaultSide(ctx2));
    const mainEl = el("div", { class: "lo-main" });
    if (typeof main === "string") mainEl.innerHTML = main;
    else if (main instanceof Node) mainEl.appendChild(main);
    const info = el("div", { class: "lo-info" });
    info.appendChild(onlineBox(ctx2));
    if (infoExtra) info.appendChild(infoExtra);
    info.appendChild(announceBox(ctx2));
    cols.appendChild(sideEl);
    cols.appendChild(mainEl);
    cols.appendChild(info);
    const footer = el("div", { class: "lo-footer" }, [
      el("div", { html: `${SITE.name} &copy; 2002-2003 \u9752\u85E4\u9547\u793E\u533A  | \u7BA1\u7406\u5458\uFF1A${SITE.admin} | \u672C\u7AD9\u6700\u540E\u66F4\u65B0\uFF1A${SITE.lastUpdate}` }),
      el("div", { style: { marginTop: "4px" }, html: `Powered by Internet. \u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002` })
    ]);
    site.appendChild(logo);
    site.appendChild(nav);
    site.appendChild(cols);
    site.appendChild(footer);
    return site;
  }
  function defaultSide(ctx2) {
    const box = el("div", { class: "lo-box" });
    box.appendChild(el("div", { class: "box-head", text: "\u5FEB\u901F\u901A\u9053" }));
    const body = el("div", { class: "box-body" });
    [
      { label: "\u203A \u8FDB\u5165\u8BBA\u575B", path: "/forum" },
      { label: "\u203A \u6D4F\u89C8\u76F8\u518C", path: "/photo" },
      { label: "\u203A \u4E0B\u8F7D\u4E2D\u5FC3", path: "/download" },
      { label: "\u203A \u5199\u7559\u8A00", path: "/guestbook" }
    ].forEach((it) => {
      const a = el("a", { href: "#" + it.path, text: it.label, style: { display: "block", padding: "2px 0" } });
      a.addEventListener("click", (e) => {
        e.preventDefault();
        Sound.click();
        ctx2.navigate(it.path);
      });
      body.appendChild(a);
    });
    box.appendChild(body);
    return box;
  }
  function onlineBox(ctx2) {
    const state2 = GameState.get();
    const final = state2.sitePhase >= 7;
    const box = el("div", { class: "lo-box" });
    box.appendChild(el("div", { class: "box-head", text: "\u5F53\u524D\u5728\u7EBF" }));
    const oc = el("div", { class: "online-count" + (final ? " final" : "") });
    oc.appendChild(el("span", { class: "num", text: final ? "13/13" : String(state2.onlineCount) }));
    oc.appendChild(el("div", { text: final ? "\u670D\u52A1\u5668\u8FD0\u884C\u4E2D" : "\u4F4D\u7F51\u53CB\u5728\u7EBF" }));
    if (final) oc.appendChild(el("div", { class: "glitch", text: "Waiting For Next Visitor", style: { fontSize: "11px", marginTop: "4px" } }));
    box.appendChild(oc);
    return box;
  }
  function announceBox(ctx2) {
    const state2 = GameState.get();
    let list;
    if (state2.sitePhase >= 7) list = ANNOUNCEMENTS.final;
    else if (state2.sitePhase >= 1) list = ANNOUNCEMENTS.revealed;
    else list = ANNOUNCEMENTS.initial;
    const box = el("div", { class: "lo-box" });
    box.appendChild(el("div", { class: "box-head", text: "\u7AD9\u5185\u516C\u544A" }));
    const body = el("div", { class: "box-body" });
    list.forEach((a) => {
      body.appendChild(el("div", { style: { borderBottom: "1px dashed #ccc", paddingBottom: "4px", marginBottom: "4px" } }, [
        el("div", { html: `<b style="color:#c00">[${a.date}]</b> ${a.title}` }),
        el("div", { text: a.body, style: { color: "#444", fontSize: "11px" } })
      ]));
    });
    box.appendChild(body);
    return box;
  }

  // js/pages/home.js
  function renderHome(ctx2) {
    const state2 = GameState.get();
    const main = el("div");
    const banner = el("div", { class: "lo-box" });
    banner.appendChild(el("div", { class: "box-head", text: state2.sitePhase >= 7 ? "Last Online - Online" : "\u6B22\u8FCE\u5149\u4E34" }));
    const bb = el("div", { class: "box-body", style: { fontSize: "13px", lineHeight: "1.8" } });
    if (state2.sitePhase >= 7) {
      bb.innerHTML = `\u6B22\u8FCE\u56DE\u6765\uFF0C<b style="color:#c00">${state2.nickname}</b>\u3002<br>
      \u4F60\u5DF2\u7ECF\u6210\u4E3A\u672C\u7AD9\u7B2C <b style="color:#c00">416</b> \u4F4D\u6210\u5458\u3002<br>
      <span class="glitch">\u6570\u636E\u5DF2\u8BB0\u5F55\u3002\u670D\u52A1\u5668\u8FD0\u884C\u4E2D\u3002</span>`;
    } else if (state2.sitePhase >= 1) {
      bb.innerHTML = `\u6B22\u8FCE\u6765\u5230\u9752\u85E4\u9547\u793E\u533A\u3002<br>
      <span style="color:#c00">\u7CFB\u7EDF\u68C0\u6D4B\u5230\u65B0\u8BBF\u5BA2\u3002\u6B63\u5728\u540C\u6B65\u6570\u636E\u2026\u2026</span>`;
    } else {
      bb.innerHTML = `\u6B22\u8FCE\u6765\u5230 <b>\u9752\u85E4\u9547\u793E\u533A</b>\uFF01<br>
      \u8FD9\u91CC\u662F\u6211\u4EEC\u7684\u7F51\u4E0A\u5BB6\u56ED\uFF0C\u8BBA\u575B\u3001\u76F8\u518C\u3001\u804A\u5929\u5BA4\u957F\u671F\u5F00\u653E\u3002<br>
      \u672C\u7AD9\u7531 <b>${SITE.admin}</b> \u521B\u5EFA\u4E8E 2002 \u5E74 12 \u6708 25 \u65E5\u3002`;
    }
    banner.appendChild(bb);
    main.appendChild(banner);
    const intro = el("div", { class: "lo-box" });
    intro.appendChild(el("div", { class: "box-head", text: "\u5173\u4E8E\u672C\u7AD9" }));
    intro.appendChild(el("div", { class: "box-body", html: `
    Last Online \u662F\u9752\u85E4\u9547\u4E2D\u5B66 2003 \u5C4A\u6BD5\u4E1A\u751F\u7684\u7F51\u4E0A\u793E\u533A\u3002<br>
    \u81EA 2002 \u5E74 12 \u6708 25 \u65E5\u4E0A\u7EBF\u4EE5\u6765\uFF0C\u5171\u6709 12 \u4F4D\u6D3B\u8DC3\u6210\u5458\u3002<br>
    \u63D0\u4F9B\u8BBA\u575B\u3001\u804A\u5929\u5BA4\u3001\u76F8\u518C\u3001\u4E0B\u8F7D\u4E2D\u5FC3\u7B49\u670D\u52A1\u3002<br><br>
    <span style="color:#888;font-size:11px">\u7AD9\u957F\uFF1A${SITE.admin} (Lin Qiming) \uFF5C \u6700\u540E\u66F4\u65B0\uFF1A${SITE.lastUpdate}</span>
  ` }));
    main.appendChild(intro);
    const recent = el("div", { class: "lo-box" });
    recent.appendChild(el("div", { class: "box-head", text: "\u6700\u65B0\u8BA8\u8BBA" }));
    const rb = el("div", { class: "box-body" });
    [
      { t: "\u79CB\u5B63\u6444\u5F71\u4F5C\u54C1\u5F81\u96C6", path: "/forum/post?id=2" },
      { t: "\u6BD5\u4E1A\u805A\u4F1A\u7167\u7247\u5DF2\u4E0A\u4F20", path: "/forum/post?id=4" },
      { t: "\u670D\u52A1\u5668\u6700\u8FD1\u603B\u662F\u5361\u987F", path: "/forum/post?id=3" }
    ].forEach((it) => {
      const a = el("a", { href: "#" + it.path, text: "\u203A " + it.t, style: { display: "block", padding: "2px 0" } });
      a.addEventListener("click", (e) => {
        e.preventDefault();
        ctx2.navigate(it.path);
      });
      rb.appendChild(a);
    });
    recent.appendChild(rb);
    main.appendChild(recent);
    if (state2.sitePhase >= 7) {
      const end = el("div", { class: "lo-box" });
      end.appendChild(el("div", { class: "box-head", text: "SYSTEM" }));
      end.appendChild(el("div", { class: "box-body" }, [
        el("div", { class: "glitch", html: `Server Running...<br>Waiting For Next Visitor.<br><br>User 417: pending.` })
      ]));
      main.appendChild(end);
    }
    return siteLayout(ctx2, { main, active: "home" });
  }

  // js/data/posts.js
  var POSTS = [
    {
      id: 1,
      title: "\u6B22\u8FCE\u5927\u5BB6\u6765\u5230\u9752\u85E4\u9547\u793E\u533A",
      author: "\u6797\u542F\u660E",
      authorRole: "\u7BA1\u7406\u5458",
      reg: "2002-12-25",
      replies: 8,
      time: "2002-12-25 10:00",
      online: true,
      body: "\u9752\u85E4\u9547\u793E\u533A\u4ECA\u5929\u6B63\u5F0F\u4E0A\u7EBF\u4E86\uFF01\n\u8FD9\u91CC\u662F\u6211\u4EEC\u7684\u7F51\u4E0A\u5BB6\u56ED\uFF0C\u6B22\u8FCE\u540C\u5B66\u4EEC\u5728\u8FD9\u91CC\u4EA4\u6D41\u5B66\u4E60\u3001\u5206\u4EAB\u751F\u6D3B\u3002\n\u5E0C\u671B\u5927\u5BB6\u5171\u540C\u7EF4\u62A4\u8FD9\u4E2A\u5C5E\u4E8E\u6211\u4EEC\u7684\u5C0F\u5929\u5730\u3002",
      repliesList: [
        { user: "\u5C0F\u96E8", time: "2002-12-25 12:14", body: "\u652F\u6301\uFF01\u7EC8\u4E8E\u6709\u6211\u4EEC\u81EA\u5DF1\u7684\u8BBA\u575B\u4E86\u3002" },
        { user: "\u963F\u660E", time: "2002-12-25 13:02", body: "\u7BA1\u7406\u5458\u8F9B\u82E6\u4E86\uFF0C\u6211\u4F1A\u5E38\u6765\u7684\u3002" }
      ]
    },
    {
      id: 2,
      title: "\u79CB\u5B63\u6444\u5F71\u4F5C\u54C1\u5F81\u96C6",
      author: "\u5C0F\u6797",
      authorRole: "\u7248\u4E3B",
      reg: "2002-12-26",
      replies: 12,
      time: "2003-09-15 09:20",
      online: true,
      body: "\u79CB\u5929\u7684\u9752\u85E4\u9547\u7279\u522B\u7F8E\uFF0C\u6B22\u8FCE\u5927\u5BB6\u628A\u62CD\u5230\u7684\u7167\u7247\u4F20\u5230\u76F8\u518C\u91CC\u3002\n\u672C\u6B21\u6D3B\u52A8\u4E3B\u9898\uFF1A\u300E\u6211\u4EEC\u8EAB\u8FB9\u7684\u5149\u4E0E\u5F71\u300F\u3002\n\u5165\u9009\u4F5C\u54C1\u5C06\u6C38\u4E45\u4FDD\u7559\u5728\u76F8\u518C\u9996\u9875\u3002",
      repliesList: [
        { user: "\u5F20\u8BDA", time: "2003-09-15 10:11", body: "\u6211\u6709\u51E0\u5F20\u6BD5\u4E1A\u805A\u4F1A\u7684\uFF0C\u5F85\u4F1A\u4F20\u4E0A\u53BB\u3002" },
        { user: "\u5C0F\u96E8", time: "2003-09-15 11:40", body: "\u6D3B\u52A8\u597D\uFF0C\u6211\u4E5F\u8981\u53C2\u52A0\u3002" }
      ]
    },
    {
      id: 3,
      title: "\u670D\u52A1\u5668\u6700\u8FD1\u603B\u662F\u5361\u987F",
      author: "\u963F\u660E",
      authorRole: "\u4F1A\u5458",
      reg: "2002-12-27",
      replies: 5,
      time: "2003-09-17 14:05",
      online: true,
      body: "\u8FD9\u4E24\u5929\u7F51\u7AD9\u6253\u5F00\u5F88\u6162\uFF0C\u6709\u65F6\u5019\u5237\u65B0\u534A\u5929\u624D\u51FA\u6765\u3002\n\u7BA1\u7406\u5458\u80FD\u770B\u4E00\u4E0B\u540E\u53F0\u5417\uFF1F\u662F\u4E0D\u662F\u54EA\u91CC\u51FA\u95EE\u9898\u4E86\u3002",
      repliesList: [
        { user: "\u6797\u542F\u660E", time: "2003-09-17 14:20", body: "\u6211\u770B\u4E86\u540E\u53F0\uFF0C\u6570\u636E\u5E93\u6B63\u5E38\u3002\u53EF\u80FD\u662F\u7F13\u5B58\u95EE\u9898\u3002" },
        { user: "\u963F\u660E", time: "2003-09-17 14:25", body: "\u597D\u5427\uFF0C\u90A3\u518D\u89C2\u5BDF\u89C2\u5BDF\u3002" }
      ]
    },
    {
      id: 4,
      title: "\u6BD5\u4E1A\u805A\u4F1A\u7167\u7247\u5DF2\u4E0A\u4F20",
      author: "\u5F20\u8BDA",
      authorRole: "\u4F1A\u5458",
      reg: "2002-12-28",
      replies: 7,
      time: "2003-09-16 22:10",
      online: true,
      body: "\u6BD5\u4E1A\u805A\u4F1A\u7684\u7167\u7247\u6211\u5DF2\u7ECF\u6574\u7406\u597D\u4E0A\u4F20\u5230\u76F8\u518C\u4E86\u3002\n\u5927\u5BB6\u5FEB\u53BB\u770B\u770B\uFF0C\u91CC\u9762\u6709\u6211\u4EEC12\u4E2A\u4EBA\u7684\u5408\u5F71\u3002\n\u65F6\u95F4\u8FC7\u5F97\u771F\u5FEB\u554A\u3002",
      repliesList: [
        { user: "\u5C0F\u6797", time: "2003-09-16 22:30", body: "\u62CD\u5F97\u771F\u597D\uFF01\u4E0D\u8FC7\u603B\u611F\u89C9\u5C11\u4E86\u70B9\u4EC0\u4E48\u3002" },
        { user: "\u5F20\u8BDA", time: "2003-09-16 22:33", body: "\u5C11\u4E86\u4EC0\u4E48\uFF1F" },
        { user: "\u5C0F\u6797", time: "2003-09-16 22:35", body: "\u7B97\u4E86\uFF0C\u53EF\u80FD\u662F\u9519\u89C9\u3002" }
      ]
    },
    // 关键异常帖
    {
      id: 13,
      title: "\u6709\u4EBA\u77E5\u9053\u5F20\u8BDA\u53BB\u54EA\u4E86\u5417\uFF1F",
      author: "\u5C0F\u6797",
      authorRole: "\u7248\u4E3B",
      reg: "2002-12-26",
      replies: 3,
      time: "2003-09-17 23:10",
      online: true,
      anomaly: true,
      body: "\u5F20\u8BDA\u4ECA\u5929\u4E00\u76F4\u6CA1\u51FA\u73B0\uFF0C\u53D1\u6D88\u606F\u4E5F\u4E0D\u56DE\u3002\n\u53EF\u662F\u8BBA\u575B\u663E\u793A\u4ED6\u8FD8\u5728\u7EBF\u3002\n\u6709\u4EBA\u6700\u8FD1\u8054\u7CFB\u8FC7\u4ED6\u5417\uFF1F",
      repliesList: [
        { user: "\u5C0F\u96E8", time: "2003-09-17 23:14", body: "\u8BBA\u575B\u663E\u793A\u4ED6\u8FD8\u5728\u7EBF\uFF0C\u4F46\u4ED6\u4E00\u76F4\u6CA1\u56DE\u6211\u7684\u6D88\u606F\u3002" },
        { user: "\u963F\u660E", time: "2003-09-17 23:18", body: "\u5728\u7EBF\u72B6\u6001\u53EF\u80FD\u662F\u9519\u7684\u5427\uFF0C\u522B\u591A\u60F3\u3002" },
        { user: "\u672A\u77E5\u7528\u6237", time: "2003-09-17 23:22", body: "\u4ED6\u4E0D\u662F\u7B2C\u4E00\u4E2A\u3002", unknown: true }
      ]
    }
  ];
  function getPost(id) {
    return POSTS.find((p) => p.id === Number(id));
  }

  // js/pages/forum.js
  function renderForum(ctx2) {
    const main = el("div");
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u9752\u85E4\u9547\u793E\u533A\u8BBA\u575B" }),
      el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">\u5171 ${POSTS.length} \u4E2A\u4E3B\u9898 \xB7 \u6700\u540E\u66F4\u65B0 2003-09-17</span>` })
    ]));
    const table = el("table", { class: "forum-list" });
    table.appendChild(el("thead", {}, [el("tr", {}, [
      el("th", { class: "col-title", text: "\u4E3B\u9898" }),
      el("th", { class: "col-author", text: "\u4F5C\u8005" }),
      el("th", { class: "col-replies", text: "\u56DE\u590D" }),
      el("th", { class: "col-time", text: "\u53D1\u8868\u65F6\u95F4" })
    ])]));
    const tbody = el("tbody");
    POSTS.forEach((p) => {
      const tr = el("tr");
      const titleCell = el("td", { class: "col-title" });
      if (p.anomaly) titleCell.appendChild(el("span", { class: "tag anomaly", text: "\u5F02\u5E38" }));
      titleCell.appendChild(el("span", { text: " " + p.title, style: { fontWeight: p.anomaly ? "bold" : "normal" } }));
      tr.appendChild(titleCell);
      tr.appendChild(el("td", { class: "col-author", text: p.author }));
      tr.appendChild(el("td", { class: "col-replies", text: String(p.replies) }));
      tr.appendChild(el("td", { class: "col-time", text: p.time }));
      tr.addEventListener("click", () => {
        ctx2.sound.click();
        ctx2.navigate(`/forum/post?id=${p.id}`);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    main.appendChild(table);
    return siteLayout(ctx2, { main, active: "forum" });
  }
  function renderPost(ctx2, id) {
    const post = getPost(id);
    const main = el("div");
    if (!post) {
      main.appendChild(el("div", { style: { padding: "40px", color: "#c00" }, text: "\u5E16\u5B50\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664\u3002" }));
      return siteLayout(ctx2, { main, active: "forum" });
    }
    const wrap = el("div", { class: "post-wrap" });
    wrap.appendChild(el("div", { class: "post-title", text: post.title }));
    wrap.appendChild(renderFloor(ctx2, {
      user: post.author,
      role: post.authorRole,
      reg: post.reg,
      time: post.time,
      body: post.body,
      online: post.online
    }));
    post.repliesList.forEach((r) => {
      wrap.appendChild(renderFloor(ctx2, {
        user: r.user,
        role: r.role || "\u4F1A\u5458",
        reg: r.reg || "2003-01-01",
        time: r.time,
        body: r.body,
        unknown: r.unknown
      }));
    });
    if (post.id === 13 && !GameState.isPuzzleDone("PUZZLE_001")) {
      GameState.completePuzzle("PUZZLE_001");
      Events.emit("EVT_FORUM_ANOMALY");
      setTimeout(() => {
        ctx2.dialog.show({
          title: "\u7EBF\u7D22\u53D1\u73B0",
          type: "info",
          message: "\u4F60\u53D1\u73B0\u4E86\u4E00\u6761\u5F02\u5E38\u56DE\u590D\u3002",
          detail: "\u300C\u4ED6\u4E0D\u662F\u7B2C\u4E00\u4E2A\u3002\u300D\n\n\u5173\u952E\u8BCD\u5DF2\u8BB0\u5F55\uFF1A\u7B2C13\u4E2A\u4EBA\n\n\u8FD4\u56DE\u9996\u9875\u65F6\uFF0C\u7F51\u7AD9\u72B6\u6001\u4F3C\u4E4E\u53D1\u751F\u4E86\u53D8\u5316\u3002",
          buttons: ["\u7EE7\u7EED"]
        }).then(() => ctx2.rerender());
      }, 300);
    }
    main.appendChild(wrap);
    const hint = el("div", { class: "hint-line", text: "\u203A \u8FD4\u56DE\u8BBA\u575B\u5217\u8868" });
    hint.style.cursor = "pointer";
    hint.addEventListener("click", () => ctx2.navigate("/forum"));
    main.appendChild(hint);
    return siteLayout(ctx2, { main, active: "forum" });
  }
  function renderFloor(ctx2, { user, role, reg, time, body, online, unknown }) {
    const row2 = el("div", { class: "post-row" + (unknown ? " unknown" : "") });
    const left = el("div", { class: "post-left" });
    left.appendChild(el("div", { class: "post-avatar", text: user.slice(0, 1) }));
    left.appendChild(el("div", { class: "uname", text: user, style: unknown ? { color: "#c00" } : null }));
    left.appendChild(el("div", { class: "umeta", text: role }));
    left.appendChild(el("div", { class: "umeta", text: "\u6CE8\u518C\uFF1A" + reg }));
    if (online) left.appendChild(el("div", { class: "ustat", text: "\u25CF \u5728\u7EBF" }));
    if (unknown) left.appendChild(el("div", { class: "ustat", text: "\u25CF \u5728\u7EBF", style: { color: "#c00" } }));
    const right = el("div", { class: "post-right" });
    right.appendChild(el("div", { class: "ptime", text: "\u53D1\u8868\u4E8E " + time }));
    const content = el("div", { class: "pcontent" });
    if (unknown) content.classList.add("anomaly");
    content.style.whiteSpace = "pre-wrap";
    content.textContent = body;
    right.appendChild(content);
    if (unknown) {
      right.appendChild(el("div", { class: "signature", html: `<span style="color:#c00">\u2014\u2014 \u4ED6\u4E0D\u662F\u7B2C\u4E00\u4E2A\uFF0C\u4E5F\u4E0D\u4F1A\u662F\u6700\u540E\u4E00\u4E2A\u3002</span>` }));
    }
    row2.appendChild(left);
    row2.appendChild(right);
    return row2;
  }

  // js/data/photos.js
  var PHOTOS = [
    {
      id: "school_2003",
      name: "\u9752\u85E4\u9547\u4E2D\u5B66.jpg",
      date: "2003-03-12",
      desc: "\u6625\u5929\u7684\u6821\u56ED",
      camera: "Canon PowerShot A40",
      owner: "Lin Qiming",
      comment: "\u6211\u4EEC\u7684\u6821\u56ED\u3002",
      width: 480,
      height: 360,
      // 用CSS绘制的老照片场景
      scene: "school",
      hidden: null
    },
    {
      id: "spring_trip",
      name: "\u6625\u6E38\u5408\u5F71.jpg",
      date: "2003-04-20",
      desc: "\u73ED\u7EA7\u6625\u6E38",
      camera: "Canon PowerShot A40",
      owner: "\u5C0F\u6797",
      comment: "\u90A3\u4E00\u5929\u5927\u5BB6\u90FD\u5F88\u5F00\u5FC3\u3002",
      width: 480,
      height: 360,
      scene: "spring",
      hidden: null
    },
    {
      id: "graduation",
      name: "2003\u6BD5\u4E1A\u805A\u4F1A.jpg",
      date: "2003-06-18",
      modified: "2003-09-17",
      desc: "\u6BD5\u4E1A\u805A\u4F1A\u5408\u5F71",
      camera: "Canon PowerShot A40",
      owner: "Lin Qiming",
      comment: "\u6211\u4EEC\u672C\u6765\u670913\u4E2A\u4EBA\u3002",
      width: 480,
      height: 360,
      scene: "graduation",
      hidden: "shadow",
      // 影子区域有第13个影子
      rewardFile: "shadow_fragment.dat"
    }
  ];

  // js/pages/photo.js
  function renderPhoto(ctx2) {
    const main = el("div");
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u793E\u533A\u76F8\u518C" }),
      el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">\u8BB0\u5F55\u9752\u85E4\u9547\u7684\u65F6\u5149</span>` })
    ]));
    const grid = el("div", { class: "photo-grid" });
    PHOTOS.forEach((p) => {
      grid.appendChild(photoThumb(ctx2, p));
    });
    if (GameState.has("shadow_fragment.dat") && !GameState.has("shadow_message")) {
      const dat = el("div", { class: "photo-thumb", style: { borderColor: "#c00" } });
      dat.appendChild(el("div", { class: "ph-img", style: { background: "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#c00", fontFamily: "Consolas", fontSize: "13px" }, text: "shadow_fragment.dat" }));
      dat.appendChild(el("div", { class: "ph-name", text: "shadow_fragment.dat", style: { color: "#c00" } }));
      dat.addEventListener("click", () => openShadowFile(ctx2));
      grid.appendChild(dat);
    }
    if (GameState.has("shadow_message")) {
      main.appendChild(el("div", { class: "lo-box" }, [
        el("div", { class: "box-head", text: "shadow_fragment.dat" }),
        el("div", { class: "box-body", style: { whiteSpace: "pre-wrap", color: "#c00" }, text: SHADOW_MESSAGE })
      ]));
    }
    main.appendChild(grid);
    if (GameState.has("shadow_message") && !GameState.isPuzzleDone("PUZZLE_003")) {
    }
    return siteLayout(ctx2, { main, active: "photo" });
  }
  function photoThumb(ctx2, p) {
    const t = el("div", { class: "photo-thumb" });
    const img = el("div", { class: "ph-img" });
    img.appendChild(renderScene(p));
    t.appendChild(img);
    t.appendChild(el("div", { class: "ph-name", text: p.name }));
    t.addEventListener("click", () => {
      ctx2.sound.click();
      openPhotoViewer(ctx2, p);
    });
    return t;
  }
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
      appendPeople(wrap, 12, 0.55);
      wrap.appendChild(el("div", { class: "shadow13", style: { position: "absolute", right: "6%", bottom: "20%", width: "8%", height: "30%", background: "rgba(40,30,20,.35)", transform: "skewX(-8deg)", filter: "blur(.5px)", borderRadius: "40% 40% 10% 10%" } }));
      wrap.appendChild(el("div", { style: { position: "absolute", top: "8%", left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: "11px", fontFamily: "Microsoft YaHei", textShadow: "1px 1px 2px #000" }, text: "2003 \u6BD5\u4E1A\u805A\u4F1A" }));
    }
    return wrap;
  }
  function appendPeople(wrap, n, bottomRatio) {
    for (let i = 0; i < n; i++) {
      const left = 6 + i * (88 / Math.max(n - 1, 1));
      wrap.appendChild(el("div", { style: { position: "absolute", left: left + "%", bottom: bottomRatio * 100 - 18 + "%", width: "6%", height: "18%", background: "#445", borderRadius: "30% 30% 10% 10%" } }));
      wrap.appendChild(el("div", { style: { position: "absolute", left: left + 1 + "%", bottom: bottomRatio * 100 + "%", width: "4%", height: "8%", background: "#e8c9a0", borderRadius: "50%" } }));
      wrap.appendChild(el("div", { style: { position: "absolute", left: left + "%", bottom: bottomRatio * 100 - 20 + "%", width: "8%", height: "4%", background: "rgba(40,30,20,.3)", borderRadius: "50%", filter: "blur(.5px)" } }));
    }
  }
  function openPhotoViewer(ctx2, p) {
    const body = el("div");
    const imgArea = el("div", { class: "photo-viewer-img" });
    imgArea.appendChild(renderScene(p));
    body.appendChild(imgArea);
    const ctrl = el("div", { style: { textAlign: "center", margin: "8px 0", display: "flex", justifyContent: "center", gap: "8px" } });
    const infoBtn = el("button", { class: "xp-btn", text: "\u56FE\u7247\u4FE1\u606F(EXIF)" });
    ctrl.appendChild(infoBtn);
    body.appendChild(ctrl);
    const metaArea = el("div");
    body.appendChild(metaArea);
    infoBtn.addEventListener("click", () => {
      ctx2.sound.click();
      metaArea.innerHTML = "";
      const meta = el("div", { class: "photo-meta" });
      meta.appendChild(el("div", { html: `<table>
      <tr><td>\u6587\u4EF6\u540D</td><td>${p.name}</td></tr>
      <tr><td>\u62CD\u6444\u65F6\u95F4</td><td>${p.date}</td></tr>
      ${p.modified ? `<tr><td>\u4FEE\u6539\u65F6\u95F4</td><td>${p.modified}</td></tr>` : ""}
      <tr><td>\u76F8\u673A</td><td>${p.camera}</td></tr>
      <tr><td>\u6240\u6709\u8005</td><td>${p.owner}</td></tr>
      <tr><td>\u6CE8\u91CA</td><td><span style="color:#c00">${p.comment}</span></td></tr>
    </table>` }));
      metaArea.appendChild(meta);
      if (p.id === "graduation" && !GameState.isPuzzleDone("PUZZLE_002")) {
        GameState.completePuzzle("PUZZLE_002");
        Events.emit("EVT_PHOTO_EXIF");
        setTimeout(() => {
          ctx2.dialog.show({
            title: "\u9690\u85CF\u6587\u4EF6\u53D1\u73B0",
            type: "info",
            message: "\u7167\u7247\u6CE8\u91CA\u5F02\u5E38\u3002",
            detail: `\u300C${p.comment}\u300D

\u76F8\u673A\u6240\u6709\u8005\uFF1A${p.owner}

\u4ECE\u7167\u7247\u5F71\u5B50\u533A\u57DF\u63D0\u53D6\u51FA\u9690\u85CF\u6587\u4EF6\uFF1A
shadow_fragment.dat
\uFF08\u5DF2\u6DFB\u52A0\u5230\u76F8\u518C\uFF0C\u9700\u5BC6\u7801\u6253\u5F00\uFF09`,
            buttons: ["\u67E5\u770B"]
          }).then(() => ctx2.rerender());
        }, 250);
      }
    });
    openXPWindow({
      title: "\u56FE\u7247\u548C\u4F20\u771F\u67E5\u770B\u5668 - " + p.name,
      width: 520,
      body
    });
  }
  function openShadowFile(ctx2) {
    const body = el("div");
    body.appendChild(el("div", { style: { marginBottom: "8px", color: "#333", fontSize: "12px" }, text: "shadow_fragment.dat \u5DF2\u52A0\u5BC6\u3002\u8BF7\u8F93\u5165\u8BBF\u95EE\u5BC6\u7801\u3002" }));
    const input = el("input", { class: "xp-input", type: "text", placeholder: "password", style: { width: "100%" } });
    body.appendChild(input);
    body.appendChild(el("div", { style: { marginTop: "8px", textAlign: "right" } }, [
      (() => {
        const btn = el("button", { class: "xp-btn primary", text: "\u89E3\u9501" });
        btn.addEventListener("click", async () => {
          ctx2.sound.click();
          const val = input.value.trim().toLowerCase();
          if (val === "online") {
            ctx2.sound.success();
            GameState.completePuzzle("PUZZLE_003");
            Events.emit("EVT_SHADOW_OPEN");
            ctx2.dialog.show({
              title: "\u89E3\u9501\u6210\u529F",
              type: "info",
              message: "shadow_fragment.dat",
              detail: SHADOW_MESSAGE + "\n\n\u4E0B\u8F7D\u4E2D\u5FC3\u5DF2\u89E3\u9501\u9690\u85CF\u6587\u4EF6\u3002",
              buttons: ["\u7EE7\u7EED"]
            }).then(() => ctx2.rerender());
          } else {
            ctx2.sound.error();
            input.value = "";
            body.querySelector(".err")?.remove();
            body.appendChild(el("div", { class: "err", style: { color: "#c00", fontSize: "11px", marginTop: "6px", whiteSpace: "pre-wrap" }, text: "Password Incorrect.\nTry another clue.\n\n\u63D0\u793A\uFF1A\u7167\u7247\u91CC\u9690\u85CF\u7740\u4E00\u53E5\u8BDD\u2014\u2014\u4ED6\u4EEC\u4E00\u76F4____\u3002" }));
          }
        });
        return btn;
      })()
    ]));
    openXPWindow({ title: "shadow_fragment.dat - \u52A0\u5BC6\u8BBF\u95EE", width: 420, body });
  }

  // js/data/chat.js
  var CHAT_LOG = [
    { time: "23:40", user: "\u5C0F\u6797", role: "user", msg: "\u670D\u52A1\u5668\u4ECA\u5929\u4E00\u76F4\u5361\u3002" },
    { time: "23:42", user: "\u963F\u660E", role: "user", msg: "\u6211\u770B\u540E\u53F0\u6CA1\u6709\u95EE\u9898\u3002" },
    { time: "23:45", user: "\u5C0F\u96E8", role: "user", msg: "\u8BBA\u575B\u5728\u7EBF\u4EBA\u6570\u662F\u4E0D\u662F\u9519\u4E86\uFF1F" },
    { time: "23:46", user: "\u6797\u542F\u660E", role: "admin", msg: "\u53EA\u662F\u7F13\u5B58\u95EE\u9898\u3002\u4E0D\u8981\u4E71\u770B\u540E\u53F0\u3002" },
    { time: "23:50", user: "\u5F20\u8BDA", role: "user", msg: "\u6211\u53D1\u73B0\u6570\u636E\u5E93\u91CC\u9762\u591A\u4E86\u4E00\u6761\u7528\u6237\u8BB0\u5F55\u3002" },
    { time: "23:51", user: "\u5C0F\u6797", role: "user", msg: "\u8C01\uFF1F" },
    { time: "23:52", user: "\u5F20\u8BDA", role: "user", msg: "\u4E0D\u77E5\u9053\u3002\u6CA1\u6709\u7528\u6237\u540D\u3002\u4F46\u662F\u72B6\u6001\u663E\u793A\u5728\u7EBF\u3002" },
    { time: "23:54", user: "\u963F\u660E", role: "user", msg: "\u522B\u5F00\u73A9\u7B11\u3002" },
    { time: "23:57", user: "\u7CFB\u7EDF", role: "system", msg: "\u5728\u7EBF\u4EBA\u6570: 12", system: true },
    { time: "23:58", user: "\u5C0F\u96E8", role: "user", msg: "\u7B49\u7B49\u3002\u521A\u624D\u662F\u4E0D\u662F13\u4E2A\u4EBA\uFF1F" },
    { time: "23:59", user: "\u6797\u542F\u660E", role: "admin", msg: "\u5173\u95ED\u7F51\u7AD9\u3002\u73B0\u5728\u3002" },
    { time: "00:00", user: "\u7CFB\u7EDF", role: "system", msg: "\u6240\u6709\u7528\u6237\u79BB\u7EBF\u3002", system: true },
    { time: "00:00", user: "\u672A\u77E5\u7528\u6237", role: "unknown", msg: "\u4ED6\u4E0D\u662F\u7B2C\u4E00\u4E2A\u3002", unknown: true }
  ];
  var CHAT_USERS = [
    { name: "\u6797\u542F\u660E", role: "\u7BA1\u7406\u5458", sys: false },
    { name: "\u5C0F\u6797", role: "\u7248\u4E3B", sys: false },
    { name: "\u963F\u660E", role: "\u4F1A\u5458", sys: false },
    { name: "\u5C0F\u96E8", role: "\u4F1A\u5458", sys: false },
    { name: "\u5F20\u8BDA", role: "\u4F1A\u5458", sys: false },
    { name: "\u7CFB\u7EDF\u6D88\u606F", role: "System", sys: true }
  ];

  // js/pages/chat.js
  function renderChat(ctx2) {
    const main = el("div");
    const unlocked = GameState.hasEvent("EVT_BACKUP_EXTRACT");
    if (!unlocked) {
      main.appendChild(el("div", { class: "lo-box" }, [
        el("div", { class: "box-head", text: "\u804A\u5929\u5BA4" }),
        el("div", { class: "box-body", html: `
        <p style="color:#c00;font-weight:bold">\u26A0 \u804A\u5929\u5BA4\u7EF4\u62A4\u4E2D</p>
        <p style="color:#666;font-size:12px">\u81EA 2003-09-17 \u8D77\u6682\u505C\u670D\u52A1\u3002</p>
        <p style="color:#666;font-size:12px;margin-top:8px">\u5386\u53F2\u8BB0\u5F55\u5DF2\u968F <b>forum_backup.zip</b> \u5907\u4EFD\u3002</p>
        <p style="color:#888;font-size:11px;margin-top:8px">\u63D0\u793A\uFF1A\u524D\u5F80<a href="#/download" id="goto-dl" style="color:#0033cc">\u4E0B\u8F7D\u4E2D\u5FC3</a>\u83B7\u53D6\u5907\u4EFD\u3002</p>
      ` })
      ]));
      main.querySelector("#goto-dl")?.addEventListener("click", (e) => {
        e.preventDefault();
        ctx2.navigate("/download");
      });
      return siteLayout(ctx2, { main, active: "chat" });
    }
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u804A\u5929\u5BA4 \u2014 \u9752\u85E4\u9547\u793E\u533A (\u5386\u53F2\u8BB0\u5F55 2003-09-17)" }),
      el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">\u5F53\u524D\u4E3A\u53EA\u8BFB\u6A21\u5F0F\uFF0C\u65E0\u6CD5\u53D1\u9001\u6D88\u606F\u3002</span>` })
    ]));
    const wrap = el("div", { class: "chat-wrap" });
    wrap.appendChild(el("div", { class: "chat-head", text: "\u9752\u85E4\u9547\u804A\u5929\u5BA4 #1" }));
    const layout = el("div", { class: "chat-layout" });
    const users = el("div", { class: "chat-users" });
    users.appendChild(el("div", { style: { fontWeight: "bold", borderBottom: "1px solid #ccc", marginBottom: "4px" }, text: "\u5728\u7EBF\u7528\u6237" }));
    CHAT_USERS.forEach((u) => {
      users.appendChild(el("div", { class: "cu" + (u.sys ? " sys" : "") }, [
        el("span", { class: "dot" }),
        el("span", { text: u.name, style: { fontSize: "11px" } })
      ]));
    });
    layout.appendChild(users);
    const log = el("div", { class: "chat-log" });
    CHAT_LOG.forEach((l) => {
      const line = el("div", { class: "chat-line" + (l.system ? " system" : "") + (l.unknown ? " unknown" : "") });
      if (l.system) {
        line.appendChild(el("span", { class: "cl-time", text: l.time }));
        line.appendChild(el("span", { class: "cl-user system", text: l.user + "\uFF1A" }));
        line.appendChild(el("span", { class: "cl-msg", text: l.msg }));
      } else if (l.unknown) {
        line.appendChild(el("span", { class: "cl-time", text: l.time }));
        line.appendChild(el("span", { class: "cl-user", style: { color: "#c00" }, text: l.user + "\uFF1A" }));
        line.appendChild(el("span", { class: "cl-msg", style: { color: "#c00", fontStyle: "italic" }, text: l.msg }));
      } else {
        line.appendChild(el("span", { class: "cl-time", text: l.time }));
        line.appendChild(el("span", { class: "cl-user" + (l.role === "admin" ? " admin" : ""), text: l.user + "\uFF1A" }));
        line.appendChild(el("span", { class: "cl-msg", text: l.msg }));
      }
      log.appendChild(line);
    });
    layout.appendChild(log);
    wrap.appendChild(layout);
    const inputArea = el("div", { class: "chat-input" });
    const inp = el("input", { class: "xp-input", disabled: "disabled", value: "\uFF08\u670D\u52A1\u5DF2\u5173\u95ED\uFF0C\u65E0\u6CD5\u53D1\u9001\u6D88\u606F\uFF09" });
    inp.style.color = "#999";
    const send = el("button", { class: "xp-btn", text: "\u53D1\u9001", disabled: "disabled" });
    inputArea.appendChild(inp);
    inputArea.appendChild(send);
    wrap.appendChild(inputArea);
    main.appendChild(wrap);
    if (!GameState.isPuzzleDone("PUZZLE_005")) {
      GameState.completePuzzle("PUZZLE_005");
      Events.emit("EVT_CHAT_REVIEWED");
      setTimeout(() => {
        ctx2.dialog.show({
          title: "\u8C03\u67E5\u8BB0\u5F55",
          type: "info",
          message: "\u4F60\u9605\u8BFB\u4E86\u6700\u540E\u7684\u804A\u5929\u8BB0\u5F55\u3002",
          detail: "2003-09-17 23:50 \u2014 00:00\n\n\u5F20\u8BDA\u53D1\u73B0\u6570\u636E\u5E93\u591A\u4E86\u4E00\u6761\u7528\u6237\u8BB0\u5F55\u3002\n\u7BA1\u7406\u5458\u4E0B\u4EE4\u5173\u95ED\u7F51\u7AD9\u3002\n00:00 \u6240\u6709\u7528\u6237\u79BB\u7EBF\u3002\n\n\u300C\u4ED6\u4E0D\u662F\u7B2C\u4E00\u4E2A\u3002\u300D\n\n\u7BA1\u7406\u5458\u540E\u53F0\u5165\u53E3\u7EBF\u7D22\u5DF2\u83B7\u5F97\u3002",
          buttons: ["\u7EE7\u7EED"]
        }).then(() => ctx2.rerender());
      }, 400);
    }
    return siteLayout(ctx2, { main, active: "chat" });
  }

  // js/data/files.js
  var FILES = [
    {
      id: "qq2003",
      name: "QQ2003.exe",
      size: "4.21 MB",
      time: "2003-08-01",
      downloads: 482,
      type: "exe",
      desc: "\u817E\u8BAFQQ 2003 \u7248\u5BA2\u6237\u7AEF",
      fake: true
      // 纯展示
    },
    {
      id: "photo_pack",
      name: "\u7167\u7247\u6574\u7406.rar",
      size: "12.6 MB",
      time: "2003-09-16",
      downloads: 27,
      type: "rar",
      desc: "\u672C\u6B21\u805A\u4F1A\u5168\u90E8\u7167\u7247\u6253\u5305",
      fake: true
    },
    {
      id: "site_readme",
      name: "\u7F51\u7AD9\u8BF4\u660E.txt",
      size: "1.1 KB",
      time: "2003-01-10",
      downloads: 156,
      type: "txt",
      desc: "\u7F51\u7AD9\u4F7F\u7528\u8BF4\u660E",
      locked: false,
      content: `Last Online \u7F51\u7AD9\u8BF4\u660E
====================
\u521B\u5EFA\u65F6\u95F4: 2002-12-25
\u7BA1\u7406\u5458: \u6797\u542F\u660E (Lin Qiming)

\u672C\u7AD9\u662F\u9752\u85E4\u9547\u793E\u533A\u7684\u7F51\u4E0A\u5BB6\u56ED\u3002
\u8BBA\u575B / \u804A\u5929\u5BA4 / \u76F8\u518C / \u4E0B\u8F7D\u4E2D\u5FC3 \u957F\u671F\u5F00\u653E\u3002

\u5982\u6709\u95EE\u9898\u8BF7\u5728\u7559\u8A00\u677F\u7559\u8A00\uFF0C\u6216\u8054\u7CFB\u7BA1\u7406\u5458\u3002

\u2014\u2014 \u6797\u542F\u660E  2003-01-10`
    },
    {
      id: "forum_backup",
      name: "forum_backup.zip",
      size: "8.4 MB",
      time: "2003-09-17",
      downloads: 3,
      type: "zip",
      desc: "\u8BBA\u575B\u5B8C\u6574\u5907\u4EFD\uFF08\u542B\u6570\u636E\u5E93\uFF09",
      locked: true,
      password: "20021225",
      // 谜题004答案：网站上线日期
      puzzle: "PUZZLE_004",
      // 解压后内容
      extract: ["chat_log.txt", "user.db", "readme.txt"]
    }
  ];
  var BACKUP_README = `Last Online Backup
==================
Created: 2003-09-17
Administrator: Lin Qiming

\u5982\u679C\u670D\u52A1\u5668\u51FA\u73B0\u5F02\u5E38\u3002
\u8BF7\u4E0D\u8981\u5220\u9664\u6570\u636E\u3002
\u6570\u636E\u4F1A\u81EA\u5DF1\u6062\u590D\u3002

.
.
.

\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002`;

  // js/pages/download.js
  var ICON_TEXT = { zip: "ZIP", rar: "RAR", txt: "TXT", jpg: "JPG", exe: "EXE", dat: "DAT", db: "DB" };
  function renderDownload(ctx2) {
    const main = el("div");
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u4E0B\u8F7D\u4E2D\u5FC3" }),
      el("div", { class: "box-body", html: `<span style="color:#666;font-size:12px">\u672C\u7AD9\u8D44\u6E90\uFF0C\u4EC5\u4F9B\u793E\u533A\u6210\u5458\u4E0B\u8F7D\u3002</span>` })
    ]));
    const table = el("table", { class: "dl-list" });
    table.appendChild(el("thead", {}, [el("tr", {}, [
      el("th", { text: "\u6587\u4EF6\u540D" }),
      el("th", { text: "\u5927\u5C0F" }),
      el("th", { text: "\u4E0A\u4F20\u65F6\u95F4" }),
      el("th", { text: "\u4E0B\u8F7D" }),
      el("th", { text: "\u8BF4\u660E" })
    ])]));
    const tbody = el("tbody");
    FILES.forEach((f) => {
      const tr = el("tr");
      const nameTd = el("td");
      nameTd.appendChild(el("span", { class: "dl-icon " + f.type, text: ICON_TEXT[f.type] || "?" }));
      nameTd.appendChild(el("span", { text: " " + f.name, style: { fontWeight: f.locked ? "bold" : "normal" } }));
      if (f.locked && !GameState.isPuzzleDone("PUZZLE_003")) {
        nameTd.appendChild(el("span", { class: "tag anomaly", text: "\u52A0\u5BC6", style: { background: "#888", color: "#fff", fontSize: "10px", marginLeft: "4px", padding: "0 4px" } }));
      } else if (f.locked) {
        nameTd.appendChild(el("span", { class: "tag anomaly", text: "\u9700\u5BC6\u7801", style: { background: "#c00", color: "#fff", fontSize: "10px", marginLeft: "4px", padding: "0 4px" } }));
      }
      tr.appendChild(nameTd);
      tr.appendChild(el("td", { text: f.size }));
      tr.appendChild(el("td", { text: f.time }));
      tr.appendChild(el("td", { text: String(f.downloads) }));
      tr.appendChild(el("td", { text: f.desc, style: { color: "#666", fontSize: "11px" } }));
      tr.addEventListener("click", () => {
        ctx2.sound.click();
        handleFile(ctx2, f);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    main.appendChild(table);
    if (GameState.has("backup")) {
      main.appendChild(el("div", { class: "lo-box" }, [
        el("div", { class: "box-head", text: "\u5DF2\u89E3\u538B\u6587\u4EF6 (forum_backup.zip)" }),
        el("div", { class: "box-body" }, buildExtractList(ctx2))
      ]));
    }
    return siteLayout(ctx2, { main, active: "download" });
  }
  function buildExtractList(ctx2) {
    const box = el("div");
    const items = [
      { name: "chat_log.txt", desc: "\u804A\u5929\u5BA4\u8BB0\u5F55 2003-09-17", action: () => ctx2.navigate("/chat") },
      { name: "readme.txt", desc: "\u5907\u4EFD\u8BF4\u660E\uFF08\u542B\u9690\u85CF\u4FE1\u606F\uFF09", action: () => viewReadme(ctx2) },
      { name: "user.db", desc: "\u7528\u6237\u6570\u636E\u5E93", action: () => viewUserDb(ctx2) }
    ];
    items.forEach((it) => {
      const a = el("a", { href: "javascript:void(0)", text: "\u203A " + it.name, style: { display: "block", padding: "3px 0", color: "#0033cc" } });
      a.appendChild(el("span", { text: "  \u2014 " + it.desc, style: { color: "#888", fontSize: "11px" } }));
      a.addEventListener("click", it.action);
      box.appendChild(a);
    });
    return box;
  }
  function handleFile(ctx2, f) {
    if (f.fake) {
      fakeDownload(ctx2, f);
      return;
    }
    if (f.id === "site_readme") {
      viewText(ctx2, f.name, f.content);
      return;
    }
    if (f.id === "forum_backup") {
      if (!GameState.isPuzzleDone("PUZZLE_003")) {
        ctx2.dialog.show({
          title: "\u8BBF\u95EE\u88AB\u62D2\u7EDD",
          type: "warn",
          message: "\u8BE5\u6587\u4EF6\u9700\u8981\u66F4\u9AD8\u8BBF\u95EE\u6743\u9650\u3002",
          detail: "forum_backup.zip \u5904\u4E8E\u52A0\u5BC6\u4FDD\u62A4\u72B6\u6001\u3002\n\n\u63D0\u793A\uFF1A\u76F8\u518C\u4E2D\u4F3C\u4E4E\u9690\u85CF\u7740\u4EC0\u4E48\u2026\u2026",
          buttons: ["\u77E5\u9053"]
        });
        return;
      }
      promptBackupPassword(ctx2, f);
      return;
    }
  }
  function fakeDownload(ctx2, f) {
    const body = el("div");
    body.appendChild(el("div", { text: "\u6B63\u5728\u4E0B\u8F7D\uFF1A" + f.name, style: { fontSize: "12px", marginBottom: "6px" } }));
    const prog = el("div", { class: "dl-progress" });
    const bar = el("div", { class: "bar" });
    prog.appendChild(bar);
    body.appendChild(prog);
    body.appendChild(el("div", { class: "dl-status", text: "0%", style: { fontSize: "11px", color: "#666", textAlign: "right" } }));
    const win = openXPWindow({ title: "\u6587\u4EF6\u4E0B\u8F7D", width: 380, body });
    let p = 0;
    const t = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        bar.style.width = "100%";
        win.body.querySelector(".dl-status").textContent = "100%";
        setTimeout(() => {
          win.close();
          ctx2.dialog.show({
            title: "\u4E0B\u8F7D\u5B8C\u6210",
            type: "warn",
            message: "\u6587\u4EF6\u65E0\u6CD5\u6253\u5F00\u3002",
            detail: `${f.name}

\u8BE5\u6587\u4EF6\u4E3A 2003 \u5E74\u5B58\u6863\u8D44\u6E90\uFF0C
\u5F53\u524D\u7CFB\u7EDF\u65E0\u6CD5\u8BC6\u522B\u6216\u6587\u4EF6\u5DF2\u635F\u574F\u3002
\uFF08\u8FD9\u662F\u4E92\u8054\u7F51\u9057\u8FF9\u7684\u4E00\u90E8\u5206\u3002\uFF09`,
            buttons: ["\u5173\u95ED"]
          });
        }, 300);
      } else {
        bar.style.width = p + "%";
        win.body.querySelector(".dl-status").textContent = Math.floor(p) + "%";
      }
    }, 180);
  }
  function promptBackupPassword(ctx2, f) {
    const body = el("div");
    body.appendChild(el("div", { style: { fontSize: "12px", marginBottom: "8px", color: "#333" }, text: "forum_backup.zip \u5DF2\u52A0\u5BC6\u3002\u8BF7\u8F93\u5165\u89E3\u538B\u5BC6\u7801\u3002" }));
    body.appendChild(el("div", { style: { fontSize: "11px", color: "#888", marginBottom: "8px" }, text: "\u7EBF\u7D22\uFF1A\u7F51\u7AD9\u6210\u7ACB\u65E5\u671F / \u7BA1\u7406\u5458\u4FE1\u606F / \u9996\u9875\u516C\u544A" }));
    const input = el("input", { class: "xp-input", type: "text", placeholder: "password", style: { width: "100%" } });
    body.appendChild(input);
    const errBox = el("div");
    body.appendChild(errBox);
    const btn = el("button", { class: "xp-btn primary", text: "\u89E3\u538B", style: { marginTop: "8px" } });
    body.appendChild(el("div", { style: { textAlign: "right" } }, [btn]));
    const pwdWin = openXPWindow({ title: "forum_backup.zip - \u89E3\u538B", width: 420, body });
    btn.addEventListener("click", () => {
      ctx2.sound.click();
      const val = input.value.trim();
      if (val === f.password) {
        ctx2.sound.success();
        GameState.completePuzzle("PUZZLE_004");
        Events.emit("EVT_BACKUP_EXTRACT");
        pwdWin.close();
        extractBackup(ctx2, f);
      } else {
        ctx2.sound.error();
        errBox.innerHTML = "";
        errBox.appendChild(el("div", { style: { color: "#c00", fontSize: "11px", marginTop: "6px", whiteSpace: "pre-wrap" }, text: "Access Denied.\nMaybe the answer is somewhere on this website." }));
        input.value = "";
      }
    });
  }
  function extractBackup(ctx2, f) {
    const body = el("div");
    body.appendChild(el("div", { text: "\u6B63\u5728\u89E3\u538B forum_backup.zip ...", style: { fontSize: "12px", marginBottom: "6px" } }));
    const prog = el("div", { class: "dl-progress" });
    const bar = el("div", { class: "bar" });
    prog.appendChild(bar);
    body.appendChild(prog);
    const list = el("div", { class: "dl-extract-list", text: "" });
    body.appendChild(list);
    openXPWindow({ title: "\u89E3\u538B\u5B8C\u6210", width: 420, body });
    let p = 0;
    let idx = 0;
    const t = setInterval(() => {
      p += 14;
      if (p > 100) p = 100;
      bar.style.width = p + "%";
      if (idx < f.extract.length && p > (idx + 1) * 30) {
        list.appendChild(el("div", { text: "\u2713 " + f.extract[idx], style: { color: "#0a8a0a" } }));
        idx++;
      }
      if (p >= 100 && idx >= f.extract.length) {
        clearInterval(t);
        list.appendChild(el("div", { text: "\u2713 \u89E3\u538B\u5B8C\u6210\u3002", style: { color: "#0a8a0a", fontWeight: "bold", marginTop: "4px" } }));
        setTimeout(() => {
          ctx2.dialog.show({
            title: "\u5907\u4EFD\u5DF2\u89E3\u538B",
            type: "info",
            message: "\u83B7\u5F97 3 \u4E2A\u6587\u4EF6\u3002",
            detail: "\u2022 chat_log.txt \u2014 \u804A\u5929\u5BA4\u6700\u540E\u8BB0\u5F55\n\u2022 user.db \u2014 \u7528\u6237\u6570\u636E\u5E93\n\u2022 readme.txt \u2014 \u5907\u4EFD\u8BF4\u660E\n\n\u804A\u5929\u5BA4\u5386\u53F2\u8BB0\u5F55\u5DF2\u6062\u590D\uFF0C\u53EF\u524D\u5F80\u67E5\u770B\u3002",
            buttons: ["\u524D\u5F80\u804A\u5929\u5BA4", "\u7A0D\u540E"]
          }).then((r) => {
            ctx2.rerender();
            if (r === 0) ctx2.navigate("/chat");
          });
        }, 500);
      }
    }, 220);
  }
  function viewText(ctx2, name, content) {
    const fv = el("div", { class: "file-viewer", text: content });
    openXPWindow({ title: "\u8BB0\u4E8B\u672C - " + name, width: 520, body: fv });
  }
  function viewReadme(ctx2) {
    const body = el("div");
    const fv = el("div", { class: "file-viewer" });
    const lines = BACKUP_README.split("\n");
    lines.forEach((line) => {
      if (line.includes("\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E")) {
        const span = el("span", { class: "hidden-msg", text: line, style: { color: "#bbb" } });
        span.style.cursor = "pointer";
        span.title = "\u70B9\u51FB\u67E5\u770B";
        span.addEventListener("click", () => {
          span.classList.add("revealed");
          span.style.color = "#c00";
          span.style.fontStyle = "italic";
          ctx2.sound.click();
        });
        fv.appendChild(span);
      } else {
        fv.appendChild(el("div", { text: line || " " }));
      }
    });
    body.appendChild(fv);
    body.appendChild(el("div", { style: { fontSize: "11px", color: "#888", marginTop: "6px" }, text: "\u63D0\u793A\uFF1A\u67D0\u4E9B\u9690\u85CF\u6587\u5B57\u9700\u70B9\u51FB\u63ED\u793A\u3002\u7ED3\u5408\u7BA1\u7406\u5458\u7B2C\u4E00\u6B21\u4E0A\u7EBF\u65E5\u671F\u53EF\u89E3\u9501\u540E\u53F0\u3002" }));
    openXPWindow({ title: "\u8BB0\u4E8B\u672C - readme.txt", width: 520, body });
  }
  function viewUserDb(ctx2) {
    const body = el("div", { class: "admin-panel", style: { maxHeight: "none" } });
    body.appendChild(el("div", { class: "admin-head", text: "USER.DB \u2014 \u7528\u6237\u6570\u636E\u5E93" }));
    body.appendChild(el("div", { class: "admin-sub", text: "> \u8868 USER_RECORDS  |  \u5171 416 \u6761\u8BB0\u5F55" }));
    const tbl = el("table", { class: "admin-table" });
    tbl.appendChild(el("thead", {}, [el("tr", {}, [
      el("th", { text: "ID" }),
      el("th", { text: "USER" }),
      el("th", { text: "FIRST_VISIT" }),
      el("th", { text: "STATUS" })
    ])]));
    const tb = el("tbody");
    const sample = [
      { id: 1, user: "\u6797\u542F\u660E", fv: "2002-12-25 10:00", st: "ARCHIVED" },
      { id: 2, user: "\u5C0F\u6797", fv: "2002-12-26 08:14", st: "ARCHIVED" },
      { id: 5, user: "\u5F20\u8BDA", fv: "2002-12-28 22:05", st: "ARCHIVED" },
      { id: 415, user: "Unknown 415", fv: "2025-12-31 23:59", st: "ARCHIVED" }
    ];
    sample.forEach((r) => tb.appendChild(row(r)));
    tb.appendChild(row({ id: 416, user: GameState.get().nickname, fv: GameState.get().firstVisit, st: "ONLINE" }, true));
    tbl.appendChild(tb);
    body.appendChild(tbl);
    body.appendChild(el("div", { style: { color: "#0a8a0a", fontSize: "11px", padding: "8px" }, text: "> \u5B8C\u6574\u6570\u636E\u9700\u7BA1\u7406\u5458\u540E\u53F0\u6743\u9650\u67E5\u770B\u3002" }));
    openXPWindow({ title: "user.db", width: 560, body });
  }
  function row(r, me) {
    return el("tr", { class: me ? "me" : "" }, [
      el("td", { text: String(r.id).padStart(3, "0") }),
      el("td", { text: r.user }),
      el("td", { text: r.fv }),
      el("td", { text: r.st, style: { color: r.st === "ONLINE" ? "#0a8a0a" : "#888" } })
    ]);
  }

  // js/data/users.js
  function buildUserDatabase(nickname, firstVisit) {
    const historical = [
      { id: 1, user: "\u6797\u542F\u660E", role: "Administrator", firstVisit: "2002-12-25 10:00", status: "ARCHIVED" },
      { id: 2, user: "\u5C0F\u6797", role: "Moderator", firstVisit: "2002-12-26 08:14", status: "ARCHIVED" },
      { id: 3, user: "\u963F\u660E", role: "Member", firstVisit: "2002-12-27 19:02", status: "ARCHIVED" },
      { id: 4, user: "\u5C0F\u96E8", role: "Member", firstVisit: "2002-12-28 21:30", status: "ARCHIVED" },
      { id: 5, user: "\u5F20\u8BDA", role: "Member", firstVisit: "2002-12-28 22:05", status: "ARCHIVED" }
    ];
    const pool = ["\u533F\u540D\u8BBF\u5BA2", "\u6E38\u5BA2", "Unknown", "Visitor", "\u2014\u2014", "\u5DF2\u5F52\u6863", "lost_user"];
    for (let i = 6; i <= 415; i++) {
      historical.push({
        id: i,
        user: i % 7 === 0 ? "Unknown" : pool[i % pool.length] + " " + i,
        role: "Visitor",
        firstVisit: `20${String(2 + i % 23).padStart(2, "0")}-${String(i % 12 + 1).padStart(2, "0")}-${String(i % 28 + 1).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:00`,
        status: "ARCHIVED"
      });
    }
    historical.push({
      id: 416,
      user: nickname || "\u73A9\u5BB6",
      role: "Visitor",
      firstVisit,
      status: "ONLINE",
      me: true
    });
    return historical;
  }

  // js/pages/admin.js
  function renderAdmin(ctx2) {
    const state2 = GameState.get();
    if (!GameState.isPuzzleDone("PUZZLE_006")) {
      return loginScreen(ctx2, state2);
    }
    return panelScreen(ctx2, state2);
  }
  function loginScreen(ctx2, state2) {
    const wrap = el("div", { class: "admin-panel", style: { minHeight: "420px" } });
    wrap.appendChild(el("div", { class: "admin-head", text: "ADMIN PANEL" }));
    wrap.appendChild(el("div", { class: "admin-sub", text: "> Last Online \u7BA1\u7406\u540E\u53F0  |  \u6388\u6743\u8BBF\u95EE" }));
    const login = el("div", { class: "admin-login" });
    login.appendChild(el("div", { style: { color: "#7fd0ff", marginBottom: "12px", fontFamily: "Tahoma" }, text: "ACCESS CONTROL" }));
    login.appendChild(el("div", { style: { color: "#999", fontSize: "11px", marginBottom: "14px" }, text: "\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u53E3\u4EE4\u3002\u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002" }));
    const input = el("input", { class: "xp-input", type: "password", placeholder: "password", style: { width: "220px", background: "#111", color: "#7fd0ff", border: "1px solid #444" } });
    login.appendChild(input);
    login.appendChild(el("br"));
    const btn = el("button", { class: "xp-btn primary", text: "\u767B\u5F55", style: { marginTop: "10px" } });
    login.appendChild(btn);
    const err = el("div", { style: { color: "#c00", fontSize: "11px", marginTop: "8px", minHeight: "14px" } });
    login.appendChild(err);
    btn.addEventListener("click", () => {
      ctx2.sound.click();
      const val = input.value.trim();
      if (val === "20021225") {
        ctx2.sound.success();
        GameState.completePuzzle("PUZZLE_006");
        Events.emit("EVT_ADMIN_OPEN");
        ctx2.rerender();
      } else {
        ctx2.sound.error();
        err.textContent = "Access Denied. \u8BBF\u5BA2\u4E5F\u662F\u6570\u636E\u3002";
        input.value = "";
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btn.click();
    });
    wrap.appendChild(login);
    return wrap;
  }
  function panelScreen(ctx2, state2) {
    const wrap = el("div", { class: "admin-panel", style: { minHeight: "420px" } });
    wrap.appendChild(el("div", { class: "admin-head", text: "ADMIN PANEL" }));
    wrap.appendChild(el("div", { class: "admin-sub", text: "> USER DATABASE  |  welcome, administrator" }));
    const bar = el("div", { style: { padding: "6px 10px", background: "#1a1a1a", borderBottom: "1px solid #333", fontSize: "11px", color: "#888" } }, [
      el("span", { text: "\u5171 416 \u6761\u8BB0\u5F55  |  \u5728\u7EBF\uFF1A1  |  \u5F52\u6863\uFF1A415" })
    ]);
    wrap.appendChild(bar);
    const tblWrap = el("div", { style: { maxHeight: "320px", overflow: "auto" } });
    const tbl = el("table", { class: "admin-table" });
    tbl.appendChild(el("thead", {}, [el("tr", {}, [
      el("th", { text: "ID" }),
      el("th", { text: "USER" }),
      el("th", { text: "ROLE" }),
      el("th", { text: "FIRST_VISIT" }),
      el("th", { text: "STATUS" })
    ])]));
    const tb = el("tbody");
    const db = buildUserDatabase(state2.nickname, state2.firstVisit);
    db.slice(0, 5).forEach((r) => tb.appendChild(adminRow(r)));
    tb.appendChild(el("tr", {}, [el("td", { colspan: "5", style: { textAlign: "center", color: "#555", padding: "6px" }, text: "... 409 \u6761\u5DF2\u5F52\u6863\u8BB0\u5F55 ..." })]));
    db.slice(-3).forEach((r) => tb.appendChild(adminRow(r)));
    tbl.appendChild(tb);
    tblWrap.appendChild(tbl);
    wrap.appendChild(tblWrap);
    wrap.appendChild(el("div", { style: { padding: "8px 10px", color: "#0a8a0a", fontSize: "11px" }, text: "> \u70B9\u51FB\u4EFB\u4E00\u8BB0\u5F55\u67E5\u770B\u8BE6\u60C5\u3002" }));
    if (GameState.isPuzzleDone("PUZZLE_007")) {
      wrap.appendChild(el("div", { style: { padding: "8px 10px", background: "#2a1010", color: "#ff5a3a", fontSize: "12px" }, text: "> WARNING: \u5F53\u524D\u8BBF\u5BA2\u5DF2\u88AB\u8BB0\u5F55\u4E3A USER 416\u3002Status: ONLINE" }));
      if (!GameState.isPuzzleDone("PUZZLE_008")) {
        const endBtn = el("button", { class: "xp-btn", text: "\u8FD4\u56DE\u9996\u9875", style: { margin: "8px 10px" } });
        endBtn.addEventListener("click", () => {
          ctx2.sound.click();
          GameState.completePuzzle("PUZZLE_008");
          Events.emit("EVT_ENDING");
          ctx2.navigate("/");
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
        el("td", { text: r.status, style: { color: r.status === "ONLINE" ? "#0a8a0a" : "#888" } })
      ]);
      tr.addEventListener("click", () => showDetail(ctx2, r));
      return tr;
    }
    return wrap;
  }
  function showDetail(ctx2, r) {
    ctx2.sound.click();
    const body = el("div", { class: "admin-detail" });
    body.appendChild(el("div", { class: "admin-head", text: "USER RECORD #" + String(r.id).padStart(3, "0") }));
    body.appendChild(el("div", { class: "drow", html: `<b>User:</b> ${r.user}` }));
    body.appendChild(el("div", { class: "drow", html: `<b>Role:</b> ${r.role}` }));
    body.appendChild(el("div", { class: "drow", html: `<b>First Visit:</b> ${r.firstVisit}` }));
    body.appendChild(el("div", { class: "drow", html: `<b>Status:</b> <span class="${r.status === "ONLINE" ? "online" : ""}">${r.status}</span>` }));
    if (r.me) {
      body.appendChild(el("div", { style: { color: "#ff5a3a", marginTop: "10px", fontStyle: "italic" }, text: "> \u8FD9\u4E0D\u662F\u5386\u53F2\u7528\u6237\u3002\u8FD9\u662F\u4F60\u3002" }));
      if (!GameState.isPuzzleDone("PUZZLE_007")) {
        GameState.completePuzzle("PUZZLE_007");
        Events.emit("EVT_FOUND_SELF");
        setTimeout(() => {
          ctx2.dialog.show({
            title: "\u7528\u6237\u6863\u6848",
            type: "warn",
            message: "USER 416",
            detail: `User: ${r.user}
First Visit: ${r.firstVisit}
Status: ONLINE

\u4F60\u6210\u4E3A\u4E86\u7B2C 416 \u4F4D\u8BBF\u95EE\u8005\u3002
\u7F51\u7AD9\u5DF2\u8BB0\u5F55\u4F60\u7684\u5168\u90E8\u884C\u4E3A\u3002

\u8FD4\u56DE\u9996\u9875\uFF0C\u5B8C\u6210\u6700\u540E\u7684\u786E\u8BA4\u3002`,
            buttons: ["\u8FD4\u56DE\u9996\u9875", "\u5173\u95ED"]
          }).then((r2) => {
            ctx2.rerender();
            if (r2 === 0) {
              GameState.completePuzzle("PUZZLE_008");
              Events.emit("EVT_ENDING");
              ctx2.navigate("/");
            }
          });
        }, 300);
      }
    } else if (r.id < 416) {
      body.appendChild(el("div", { style: { color: "#888", marginTop: "10px" }, text: "> \u8BE5\u7528\u6237\u5DF2\u5F52\u6863\u3002ARCHIVED." }));
    }
    openXPWindow({ title: "USER #" + r.id, width: 420, body });
  }

  // js/pages/guestbook.js
  function renderGuestbook(ctx2) {
    const main = el("div");
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u7559\u8A00\u677F" }),
      el("div", { class: "box-body", html: `<p style="color:#666;margin-bottom:8px">\u7559\u4E0B\u4F60\u60F3\u5BF9\u9752\u85E4\u9547\u8BF4\u7684\u8BDD\u3002\uFF08\u4EC5\u672C\u5730\u4FDD\u5B58\uFF09</p>` })
    ]));
    const list = el("div", { class: "guest-list" });
    const stored = loadStored();
    [...GUESTBOOK, ...stored].forEach((g) => {
      list.appendChild(el("div", { class: "guest-item" }, [
        el("div", { class: "gh", html: `${escapeHtml(g.user)} <span class="gt">${escapeHtml(g.time)}</span>` }),
        el("div", { text: g.msg, style: { fontSize: "12px", color: "#333", whiteSpace: "pre-wrap" } })
      ]));
    });
    main.appendChild(list);
    const form = el("div", { class: "guest-form" });
    const nameInput = el("input", { class: "xp-input", placeholder: "\u6635\u79F0", value: GameState.get().nickname });
    const msgInput = el("textarea", { class: "xp-input", placeholder: "\u8BF4\u70B9\u4EC0\u4E48\u2026", rows: 3, style: { width: "100%" } });
    const submit = el("button", { class: "xp-btn primary", text: "\u63D0\u4EA4\u7559\u8A00" });
    form.appendChild(el("div", {}, [el("span", { text: "\u6635\u79F0\uFF1A " }), nameInput]));
    form.appendChild(msgInput);
    form.appendChild(el("div", { style: { textAlign: "right", marginTop: "6px" } }, [submit]));
    main.appendChild(form);
    submit.addEventListener("click", () => {
      ctx2.sound.click();
      const name = nameInput.value.trim() || "\u533F\u540D";
      const msg = msgInput.value.trim();
      if (!msg) {
        ctx2.dialog.alert("\u8BF7\u8F93\u5165\u7559\u8A00\u5185\u5BB9\u3002");
        return;
      }
      const entry = { user: name, time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }), msg };
      const s = loadStored();
      s.push(entry);
      saveStored(s);
      if (Math.random() > 0.3) {
        const s2 = loadStored();
        s2.push({ user: "\u672A\u77E5\u7528\u6237", time: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false }), msg: "\u6211\u4EEC\u4E5F\u6536\u5230\u4E86\u4F60\u7684\u7559\u8A00\u3002" });
        saveStored(s2);
      }
      ctx2.rerender();
    });
    return siteLayout(ctx2, { main, active: "guestbook" });
  }
  var KEY = "last_online_guestbook";
  function loadStored() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveStored(arr) {
    try {
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) {
    }
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  // js/pages/links.js
  function renderLinks(ctx2) {
    const main = el("div");
    main.appendChild(el("div", { class: "lo-box" }, [
      el("div", { class: "box-head", text: "\u53CB\u60C5\u94FE\u63A5" }),
      el("div", { class: "box-body" }, [el("div", { class: "flinks" })])
    ]));
    const fl = main.querySelector(".flinks");
    FRIEND_LINKS.forEach((l) => {
      const a = el("a", { href: "#" + l.url, text: l.name, style: { fontSize: "12px" } });
      if (l.hidden) {
        a.className = "hidden-link";
        a.style.fontSize = "11px";
        a.title = "\xB7";
        a.addEventListener("mouseenter", () => {
          a.style.color = "#c00";
        });
      }
      a.addEventListener("click", (e) => {
        e.preventDefault();
        ctx2.sound.click();
        if (l.url.startsWith("/")) ctx2.navigate(l.url);
        else ctx2.dialog.alert("\u5916\u90E8\u94FE\u63A5\uFF0C\u65E0\u6CD5\u8BBF\u95EE\u3002\n\uFF08\u8FD9\u662F 2003 \u5E74\u7684\u7F51\u9875\u5B58\u6863\uFF09", "\u63D0\u793A", "warn");
      });
      fl.appendChild(a);
    });
    if (GameState.has("admin_entry")) {
      main.appendChild(el("div", { class: "lo-box" }, [
        el("div", { class: "box-head", text: "\u63D0\u793A" }),
        el("div", { class: "box-body", html: `<span style="color:#c00">\u4F60\u53D1\u73B0\u4E86\u4E00\u4E2A\u9690\u85CF\u7684\u7BA1\u7406\u5165\u53E3\u3002\u5B83\u5C31\u85CF\u5728\u53CB\u60C5\u94FE\u63A5\u91CC\u3002</span>` })
      ]));
    }
    return siteLayout(ctx2, { main, active: "links" });
  }

  // js/app.js
  var ie = null;
  var currentPath = "/";
  function start() {
    const app = document.getElementById("app");
    renderBoot(app, () => {
      showBriefing(() => {
        ie = createIEBrowser();
        app.appendChild(ie.frame);
        window.addEventListener("hashchange", handleRoute);
        window.addEventListener("lo:navigate", (e) => navigate(e.detail));
        window.addEventListener("lo:back", () => {
          const p = ie.back();
          if (p) navigate(p, true);
        });
        window.addEventListener("lo:refresh", () => handleRoute());
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
    if (qs) qs.split("&").forEach((kv) => {
      const [k, v] = kv.split("=");
      query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    return { path: path || "/", query };
  }
  function navigate(path, fromBack = false) {
    if (location.hash.slice(1) === path) {
      handleRoute();
      return;
    }
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
      fireEvent: (ev) => Events.emit(ev)
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
    ie.setLoading(true, "\u6B63\u5728\u6253\u5F00\u9875\u9762...");
    Sound.loading();
    setTimeout(() => {
      const ctx2 = buildCtx();
      let node = null, title = SITE.name, addrPath = path;
      try {
        if (path === "/") {
          node = renderHome(ctx2);
          title = SITE.name;
        } else if (path === "/forum") {
          node = renderForum(ctx2);
          title = "\u8BBA\u575B";
        } else if (path === "/forum/post") {
          node = renderPost(ctx2, query.id);
          title = "\u5E16\u5B50";
          addrPath = `/forum/post?id=${query.id || ""}`;
        } else if (path === "/photo") {
          node = renderPhoto(ctx2);
          title = "\u76F8\u518C";
        } else if (path === "/chat") {
          node = renderChat(ctx2);
          title = "\u804A\u5929\u5BA4";
        } else if (path === "/download") {
          node = renderDownload(ctx2);
          title = "\u4E0B\u8F7D\u4E2D\u5FC3";
        } else if (path === "/admin") {
          node = renderAdmin(ctx2);
          title = "ADMIN PANEL";
        } else if (path === "/guestbook") {
          node = renderGuestbook(ctx2);
          title = "\u7559\u8A00\u677F";
        } else if (path === "/links") {
          node = renderLinks(ctx2);
          title = "\u53CB\u60C5\u94FE\u63A5";
        } else {
          node = render404(ctx2, path);
          title = "\u65E0\u6CD5\u663E\u793A\u7F51\u9875";
        }
      } catch (e) {
        console.error(e);
        node = document.createElement("div");
        node.innerHTML = `<div style="padding:40px;color:#c00">\u9875\u9762\u52A0\u8F7D\u9519\u8BEF: ${e.message}</div>`;
      }
      ie.renderPage(node, title, addrPath);
      ie.pushHistory(addrPath);
      ie.setLoading(false);
      ie.content.scrollTop = 0;
    }, 420);
  }
  function render404(ctx2, path) {
    const d = document.createElement("div");
    d.style.cssText = "padding:40px;font-family:Tahoma;font-size:13px;color:#333;background:#fff;min-height:400px;";
    d.innerHTML = `
    <h2 style="color:#c00">\u65E0\u6CD5\u663E\u793A\u7F51\u9875</h2>
    <p>\u60A8\u6B63\u5728\u67E5\u627E\u7684\u9875\u53EF\u80FD\u5DF2\u7ECF\u5220\u9664\u3001\u66F4\u540D\u6216\u6682\u65F6\u4E0D\u53EF\u7528\u3002</p>
    <p style="color:#888">\u5730\u5740: ${SITE.url}${path}</p>
    <p style="margin-top:20px"><a href="#/">\u8FD4\u56DE\u9996\u9875</a></p>
  `;
    return d;
  }
  start();
})();
