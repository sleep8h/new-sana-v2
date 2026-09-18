/**
 * 时间戳处理工具函数
 */

/**
 * 格式化时间戳为指定格式
 * @param {number|string|Date} timestamp - 时间戳（秒/毫秒）或 Date 对象
 * @param {string} format - 输出格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 *
 * 格式占位符：
 * YYYY - 年，MM - 月，DD - 日
 * HH - 时，mm - 分，ss - 秒
 * d - 星期几 (0-6)
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp && timestamp !== 0) return ''

  let date
  if (timestamp instanceof Date) {
    date = timestamp
  } else if (typeof timestamp === 'string') {
    // 处理纯数字字符串（时间戳）
    if (/^\d+$/.test(timestamp)) {
      timestamp = Number(timestamp)
      date = timestamp.toString().length === 10
        ? new Date(timestamp * 1000)
        : new Date(timestamp)
    } else {
      date = new Date(timestamp)
    }
  } else if (typeof timestamp === 'number') {
    // 自动判断秒级(10位)或毫秒级(13位)时间戳
    date = timestamp.toString().length === 10
      ? new Date(timestamp * 1000)
      : new Date(timestamp)
  } else {
    return ''
  }

  if (isNaN(date.getTime())) return ''

  const pad = (n) => String(n).padStart(2, '0')

  const map = {
    'YYYY': date.getFullYear(),
    'MM': pad(date.getMonth() + 1),
    'DD': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'd': date.getDay()
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss|d/g, (match) => map[match])
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、昨天、3天前）
 * @param {number|string|Date} timestamp - 时间戳
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(timestamp) {
  if (!timestamp && timestamp !== 0) return ''

  const now = Date.now()
  let targetTime

  if (timestamp instanceof Date) {
    targetTime = timestamp.getTime()
  } else if (typeof timestamp === 'string') {
    if (/^\d+$/.test(timestamp)) {
      const num = Number(timestamp)
      targetTime = String(num).length === 10 ? num * 1000 : num
    } else {
      targetTime = new Date(timestamp).getTime()
    }
  } else {
    targetTime = String(timestamp).length === 10 ? timestamp * 1000 : timestamp
  }

  const diff = now - targetTime
  const absDiff = Math.abs(diff)

  // 未来时间
  if (diff < 0) {
    if (absDiff < 60000) return '即将'
    if (absDiff < 3600000) return `${Math.ceil(absDiff / 60000)}分钟后`
    if (absDiff < 86400000) return `${Math.ceil(absDiff / 3600000)}小时后`
    return `${Math.ceil(absDiff / 86400000)}天后`
  }

  // 过去时间
  if (absDiff < 60000) return '刚刚'
  if (absDiff < 3600000) return `${Math.floor(absDiff / 60000)}分钟前`
  if (absDiff < 86400000) return `${Math.floor(absDiff / 3600000)}小时前`

  const days = Math.floor(absDiff / 86400000)
  if (days === 1) return '昨天'
  if (days === 2) return '前天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

/**
 * 计算两个时间的时间差
 * @param {number|string|Date} start - 开始时间
 * @param {number|string|Date} end - 结束时间（默认当前时间）
 * @returns {object} 时间差对象 { days, hours, minutes, seconds, totalMs }
 */
export function getTimeDiff(start, end = Date.now()) {
  const parseTime = (t) => {
    if (t instanceof Date) return t.getTime()
    if (typeof t === 'string') {
      if (/^\d+$/.test(t)) {
        const num = Number(t)
        return String(num).length === 10 ? num * 1000 : num
      }
      return new Date(t).getTime()
    }
    return String(t).length === 10 ? t * 1000 : t
  }

  const startMs = parseTime(start)
  const endMs = parseTime(end)
  const diff = Math.abs(endMs - startMs)

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    totalSeconds: Math.floor(diff / 1000),
    totalMinutes: Math.floor(diff / 60000),
    totalHours: Math.floor(diff / 3600000),
    toString: (format = '{d}天{h}小时{m}分{s}秒') => {
      return format
        .replace('{d}', days)
        .replace('{h}', String(hours).padStart(2, '0'))
        .replace('{m}', String(minutes).padStart(2, '0'))
        .replace('{s}', String(seconds).padStart(2, '0'))
    }
  }
}

/**
 * 获取指定日期当天的开始/结束时间戳
 * @param {number|string|Date} timestamp - 指定日期（默认当天）
 * @returns {object} { startOfDay, endOfDay } 毫秒时间戳
 */
export function getDayRange(timestamp) {
  let date
  if (timestamp) {
    if (timestamp instanceof Date) {
      date = new Date(timestamp)
    } else if (typeof timestamp === 'string' && /^\d+$/.test(timestamp)) {
      const num = Number(timestamp)
      date = new Date(String(num).length === 10 ? num * 1000 : num)
    } else if (typeof timestamp === 'number') {
      date = new Date(String(timestamp).length === 10 ? timestamp * 1000 : timestamp)
    } else {
      date = new Date(timestamp)
    }
  } else {
    date = new Date()
  }

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  return {
    startOfDay: new Date(year, month, day, 0, 0, 0, 0).getTime(),
    endOfDay: new Date(year, month, day, 23, 59, 59, 999).getTime()
  }
}

/**
 * 判断是否为今天
 * @param {number|string|Date} timestamp - 时间戳
 * @returns {boolean}
 */
export function isToday(timestamp) {
  if (!timestamp) return false
  const target = formatTimestamp(timestamp, 'YYYY-MM-DD')
  const today = formatTimestamp(Date.now(), 'YYYY-MM-DD')
  return target === today
}

/**
 * 获取当前时间戳（秒级）
 * @returns {number}
 */
export function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

/**
 * 获取当前时间戳（毫秒级）
 * @returns {number}
 */
export function nowMilliseconds() {
  return Date.now()
}