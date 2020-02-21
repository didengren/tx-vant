import axios from "./axios";
import { Toast } from "vant";
import qs from "qs";

const promiseHandler = (future, resolve, reject) => {
  future
    .then(
      (res) => {
        if (res.data.bizcode === 10000) resolve(res.data);
        else {
          Toast.fail(res.data.bizmsg);
        }
      },
      (err) => {
        throw err;
      }
    )
    .catch((err) => {
      reject(err);
      console.error("fetch error:", err);
    });
};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const get = function(url, params = {}) {
  if (process.env.VUE_APP_TEMP_TOKEN)
    params.access_token = process.env.VUE_APP_TEMP_TOKEN;
  return new Promise((resolve, reject) => {
    let future = axios.get(url, {
      params: params,
      paramsSerializer: (params) =>
        qs.stringify(params, {
          indices: false
        })
    });
    promiseHandler(future, resolve, reject);
  });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const post = function(url, params = {}) {
  return new Promise((resolve, reject) => {
    let future = axios.post(url, params);
    promiseHandler(future, resolve, reject);
  });
};

/**
 * post方法，参数序列化 e.g. user=xx&pwd=xxx
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const qsPost = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    let future = axios.post(url, qs.stringify(params));
    promiseHandler(future, resolve, reject);
  });
};

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const put = function(url, params = {}) {
  return new Promise((resolve, reject) => {
    let future = axios.put(url, params);
    promiseHandler(future, resolve, reject);
  });
};

/**
 * delete
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const del = function(url, params = {}) {
  return new Promise((resolve, reject) => {
    let future = axios.delete(url, params);
    promiseHandler(future, resolve, reject);
  });
};

// axios的全局方法
export const fetch = function({ url, method, parameter, moreConfig = {} }) {
  console.log(`fetching ${url}...`);
  return new Promise((resolve, reject) => {
    let future = axios[method](url, parameter, moreConfig);
    promiseHandler(future, resolve, reject);
  });
};

/**
 * todo
 * 请求从缓存读取
 */
