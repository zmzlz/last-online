// 网站基础信息
export const SITE = {
  name: "Last Online",
  nameZh: "最后在线",
  since: "Since 2002",
  founded: "2002-12-25",          // 网站上线日期，也是多个谜题密码
  lastUpdate: "2003-09-17",
  url: "http://last-online.cn",
  community: "青藤镇社区",
  admin: "林启明",
  adminId: "Lin Qiming",
  nav: [
    { key: "home", label: "首页", path: "/" },
    { key: "forum", label: "论坛", path: "/forum" },
    { key: "chat", label: "聊天室", path: "/chat" },
    { key: "photo", label: "相册", path: "/photo" },
    { key: "download", label: "下载中心", path: "/download" },
    { key: "guestbook", label: "留言板", path: "/guestbook" },
    { key: "links", label: "友情链接", path: "/links" },
  ],
};

// 首页公告（分阶段变化）
export const ANNOUNCEMENTS = {
  initial: [
    { date: "2003-09-12", title: "服务器维护通知", body: "本周服务器可能出现卡顿，请各位网友见谅。" },
    { date: "2003-09-15", title: "秋季聚会照片已上传", body: "毕业聚会照片已上传至相册，欢迎大家查看。" },
    { date: "2003-09-17", title: "系统公告", body: "由于数据库异常，网站暂停更新。恢复时间待定。" },
  ],
  revealed: [
    { date: "2003-09-17", title: "系统公告", body: "服务器已恢复。正在同步访问者数据……" },
    { date: "2026-07-15", title: "新用户上线", body: "欢迎新成员加入。你一直在我们之中。" },
  ],
  final: [
    { date: "∞", title: "Last Online", body: "Server Running... Waiting For Next Visitor." },
  ],
};

// 友情链接
export const FRIEND_LINKS = [
  { name: "青藤镇中学", url: "http://qingteng-school.cn" },
  { name: "2003届毕业留念", url: "http://grad2003.cn" },
  { name: "网易首页", url: "http://www.163.com" },
  { name: "搜狐", url: "http://www.sohu.com" },
  { name: "Google", url: "http://www.google.com" },
  { name: "『隐藏入口』", url: "/admin", hidden: true },
];

// 留言板初始留言
export const GUESTBOOK = [
  { user: "小雨", time: "2003-09-10 21:14", msg: "终于开学了，这学期要好好学习了。" },
  { user: "阿明", time: "2003-09-11 19:02", msg: "论坛的服务器又卡了，管理员什么时候修一下啊。" },
  { user: "小林", time: "2003-09-13 12:30", msg: "聚会照片拍得真好看，我已经存下来了。" },
  { user: "匿名", time: "2003-09-17 23:30", msg: "在线人数是不是不对？我数了好几遍。" },
  { user: "林启明", time: "2003-09-17 23:31", msg: "只是缓存问题，大家不要紧张。" },
];
