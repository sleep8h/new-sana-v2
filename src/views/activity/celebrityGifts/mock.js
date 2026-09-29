/**
 * Celebrity Gift Battle 活动本地演示数据
 * 后端接口未上线前用于页面渲染，接口就绪后将 USE_MOCK 置为 false（或删除本文件）。
 * 字段结构与接口约定保持一致：
 * - /h5doings/activity/celebrityGift2026/list   活动信息
 * - /h5doings/activity/celebrityGift2026/rank   排行榜
 * - /h5doings/activity/celebrityGift2026/pay    赠送礼物/应援
 * - /h5doings/activity/celebrityGift2026/rankRewards 奖励配置
 */
import defaultAvatar from "@/assets/common/user-avatar-default.png";

// 接口就绪前使用本地数据，接口报错时自动回退
export const USE_MOCK = true;

// 倒计时剩余时间：44天19小时38分29秒（与设计稿一致，单位毫秒，与接口 timeOut 字段约定一致）
const mockTimeOut = (44 * 24 * 60 * 60 + 19 * 60 * 60 + 38 * 60 + 29) * 1000;

// 礼物色板（无礼物图片时用 CSS 礼物盒占位，按 color 取色）
export const GIFT_THEMES = [
  { base: "#e8b33b", deep: "#9a6b14", ribbon: "#fff0c0" },
  { base: "#4f8ff7", deep: "#1d4fae", ribbon: "#dfeeff" },
  { base: "#b360f2", deep: "#6a23a4", ribbon: "#f2ddff" },
  { base: "#35c98e", deep: "#147a52", ribbon: "#dcfff0" },
  { base: "#f45757", deep: "#a81818", ribbon: "#ffe0e0" },
  { base: "#ff9d3d", deep: "#c25e00", ribbon: "#fff0d8" },
];

const mockGift = (giftId, name, nameAr, value, color, url = "") => ({
  giftId,
  rewardName: name,
  rewardNameAr: nameAr,
  rewardValue: value,
  rewardUrl: url,
  color,
});

// 礼物目标奖励分组（礼物页路线图 + 规则弹窗共用）
export const mockRewardGroups = [
  {
    id: 1,
    title: "Golden Leaderboard",
    titleAr: "لوحة الصدارة الذهبية",
    target: "1,000,000",
    gifts: [
      mockGift(101, "Golden Crown", "التاج الذهبي", 1, 0),
      mockGift(102, "Sapphire", "ياقوت أزرق", 5, 1),
      mockGift(103, "Amethyst", "جمشت", 10, 2),
    ],
  },
  {
    id: 2,
    title: "Glory Stage",
    titleAr: "مسرح المجد",
    target: "3,000,000",
    gifts: [
      mockGift(104, "Emerald", "زمرد", 1, 3),
      mockGift(105, "Ruby Rose", "وردة ياقوتية", 3, 4),
      mockGift(106, "Amber Light", "ضوء العنبر", 8, 5),
    ],
  },
  {
    id: 3,
    title: "Hall of Stars",
    titleAr: "قاعة النجوم",
    target: "8,000,000",
    gifts: [
      mockGift(107, "Star Trophy", "كأس النجمة", 1, 0),
      mockGift(108, "Blue Medal", "الميدالية الزرقاء", 5, 1),
      mockGift(109, "Purple Medal", "الميدالية البنفسجية", 10, 2),
    ],
  },
  {
    id: 4,
    title: "Legend Throne",
    titleAr: "عرش الأسطورة",
    target: "20,000,000",
    gifts: [
      mockGift(110, "Throne Gift", "هدية العرش", 1, 3),
      mockGift(111, "Flame Gift", "هدية اللهب", 9, 4),
    ],
  },
];

const makeCelebrity = (key) => ({
  uid: key === "a" ? 9001001 : 9001002,
  nick: key === "a" ? "SANA Star A" : "SANA Star B",
  nickAr: key === "a" ? "نجم سنا أ" : "نجم سنا ب",
  avatar: defaultAvatar,
  score: key === "a" ? 1827650 : 1305920,
  // 该阵营贡献前三的用户头像
  topUsers: [
    { uid: 8000000, avatar: defaultAvatar },
    { uid: 8000016, avatar: defaultAvatar },
    { uid: 8000005, avatar: defaultAvatar },
  ],
});

// 活动主页信息（/list）
export const mockInfo = {
  timeOut: mockTimeOut,
  celebrityA: makeCelebrity("a"),
  celebrityB: makeCelebrity("b"),
  rewardGroups: mockRewardGroups,
  // 王座奖励（中间大奖 + 左右两个奖励位）
  thronePrizes: [
    { giftId: 102, rewardName: "Sapphire", rewardNameAr: "ياقوت أزرق", rewardValue: 5, color: 1, rewardUrl: "" },
    { giftId: 101, rewardName: "Golden Crown", rewardNameAr: "التاج الذهبي", rewardValue: 1, color: 0, rewardUrl: "", center: true },
    { giftId: 103, rewardName: "Amethyst", rewardNameAr: "جمشت", rewardValue: 10, color: 2, rewardUrl: "" },
  ],
  userInfo: {
    uid: 9000162,
    nick: "SANA Player",
    avatar: defaultAvatar,
    contribution: 1785,
    availablePropCount: 12,
    selectedTeam: 1, // 0 未选择 1 阵营A 2 阵营B
  },
};

const namePool = [
  "Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Mason",
  "Isabella", "Lucas", "Mia", "Leo", "Charlotte", "Amir", "Yara", "Omar",
];
const countryPool = ["US", "BR", "TR", "EG", "SA", "IN", "ID", "PK"];
const scores = [
  9284500, 6113200, 4820900, 3355500, 2842100, 2110320, 1870640, 1425380,
  1103210, 905600, 761200, 548900, 402300, 315600, 208900, 120500,
];

const makeRankList = () =>
  scores.map((integral, i) => ({
    index: i + 1,
    uid: 8000000 + i,
    nick: `${namePool[i % namePool.length]} ${1000 + i}`,
    avatar: defaultAvatar,
    integral,
    country: countryPool[i % countryPool.length],
  }));

// 排行榜（/rank）
export const mockRank = {
  list: makeRankList(),
  self: {
    index: 1785,
    uid: 9000162,
    nick: "SANA Player",
    avatar: defaultAvatar,
    integral: 1785,
    country: "US",
  },
};

// 名人堂（历届 TOP1）
export const mockHallOfFame = [
  { uid: 8000000, nick: "Olivia 1000", avatar: defaultAvatar, integral: 9284500, period: "Season 1" },
  { uid: 8000016, nick: "Amir 1015", avatar: defaultAvatar, integral: 8720300, period: "Season 2" },
  { uid: 8000005, nick: "Ava 1004", avatar: defaultAvatar, integral: 7905200, period: "Season 3" },
];

/**
 * 请求兜底：
 * - USE_MOCK = true（接口未上线）：直接返回本地演示数据，不发起请求
 * - USE_MOCK = false（接口已上线）：仅请求接口，code 非 200 时抛错
 * 注意：requestFactory 必须是返回 Promise 的函数（惰性执行），避免 mock 模式下仍发起请求
 * @param {() => Promise} requestFactory 接口请求工厂
 * @param {*} fallback 本地兜底数据
 */
export const withMock = async (requestFactory, fallback) => {
  if (USE_MOCK) {
    return structuredCloneSafe(fallback);
  }
  const res = await requestFactory();
  if (res && res.code === 200) return res.data;
  throw new Error(res?.message || "request fail");
};

const structuredCloneSafe = (data) => JSON.parse(JSON.stringify(data));
