// 用户数据库（管理员后台）
// 001-415 为历史访问者，416 为当前玩家
export function buildUserDatabase(nickname, firstVisit) {
  const historical = [
    { id: 1, user: "林启明", role: "Administrator", firstVisit: "2002-12-25 10:00", status: "ARCHIVED" },
    { id: 2, user: "小林", role: "Moderator", firstVisit: "2002-12-26 08:14", status: "ARCHIVED" },
    { id: 3, user: "阿明", role: "Member", firstVisit: "2002-12-27 19:02", status: "ARCHIVED" },
    { id: 4, user: "小雨", role: "Member", firstVisit: "2002-12-28 21:30", status: "ARCHIVED" },
    { id: 5, user: "张诚", role: "Member", firstVisit: "2002-12-28 22:05", status: "ARCHIVED" },
  ];
  // 6-415 用程序生成占位历史用户
  const pool = ["匿名访客", "游客", "Unknown", "Visitor", "——", "已归档", "lost_user"];
  for (let i = 6; i <= 415; i++) {
    historical.push({
      id: i,
      user: i % 7 === 0 ? "Unknown" : pool[i % pool.length] + " " + i,
      role: "Visitor",
      firstVisit: `20${String(2 + (i % 23)).padStart(2, "0")}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:00`,
      status: "ARCHIVED",
    });
  }
  // 416 玩家本人
  historical.push({
    id: 416,
    user: nickname || "玩家",
    role: "Visitor",
    firstVisit: firstVisit,
    status: "ONLINE",
    me: true,
  });
  return historical;
}
