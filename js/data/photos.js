// 相册数据
export const PHOTOS = [
  {
    id: "school_2003",
    name: "青藤镇中学.jpg",
    date: "2003-03-12",
    desc: "春天的校园",
    camera: "Canon PowerShot A40",
    owner: "Lin Qiming",
    comment: "我们的校园。",
    width: 480, height: 360,
    // 用CSS绘制的老照片场景
    scene: "school",
    hidden: null,
  },
  {
    id: "spring_trip",
    name: "春游合影.jpg",
    date: "2003-04-20",
    desc: "班级春游",
    camera: "Canon PowerShot A40",
    owner: "小林",
    comment: "那一天大家都很开心。",
    width: 480, height: 360,
    scene: "spring",
    hidden: null,
  },
  {
    id: "graduation",
    name: "2003毕业聚会.jpg",
    date: "2003-06-18",
    modified: "2003-09-17",
    desc: "毕业聚会合影",
    camera: "Canon PowerShot A40",
    owner: "Lin Qiming",
    comment: "我们本来有13个人。",
    width: 480, height: 360,
    scene: "graduation",
    hidden: "shadow", // 影子区域有第13个影子
    rewardFile: "shadow_fragment.dat",
  },
];

export function getPhoto(id) {
  return PHOTOS.find(p => p.id === id);
}
