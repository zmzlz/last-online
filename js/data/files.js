// 下载中心文件 & 文件内容
export const FILES = [
  {
    id: "qq2003",
    name: "QQ2003.exe",
    size: "4.21 MB",
    time: "2003-08-01",
    downloads: 482,
    type: "exe",
    desc: "腾讯QQ 2003 版客户端",
    fake: true, // 纯展示
  },
  {
    id: "photo_pack",
    name: "照片整理.rar",
    size: "12.6 MB",
    time: "2003-09-16",
    downloads: 27,
    type: "rar",
    desc: "本次聚会全部照片打包",
    fake: true,
  },
  {
    id: "site_readme",
    name: "网站说明.txt",
    size: "1.1 KB",
    time: "2003-01-10",
    downloads: 156,
    type: "txt",
    desc: "网站使用说明",
    locked: false,
    content: `Last Online 网站说明
====================
创建时间: 2002-12-25
管理员: 林启明 (Lin Qiming)

本站是青藤镇社区的网上家园。
论坛 / 聊天室 / 相册 / 下载中心 长期开放。

如有问题请在留言板留言，或联系管理员。

—— 林启明  2003-01-10`,
  },
  {
    id: "forum_backup",
    name: "forum_backup.zip",
    size: "8.4 MB",
    time: "2003-09-17",
    downloads: 3,
    type: "zip",
    desc: "论坛完整备份（含数据库）",
    locked: true,
    password: "20021225",          // 谜题004答案：网站上线日期
    puzzle: "PUZZLE_004",
    // 解压后内容
    extract: ["chat_log.txt", "user.db", "readme.txt"],
  },
];

export function getFile(id) {
  return FILES.find(f => f.id === id);
}

// readme.txt 内容（解压后）
export const BACKUP_README = `Last Online Backup
==================
Created: 2003-09-17
Administrator: Lin Qiming

如果服务器出现异常。
请不要删除数据。
数据会自己恢复。

.
.
.

访客也是数据。`;
