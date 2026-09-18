/**
 * 获取URL参数（支持hash和query参数）
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export function getUrlParam(name) {
  // 优先获取 hash 部分参数
  let paramsStr = "";
  const hash = window.location.hash;
  if (hash && (hash.includes("?") || hash.includes("&"))) {
    paramsStr = hash.split("?")[1] || hash.split("/")[1] || hash.substring(1);
  } else if (window.location.search) {
    // 如果没有 hash 参数，则获取 query 参数
    paramsStr = window.location.search.substring(1);
  }
  if (!paramsStr) return null;
  const params = paramsStr.split("&");
  for (const param of params) {
    const [key, value] = param.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}

/**
 * 获取所有URL参数（支持hash和query参数）
 * @returns {Object} 参数对象
 */
export function getAllUrlParams() {
  const defaultParams = {
    uid: "0",
    ticket: "0",
    appVersion: "1.0.1.0",
    language: "en",
    os: "android",
    deviceId: "",
    appid: "xchat",
    code: "",
  };
  let paramsStr = "";
  const hash = window.location.hash;
  if (hash && (hash.includes("?") || hash.includes("&"))) {
    paramsStr = hash.split("?")[1] || hash.split("/")[1] || hash.substring(1);
  } else if (window.location.search) {
    paramsStr = window.location.search.substring(1);
  }
  if (!paramsStr) {
    return defaultParams;
  }
  const params = {};
  const paramPairs = paramsStr.split("&");
  for (const pair of paramPairs) {
    const [key, value] = pair.split("=");
    if (key && value) {
      params[key] = value;
    }
  }
  return {
    ...defaultParams,
    ...params,
  };
}

/**
 * 设置URL参数（支持hash参数）
 * @param {string} name - 参数名
 * @param {string} value - 参数值
 */
export function setUrlParam(name, value) {
  const params = getAllUrlParams();
  params[name] = value;

  // 构建新的hash字符串
  const newHash = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  window.location.hash = newHash;
}

/**
 * 移除URL参数（支持hash参数）
 * @param {string} name - 参数名
 */
export function removeUrlParam(name) {
  const params = getAllUrlParams();
  delete params[name];

  // 构建新的hash字符串
  const newHash = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  window.location.hash = newHash;
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需+1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 格式化为 "2025-2-23 16:00"
  return `${year}-${month}-${day} ${hours}:${minutes.toString().padStart(2, "0")}`;
}

export function debounce(func, delay = 300, immediate = true) {
  let timer = null;
  return function (...args) {
    const context = this;

    // 立即执行：第一次触发且没有计时器时执行
    if (immediate && !timer) {
      func.apply(context, args);
    }

    // 清除之前的计时器（重置等待）
    if (timer) {
      clearTimeout(timer);
    }

    // 设置新的计时器
    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args);
      }
      timer = null; // 执行完毕后重置
    }, delay);
  };
}
