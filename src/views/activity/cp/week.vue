<!-- 奖励 -->
<template>
  <div class="week">
    <div class="list" :class="{ 'list-ar': store.language === 'ar' }">
      <div class="list-content">
        <div class="item top1" v-if="cpList?.length > 0">
          <div class="sort"></div>
          <div class="my">
            <div class="my-avatar">
              <div class="photo">
                <img :src="cpList.slice(0, 1)[0].avatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="my-nick">{{ cpList.slice(0, 1)[0].nick }}</div>
          </div>
          <div class="number">
            <span>{{ formatNumber(cpList.slice(0, 1)[0].integral) }}</span>
          </div>
          <div class="obj">
            <div class="obj-avatar">
              <div class="photo">
                <img :src="cpList.slice(0, 1)[0].reAvatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="obj-nick">{{ cpList.slice(0, 1)[0].reNick }}</div>
          </div>
        </div>
        <div class="item top2" v-if="cpList?.length > 1">
          <div class="sort"></div>
          <div class="my">
            <div class="my-avatar">
              <div class="photo">
                <img :src="cpList.slice(1, 2)[0].avatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="my-nick">{{ cpList.slice(1, 2)[0].nick }}</div>
          </div>
          <div class="number">
            <span>{{ formatNumber(cpList.slice(1, 2)[0].integral) }}</span>
          </div>
          <div class="obj">
            <div class="obj-avatar">
              <div class="photo">
                <img :src="cpList.slice(1, 2)[0].reAvatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="obj-nick">{{ cpList.slice(1, 2)[0].reNick }}</div>
          </div>
        </div>
        <div class="item top3" v-if="cpList?.length > 2">
          <div class="sort"></div>
          <div class="my">
            <div class="my-avatar">
              <div class="photo">
                <img :src="cpList.slice(2, 3)[0].avatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="my-nick">{{ cpList.slice(2, 3)[0].nick }}</div>
          </div>
          <div class="number">
            <span>{{ formatNumber(cpList.slice(2, 3)[0].integral) }}</span>
          </div>
          <div class="obj">
            <div class="obj-avatar">
              <div class="photo">
                <img :src="cpList.slice(2, 3)[0].reAvatar" alt="" />
              </div>
              <div class="frame"></div>
            </div>
            <div class="obj-nick">{{ cpList.slice(2, 3)[0].reNick }}</div>
          </div>
        </div>
        <div class="item" v-for="(item, index) in cpList.slice(3, isMore ? 50 : 20)" :key="index">
          <div class="sort">{{ index + 4 }}</div>
          <div class="my-avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="number">
            <span>{{ formatNumber(item.integral) }}</span>
          </div>
          <div class="obj-avatar">
            <img :src="item.reAvatar" alt="" />
          </div>
        </div>
        <div class="empty" v-if="cpList?.length === 0">
          <div class="empty-img"></div>
        </div>
      </div>
      <div class="more" @click="isMore = true" v-if="!isMore && cpList?.length > 0">
        {{ t("cp.More") }}
      </div>
    </div>
    <div class="my-cp">
      <div class="cp" v-if="cpSelf?.uid">
        <div class="sort">{{ cpSelf?.index || "50+" }}</div>
        <div class="my-avatar">
          <img :src="cpSelf.avatar" alt="" />
        </div>
        <div class="number">
          <span>{{ formatNumber(cpSelf.integral) }}</span>
        </div>
        <div class="obj-avatar">
          <img :src="cpSelf.reAvatar" alt="" />
        </div>
      </div>
      <p v-else>{{ t("cp.noCp") }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";
import { List } from "vant";
import { watch } from "vue";

// 使用 Pinia store
const store = useMainStore();
const { t } = useI18n();
const isMore = ref(false);
// 1. 接收父组件传递的 props
const props = defineProps({
  cpList: {
    type: Array,
    default: () => [], // 建议使用工厂函数返回默认值（避免共享引用）
  },
  cpSelf: {
    type: Object,
    default: () => ({}), // 同上
  },
});

// 2. 监听 props 变化
watch(
  () => [...props.cpList], // 通过解构监听数组元素变化
  (newList) => {
    console.log("cpList变化:", newList);
  },
);

watch(
  () => ({ ...props.cpSelf }), // 浅拷贝监听对象属性变化
  (newObj) => {
    console.log("cpSelf变化:", newObj);
  },
  { deep: true }, // 深度监听（可选）
);

const formatNumber = (num) => {
  console.log(num, "num");
  let n = Number(num);
  let result;
  if (n >= 1e9) {
    result = (n / 1e9).toFixed(1) + "B";
  } else if (n >= 1e6) {
    result = (n / 1e6).toFixed(1) + "M";
  } else if (n >= 1e3) {
    result = (n / 1e3).toFixed(1) + "K";
  }
  return result;
};

// 3. 生命周期钩子中访问 props
onMounted(() => {
  console.log("初始 cpList:", props.cpList);
  console.log("初始 cpSelf:", props.cpSelf);
});
</script>

<style lang="scss" scoped>
.week {
  width: 100%;
  height: 1959px;
  background: #75008b;
  box-sizing: border-box;
  position: relative;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .list {
    width: 355px;
    height: 1784px;
    box-sizing: border-box;
    padding: 35px 4px 50px;
    position: relative;
    top: 75px;
    left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    background: url("@/assets/activity/cp/bg-list.png") no-repeat center center;
    background-size: 100% 100%;
    .list-content {
      width: 100%;
      height: calc(100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
      overflow-y: auto;
      .item {
        width: 347px;
        height: 83px;
        background: url("@/assets/activity/cp/bg-item-other.png") no-repeat center center;
        background-size: 100% 100%;
        margin-bottom: 2px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:last-child {
          margin-bottom: 0;
        }
        .sort {
          width: 33px;
          height: 28px;
          background: url("@/assets/activity/cp/bg-top-other.png") no-repeat center center;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: bold;
          font-size: 15px;
          color: #ffffff;
          line-height: 21px;
          text-align: center;
          margin: 26px 16px 30px 35px;
        }
        .number {
          width: 87px;
          height: 31px;
          margin: 0 17px 0 10px;
          background: url("@/assets/activity/cp/bg-item-number.png") no-repeat center center;
          background-size: 100% 100%;
          box-sizing: border-box;
          padding: 0 13px 0 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          > span {
            width: 47px;
            height: 31px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: bold;
            font-size: 14px;
            color: #ffffff;
            line-height: 31px;
            text-align: center;
          }
        }
        > .my-avatar,
        > .obj-avatar {
          margin: 18px 0 22px 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          > img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }
        }
      }
      .top1 {
        margin-top: 10px;
      }
      .top1,
      .top2,
      .top3 {
        background: url("@/assets/activity/cp/bg-item1.png") no-repeat center center;
        background-size: 100% 100%;
        .sort {
          width: 46px;
          height: 46px;
          margin: 22px 2px 18px 23px;
          background: url("@/assets/activity/cp/top1.png") no-repeat center center;
          background-size: 100% 100%;
        }
        .my {
          width: 66px;
          height: 74px;
          margin: 6px 0 5px 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .my-avatar {
            width: 66px;
            height: 66px;
            position: relative;
            .photo {
              width: 44px;
              height: 44px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              border-radius: 50%;
              z-index: 9;
              display: flex;
              justify-content: center;
              align-items: center;
              > img {
                width: 100%;
                height: 100%;
              }
            }
            .frame {
              width: 66px;
              height: 66px;
              background: url("@/assets/activity/cp/avatar-left.png") no-repeat center center;
              background-size: 100% 100%;
              position: absolute;
              z-index: 10;
            }
          }
          .my-nick {
            margin-top: -3px;
            text-align: center;
            width: 66px;
            height: 11px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 400;
            font-size: 8px;
            color: #ffffff;
            line-height: 11px;
          }
        }
        .number {
          width: 87px;
          height: 31px;
          margin: 0 2px 0 2px;
          background: url("@/assets/activity/cp/bg-item-number.png") no-repeat center center;
          background-size: 100% 100%;
          box-sizing: border-box;
          padding: 0 13px 0 26px;
          > span {
            width: 47px;
            height: 31px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: bold;
            font-size: 14px;
            color: #ffffff;
            line-height: 31px;
            text-align: center;
          }
        }
        .obj {
          width: 66px;
          height: 74px;
          margin: 6px 0 5px 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .obj-avatar {
            width: 66px;
            height: 66px;
            position: relative;
            .photo {
              width: 44px;
              height: 44px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              border-radius: 50%;
              z-index: 9;
              display: flex;
              justify-content: center;
              align-items: center;
              > img {
                width: 100%;
                height: 100%;
              }
            }
            .frame {
              width: 66px;
              height: 66px;
              background: url("@/assets/activity/cp/avatar-right.png") no-repeat center center;
              background-size: 100% 100%;
              position: absolute;
              z-index: 10;
            }
          }
          .obj-nick {
            margin-top: -3px;
            text-align: center;
            width: 66px;
            height: 11px;
            font-family: PingFang-SC, PingFang-SC;
            font-weight: 400;
            font-size: 8px;
            color: #ffffff;
            line-height: 11px;
          }
        }
      }
      .top2 {
        background: url("@/assets/activity/cp/bg-item2.png") no-repeat center center;
        background-size: 100% 100%;
        .sort {
          background: url("@/assets/activity/cp/top2.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .top3 {
        background: url("@/assets/activity/cp/bg-item3.png") no-repeat center center;
        background-size: 100% 100%;
        .sort {
          background: url("@/assets/activity/cp/top3.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .empty {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 252px;
        height: 226px;
        > .empty-img {
          width: 252px;
          height: 226px;
          background: url("@/assets/activity/cp/empty.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    .more {
      width: 105px;
      height: 30px;
      position: absolute;
      left: 127px;
      bottom: 25px;
      background: url("@/assets/activity/cp/bg-more.png") no-repeat center center;
      background-size: 100% 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 4px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 14px;
      color: #ffffff;
      line-height: 20px;
      text-align: center;
    }
  }
  .list-ar {
    position: relative;
    right: 10px;
  }
  .my-cp {
    position: absolute;
    width: 100%;
    height: 100px;
    top: 1859px;
    left: 0;
    background: url("@/assets/activity/cp/bg-my.png") no-repeat center center;
    background-size: 100% 100%;
    > p {
      width: 100%;
      margin: 58px auto 0;
      padding: 0 20px;
      min-height: 20px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #850000;
      line-height: 20px;
      text-align: center;
    }
    .cp {
      width: 347px;
      height: 44px;
      margin: 48px auto 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .sort {
        width: 33px;
        height: 28px;
        background: url("@/assets/activity/cp/bg-top-other.png") no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: bold;
        font-size: 15px;
        color: #ffffff;
        line-height: 21px;
        text-align: center;
        margin: 0 16px 0 35px;
      }
      .number {
        width: 87px;
        height: 31px;
        margin: 0 17px 0 10px;
        background: url("@/assets/activity/cp/bg-item-number.png") no-repeat center center;
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 0 13px 0 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          width: 47px;
          height: 31px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: bold;
          font-size: 15px;
          color: #ffffff;
          line-height: 31px;
          text-align: center;
        }
      }
      > .my-avatar,
      > .obj-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        > img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
