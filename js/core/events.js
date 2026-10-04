// 事件管理器 (Event Manager)
// 管理网站动态变化 & 谜题触发
import { GameState } from "./state.js";

const listeners = new Map();

export const Events = {
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
    // 触发网站事件
    if (name.startsWith("EVT_")) {
      GameState.fireEvent(name);
    }
    const arr = listeners.get(name);
    if (arr) arr.forEach(fn => { try { fn(payload); } catch (e) { console.error(e); } });
  },

  // 检查条件触发
  checkCondition(cond) {
    switch (cond) {
      case "PUZZLE_002_COMPLETE": return GameState.isPuzzleDone("PUZZLE_002");
      case "PUZZLE_004_COMPLETE": return GameState.isPuzzleDone("PUZZLE_004");
      case "ALL_INVESTIGATED":
        return ["PUZZLE_001","PUZZLE_002","PUZZLE_003","PUZZLE_004","PUZZLE_005","PUZZLE_006","PUZZLE_007"]
          .every(id => GameState.isPuzzleDone(id));
      default: return false;
    }
  },
};
