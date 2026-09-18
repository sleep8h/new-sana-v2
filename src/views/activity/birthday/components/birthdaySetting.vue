<!-- 生日设置弹窗 -->
<template>
  <Teleport to="body">
    <div class="birthday-modal" v-if="isShow">
      <div class="modal-mask" @click="closeModal"></div>
      <div class="modal-content">
        <!-- 顶部星期显示 -->
        <div class="weekday">{{ weekdayText }}</div>

        <!-- 大号日期显示 -->
        <div class="date-display">
          <div class="month-text">{{ monthName }}</div>
          <div class="day-text">{{ String(selectedDay).padStart(2, '0') }}</div>
          <div class="year-row">
            <span class="year-arrow left" @click="prevYear">&#8249;</span>
            <span class="year-text">{{ selectedYear }}</span>
            <span class="year-arrow right" @click="nextYear">&#8250;</span>
          </div>
        </div>

        <!-- 月份标题 -->
        <div class="calendar-header">
          <span class="prev-month" @click="prevMonth">&#8249;</span>
          <span class="current-month">{{ monthName }} {{ selectedYear }}</span>
          <span class="next-month" @click="nextMonth">&#8250;</span>
        </div>

        <!-- 星期表头 -->
        <div class="week-header">
          <span v-for="day in weekDays" :key="day">{{ day }}</span>
        </div>

        <!-- 日期网格 -->
        <div class="calendar-grid">
          <div
            v-for="date in calendarDates"
            :key="date.key"
            :class="[
              'calendar-date',
              {
                'other-month': !date.isCurrentMonth,
                'is-today': date.isToday,
                'is-selected': date.isSelected,
              },
            ]"
            @click="selectDate(date)"
          >
            {{ date.day }}
          </div>
        </div>

        <!-- 下一个月预览 -->
        <div class="next-month-preview" @click="nextMonth">
          {{ nextMonthName }} {{ nextMonthYear }}
        </div>

        <!-- 底部按钮 -->
        <div class="modal-footer">
          <div class="done-btn" @click="confirmBirthday">{{ t('birthday.done') }}</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import { postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";

const store = useMainStore();
const { t } = useI18n();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isShow", "confirm", "close"]);

const now = new Date();
const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);
const selectedDay = ref(now.getDate());

const weekDays = computed(() => [
  t("calendar.sun"),
  t("calendar.mon"),
  t("calendar.tue"),
  t("calendar.wed"),
  t("calendar.thu"),
  t("calendar.fri"),
  t("calendar.sat"),
]);

const monthNames = computed(() => [
  t("calendar.january"),
  t("calendar.february"),
  t("calendar.march"),
  t("calendar.april"),
  t("calendar.may"),
  t("calendar.june"),
  t("calendar.july"),
  t("calendar.august"),
  t("calendar.september"),
  t("calendar.october"),
  t("calendar.november"),
  t("calendar.december"),
]);

const monthName = computed(() => monthNames.value[selectedMonth.value - 1].toUpperCase());

const weekdayText = computed(() => {
  const date = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value);
  const weekdays = [
    t("calendar.sunday"),
    t("calendar.monday"),
    t("calendar.tuesday"),
    t("calendar.wednesday"),
    t("calendar.thursday"),
    t("calendar.friday"),
    t("calendar.saturday"),
  ];
  return weekdays[date.getDay()];
});

const nextMonthName = computed(() => {
  let m = selectedMonth.value + 1;
  let y = selectedYear.value;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return monthNames.value[m - 1];
});

const nextMonthYear = computed(() => {
  let m = selectedMonth.value + 1;
  let y = selectedYear.value;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return y;
});

