// 论坛帖子数据
export const POSTS = [
  {
    id: 1,
    title: "欢迎大家来到青藤镇社区",
    author: "林启明",
    authorRole: "管理员",
    reg: "2002-12-25",
    replies: 8,
    time: "2002-12-25 10:00",
    online: true,
    body: "青藤镇社区今天正式上线了！\n这里是我们的网上家园，欢迎同学们在这里交流学习、分享生活。\n希望大家共同维护这个属于我们的小天地。",
    repliesList: [
      { user: "小雨", time: "2002-12-25 12:14", body: "支持！终于有我们自己的论坛了。" },
      { user: "阿明", time: "2002-12-25 13:02", body: "管理员辛苦了，我会常来的。" },
    ],
  },
  {
    id: 2,
    title: "秋季摄影作品征集",
    author: "小林",
    authorRole: "版主",
    reg: "2002-12-26",
    replies: 12,
    time: "2003-09-15 09:20",
    online: true,
    body: "秋天的青藤镇特别美，欢迎大家把拍到的照片传到相册里。\n本次活动主题：『我们身边的光与影』。\n入选作品将永久保留在相册首页。",
    repliesList: [
      { user: "张诚", time: "2003-09-15 10:11", body: "我有几张毕业聚会的，待会传上去。" },
      { user: "小雨", time: "2003-09-15 11:40", body: "活动好，我也要参加。" },
    ],
  },
  {
    id: 3,
    title: "服务器最近总是卡顿",
    author: "阿明",
    authorRole: "会员",
    reg: "2002-12-27",
    replies: 5,
    time: "2003-09-17 14:05",
    online: true,
    body: "这两天网站打开很慢，有时候刷新半天才出来。\n管理员能看一下后台吗？是不是哪里出问题了。",
    repliesList: [
      { user: "林启明", time: "2003-09-17 14:20", body: "我看了后台，数据库正常。可能是缓存问题。" },
      { user: "阿明", time: "2003-09-17 14:25", body: "好吧，那再观察观察。" },
    ],
  },
  {
    id: 4,
    title: "毕业聚会照片已上传",
    author: "张诚",
    authorRole: "会员",
    reg: "2002-12-28",
    replies: 7,
    time: "2003-09-16 22:10",
    online: true,
    body: "毕业聚会的照片我已经整理好上传到相册了。\n大家快去看看，里面有我们12个人的合影。\n时间过得真快啊。",
    repliesList: [
      { user: "小林", time: "2003-09-16 22:30", body: "拍得真好！不过总感觉少了点什么。" },
      { user: "张诚", time: "2003-09-16 22:33", body: "少了什么？" },
      { user: "小林", time: "2003-09-16 22:35", body: "算了，可能是错觉。" },
    ],
  },
  // 关键异常帖
  {
    id: 13,
    title: "有人知道张诚去哪了吗？",
    author: "小林",
    authorRole: "版主",
    reg: "2002-12-26",
    replies: 3,
    time: "2003-09-17 23:10",
    online: true,
    anomaly: true,
    body: "张诚今天一直没出现，发消息也不回。\n可是论坛显示他还在线。\n有人最近联系过他吗？",
    repliesList: [
      { user: "小雨", time: "2003-09-17 23:14", body: "论坛显示他还在线，但他一直没回我的消息。" },
      { user: "阿明", time: "2003-09-17 23:18", body: "在线状态可能是错的吧，别多想。" },
      { user: "未知用户", time: "2003-09-17 23:22", body: "他不是第一个。", unknown: true },
    ],
  },
];

export function getPost(id) {
  return POSTS.find(p => p.id === Number(id));
}
