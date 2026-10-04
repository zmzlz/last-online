// 谜题定义
// type: observation / password / timeline / hidden_click / file_unlock
export const PUZZLES = [
  {
    id: "PUZZLE_001",
    chapter: "第一阶段",
    type: "observation",
    location: "论坛",
    page: "/forum/post?id=13",
    desc: "发现网站存在『第13个人』",
    answer: null,
    reward: "clue_13th",       // 获得关键词"第13个人"
    event: "EVT_FORUM_ANOMALY",
  },
  {
    id: "PUZZLE_002",
    chapter: "第二阶段",
    type: "observation",
    location: "相册",
    page: "/photo/graduation",
    desc: "发现毕业照片隐藏信息",
    answer: null,
    reward: "file_shadow",     // 获得文件 shadow_fragment.dat
    event: "EVT_PHOTO_EXIF",
  },
  {
    id: "PUZZLE_003",
    chapter: "第二阶段",
    type: "password",
    location: "照片隐藏文件",
    desc: "打开 shadow_fragment.dat",
    answer: "online",
    hint: "照片隐藏文字：『他们一直在线。』",
    wrongFeedback: "Password Incorrect.\nTry another clue.",
    reward: "shadow_message",  // 解锁下载中心隐藏文件
    event: "EVT_SHADOW_OPEN",
  },
  {
    id: "PUZZLE_004",
    chapter: "第三阶段",
    type: "password",
    location: "下载中心",
    page: "/download",
    desc: "获取网站备份 forum_backup.zip",
    answer: "20021225",
    hint: "密码来源：网站成立日期 / 管理员信息 / 首页公告",
    wrongFeedback: "Access Denied.\nMaybe the answer is somewhere on this website.",
    reward: "backup_extract",  // 解压获得 chat_log.txt / user.db / readme.txt
    event: "EVT_BACKUP_EXTRACT",
  },
  {
    id: "PUZZLE_005",
    chapter: "第三阶段",
    type: "timeline",
    location: "chat_log.txt",
    desc: "理解2003-09-17发生的事，观察 23:50–00:00 的记录",
    answer: null,
    reward: "admin_entry",     // 获得管理员后台入口线索
    event: "EVT_CHAT_REVIEWED",
  },
  {
    id: "PUZZLE_006",
    chapter: "第四阶段",
    type: "password",
    location: "admin入口",
    desc: "进入管理员后台",
    answer: "20021225",
    hint: "readme.txt 隐藏文字『访客也是数据』+ 管理员第一次上线日期",
    wrongFeedback: "Access Denied.\n访客也是数据。",
    reward: "admin_panel",
    event: "EVT_ADMIN_OPEN",
  },
  {
    id: "PUZZLE_007",
    chapter: "第五阶段",
    type: "observation",
    location: "管理员后台",
    desc: "查看用户列表，点击 416 号档案",
    answer: null,
    reward: "found_self",
    event: "EVT_FOUND_SELF",
  },
  {
    id: "PUZZLE_008",
    chapter: "结局",
    type: "trigger",
    location: "首页",
    desc: "最终确认：网站改写",
    answer: null,
    reward: "ending",
    event: "EVT_ENDING",
  },
];

export function getPuzzle(id) {
  return PUZZLES.find(p => p.id === id);
}

// 阴影文件解锁后显示的文字
export const SHADOW_MESSAGE = `他们一直在线。
只是没有人看见。`;
