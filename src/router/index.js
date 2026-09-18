import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    // component: () => import('../views/home/index.vue')
    // component: () => import("../views/activity/dragonsWealth/index.vue"),
    // component: () => import("../views/p/liveStreamingTask/index.vue"),
    component: () => import("../views/activity/birthday/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/nav-router",
    name: "NavRouter",
    component: () => import("../views/home/nav-router.vue"),
  },
  {
    path: "/guild",
    name: "Guild",
    component: () => import("../views/p/guild/main/main.vue"),
    children: [],
  },
  {
    path: "/guild/search",
    name: "GuildSearch",
    component: () => import("../views/p/guild/search/search.vue"),
  },
  {
    path: "/guild/anchor",
    name: "GuildAnchor",
    component: () => import("../views/p/guild/anchor/anchor.vue"),
  },
  {
    path: "/single/invite-reward",
    name: "InviteReward",
    component: () => import("../views/p/inviteReward/index.vue"),
  },
  {
    path: "/single/invite-reward/record",
    name: "InviteRewardRecord",
    component: () => import("../views/p/inviteReward/record.vue"),
  },
  {
    path: "/single/vip-privilege",
    name: "VipPrivilege",
    component: () => import("../views/p/vipPrivilege/index.vue"),
  },
  // 活动
  {
    path: "/create/activity/rule",
    name: "CreateActivityRule",
    component: () => import("../views/a/create/create-activity-rule.vue"),
  },
  // 充值活动
  {
    path: "/activity/recharge/index",
    name: "ActivityRechargeIndex",
    component: () => import("../views/activity/recharge/index.vue"),
  },
  // CP活动
  {
    path: "/activity/cp/index",
    name: "ActivityCpIndex",
    component: () => import("../views/activity/cp/index.vue"),
  },
  // 斋月活动
  {
    path: "/activity/ramadan/index",
    name: "ActivityRamadanIndex",
    component: () => import("../views/activity/ramadan/index.vue"),
  },
  // 巨龙的财富
  {
    path: "/activity/dragons-wealth/index",
    name: "ActivityDragonsWealthIndex",
    component: () => import("../views/activity/dragonsWealth/index.vue"),
  },
  // 挚友规则
  {
    path: "/p/closeFriendsRules/index",
    name: "CloseFriendsRulesIndex",
    component: () => import("../views/p/closeFriendsRules/index.vue"),
  },
  // 宰牲节活动
  {
    path: "/activity/eidAlAdha/index",
    name: "ActivityEidAlAdhaIndex",
    component: () => import("../views/activity/eidAlAdha/index.vue"),
  },
  // 任务
  {
    path: "/p/task/index",
    name: "TaskIndex",
    component: () => import("../views/p/task/index.vue"),
  },
  // 管理记录
  {
    path: "/p/managementRecord/index",
    name: "ManagementRecordIndex",
    component: () => import("../views/p/managementRecord/index.vue"),
  },
  // 直播任务
  {
    path: "/p/liveStreamingTask/index",
    name: "LiveStreamingTaskIndex",
    component: () => import("../views/p/liveStreamingTask/index.vue"),
  },
  // 生日特权活动
  {
    path: "/activity/birthday/index",
    name: "ActivityBirthdayIndex",
    component: () => import("../views/activity/birthday/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/v1/"),
  routes,
});

export default router;