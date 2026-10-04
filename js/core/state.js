// 全局游戏状态 (GameState)
// 记录已访问页面 / 已完成谜题 / 已发现线索 / 网站变化阶段
import { PUZZLES } from "../data/puzzles.js";

const SAVE_KEY = "last_online_save";

const defaultState = {
  nickname: "访客",
  firstVisit: new Date().toLocaleString("zh-CN", { hour12: false }),
  startedAt: Date.now(),
  visitedPages: [],
  completedPuzzles: [],
  discoveredClues: [],
  events: [],
  files: [],            // 玩家已获得/已解锁的文件
  onlineCount: 12,
  sitePhase: 0,         // 0:初始 1:论坛异常已发现 2:照片已查 3:影子已开 4:备份已解 5:聊天已读 6:后台已开 7:结局
  title: "Last Online",
  welcome: "欢迎来到青藤镇社区",
  endingTriggered: false,
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return Object.assign({}, defaultState, JSON.parse(raw));
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultState));
}

export const GameState = {
  get() { return state; },

  reset() {
    const fv = new Date().toLocaleString("zh-CN", { hour12: false });
    state = Object.assign({}, JSON.parse(JSON.stringify(defaultState)), { firstVisit: fv });
    save();
  },

  has(key) { return state.discoveredClues.includes(key) || state.files.includes(key); },

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
      const pz = PUZZLES.find(p => p.id === id);
      if (pz) {
        if (pz.reward === "clue_13th") this.addClue("第13个人");
        if (pz.reward === "file_shadow") this.addFile("shadow_fragment.dat");
        if (pz.reward === "shadow_message") this.addFile("shadow_message");
        if (pz.reward === "backup_extract") this.addFile("backup");
        if (pz.reward === "admin_entry") this.addClue("admin_entry");
        if (pz.reward === "admin_panel") this.addClue("admin_open");
        if (pz.reward === "found_self") this.addClue("found_self");
        if (pz.reward === "ending") { state.endingTriggered = true; }
      }
      save();
    }
  },

  isPuzzleDone(id) { return state.completedPuzzles.includes(id); },

  fireEvent(eventId) {
    if (!state.events.includes(eventId)) {
      state.events.push(eventId);
    }
    applyEvent(eventId);
    save();
  },

  hasEvent(eventId) { return state.events.includes(eventId); },

  setPhase(phase) {
    if (phase > state.sitePhase) {
      state.sitePhase = phase;
      save();
    }
  },

  setNickname(name) {
    state.nickname = name || "访客";
    save();
  },

  save() { save(); },
};

// 事件对状态的影响
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
      state.welcome = `欢迎回来，${state.nickname}`;
      state.endingTriggered = true;
      break;
    default:
      break;
  }
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}
