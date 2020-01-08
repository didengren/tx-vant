import axios from "./axios";
import { Message } from "element-ui";

export const fetch = function({ url, method, parameter, moreConfig = {} }) {
  console.log(`fetching ${url}...`);
  return new Promise((resolve, reject) => {
    axios[method](url, parameter, moreConfig)
      .then((res) => {
        if (res.data.bizcode === 10000) {
          const val = res.data;
          resolve(val);
        } else {
          Message({
            message: res.data.data,
            type: "error",
            duration: 2000
          });
          reject(res.data.data);
        }
      }, reject)
      .catch((error) => {
        console.log("xhr_error____", error);
        // document.writeln("Error name: " + err.name + "");
        // document.writeln("Error message: " + err.message);
      });
  });
};

/**
 * todo
 * 请求从缓存读取
 */
