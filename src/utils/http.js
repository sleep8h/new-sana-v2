import request from './request'

const buildQueryString = (params = {}) => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求参数
 * @param {object} config - 额外配置
 * @returns {Promise}
 */
export function get(url, params = {}, config = {}) {
  return request({
    url,
    method: 'get',
    params,
    ...config
  })
}

/**
 * POST请求 - application/json
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} config - 额外配置
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
  return request({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    ...config
  })
}

/**
 * POST请求 - application/x-www-form-urlencoded
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} config - 额外配置
 * @returns {Promise}
 */
export function postForm(url, data = {}, config = {}) {
  return request({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [(data) => {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret.slice(0, -1)
    }],
    ...config
  })
}

/**
 * POST请求 - multipart/form-data
 * @param {string} url - 请求地址
 * @param {FormData} formData - FormData对象
 * @param {object} config - 额外配置
 * @returns {Promise}
 */
export function postFormData(url, formData, config = {}) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config
  })
} 


// x-www-form-urlencoded 格式 POST 请求
export const postUrlEncoded = async (url, data = {}, config = {}) => {
  const encodedData = buildQueryString(data);
  return request({
    url,
    method: 'post',
    data: encodedData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    ...config
  })
};