// 2003-09-17 最后一天聊天记录
export const CHAT_LOG = [
  { time: "23:40", user: "小林", role: "user", msg: "服务器今天一直卡。" },
  { time: "23:42", user: "阿明", role: "user", msg: "我看后台没有问题。" },
  { time: "23:45", user: "小雨", role: "user", msg: "论坛在线人数是不是错了？" },
  { time: "23:46", user: "林启明", role: "admin", msg: "只是缓存问题。不要乱看后台。" },
  { time: "23:50", user: "张诚", role: "user", msg: "我发现数据库里面多了一条用户记录。" },
  { time: "23:51", user: "小林", role: "user", msg: "谁？" },
  { time: "23:52", user: "张诚", role: "user", msg: "不知道。没有用户名。但是状态显示在线。" },
  { time: "23:54", user: "阿明", role: "user", msg: "别开玩笑。" },
  { time: "23:57", user: "系统", role: "system", msg: "在线人数: 12", system: true },
  { time: "23:58", user: "小雨", role: "user", msg: "等等。刚才是不是13个人？" },
  { time: "23:59", user: "林启明", role: "admin", msg: "关闭网站。现在。" },
  { time: "00:00", user: "系统", role: "system", msg: "所有用户离线。", system: true },
  { time: "00:00", user: "未知用户", role: "unknown", msg: "他不是第一个。", unknown: true },
];

// 聊天室在线用户列表
export const CHAT_USERS = [
  { name: "林启明", role: "管理员", sys: false },
  { name: "小林", role: "版主", sys: false },
  { name: "阿明", role: "会员", sys: false },
  { name: "小雨", role: "会员", sys: false },
  { name: "张诚", role: "会员", sys: false },
  { name: "系统消息", role: "System", sys: true },
];