const calendarDates = computed(() => {
  const year = selectedYear.value;
  const month = selectedMonth.value;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const dates = [];

  // 上月日期
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    dates.push({
      key: `prev-${day}`,
      day,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  // 当月日期
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      i === today.getDate();
    const isSelected =
      year === selectedYear.value &&
      month === selectedMonth.value &&
      i === selectedDay.value;
    dates.push({
      key: `current-${i}`,
      day: i,
      isCurrentMonth: true,
      isToday,
      isSelected,
    });
  }

  // 下月日期
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    dates.push({
      key: `next-${i}`,
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  return dates;
});

const prevMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
};

const prevYear = () => {
  selectedYear.value -= 1;
};

const nextYear = () => {
  selectedYear.value += 1;
};

const selectDate = (date) => {
  if (!date.isCurrentMonth) {
    if (date.day > 20) {
      // 上月的日期
      prevMonth();
    } else {
      // 下月的日期
      nextMonth();
    }
  }
  selectedDay.value = date.day;
};

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

const confirmBirthday = async () => {
  const year = selectedYear.value;
  const month = String(selectedMonth.value).padStart(2, "0");
  const day = String(selectedDay.value).padStart(2, "0");
  const birthday = `${year}-${month}-${day}`;
  try {
    const res = await postFormData("/h5doings/activity/birthday/birthday", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      birthday: birthday,
    });
    if (res && res.code === 200) {
      showToast(t('birthday.birthdaySetSuccessfully'));
      emit("confirm", birthday);
      closeModal();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error setting birthday:", error);
  }
};
</script>

<style lang="scss" scoped>
.birthday-modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
  }

  .modal-content {
    position: relative;
    z-index: 10000;
    width: 320px;
    background: linear-gradient(180deg, #2D1B4E 0%, #1A0227 100%);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 32px rgba(139, 69, 255, 0.3);
    border: 1px solid rgba(212, 165, 255, 0.2);

    .weekday {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #D4A5FF;
      padding-top: 12px;
      padding-bottom: 2px;
      letter-spacing: 2px;
    }

    .date-display {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .month-text {
        font-size: 18px;
        color: #EBD975;
        font-weight: 500;
        letter-spacing: 2px;
      }

      .day-text {
        font-size: 60px;
        color: #EBD975;
        font-weight: 300;
        line-height: 1;
        margin: 2px 0;
        text-shadow: 0 2px 8px rgba(235, 217, 117, 0.3);
      }

      .year-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        position: relative;

        .year-arrow {
          font-size: 20px;
          color: rgba(212, 165, 255, 0.6);
          cursor: pointer;
          padding: 0 8px;
          user-select: none;

          &:hover {
            color: #EBD975;
          }

          &.left {
            margin-left: 0;
          }

          &.right {
            margin-right: 0;
          }
        }

        .year-text {
          font-size: 16px;
          color: #D4A5FF;
          font-weight: 400;
          min-width: 40px;
          text-align: center;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .calendar-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 16px;
      box-sizing: border-box;
      border-top: 1px solid rgba(212, 165, 255, 0.15);

      .prev-month,
      .next-month {
        font-size: 20px;
        color: rgba(212, 165, 255, 0.6);
        cursor: pointer;
        padding: 0 8px;
        user-select: none;

        &:hover {
          color: #EBD975;
        }
      }

      .current-month {
        font-size: 14px;
        color: #FFFFFF;
        font-weight: 600;
      }
    }

    .week-header {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 4px 16px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(212, 165, 255, 0.15);

      span {
        text-align: center;
        font-size: 10px;
        color: rgba(212, 165, 255, 0.7);
      }
    }

    .calendar-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 4px 16px;
      box-sizing: border-box;

      .calendar-date {
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-self: center;
        font-size: 13px;
        color: #FFFFFF;
        border-radius: 50%;
        cursor: pointer;
        margin: 1px 0;
        transition: all 0.2s;

        &:hover {
          background: rgba(212, 165, 255, 0.2);
        }

        &.other-month {
          color: rgba(255, 255, 255, 0.3);
        }

        &.is-today {
          border: 1px solid #EBD975;
          color: #EBD975;
        }

        &.is-selected {
          background: linear-gradient(135deg, #EBD975 0%, #F0D863 100%);
          color: #1A0227;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(235, 217, 117, 0.4);
        }
      }
    }

    .next-month-preview {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: rgba(212, 165, 255, 0.6);
      padding: 4px 0;
      border-top: 1px solid rgba(212, 165, 255, 0.15);
      cursor: pointer;

      &:hover {
        color: #EBD975;
      }
    }

    .modal-footer {
      width: 100%;
      padding: 8px 0;
      border-top: 1px solid rgba(212, 165, 255, 0.15);
      display: flex;
      justify-content: center;

      .done-btn {
        font-size: 14px;
        color: #EBD975;
        font-weight: 600;
        cursor: pointer;
        padding: 8px 24px;
        letter-spacing: 1px;

        &:hover {
          color: #FFFFFF;
          text-shadow: 0 0 8px rgba(235, 217, 117, 0.5);
        }
      }
    }
  }
}
</style>