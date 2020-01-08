import Vue from "vue";
import { accMul, accDiv } from "@/tools/utils";

/**
 * 千分位
 *
 * @param el
 * @param digit       要转化的值
 * @param maxDigit    整数部分最大多少位
 * @param open        是否使用千分位
 * @param decimals    保留小数点几位
 */
function reformDigital(
  el,
  digit,
  { maxDigit = 100, open = true, decimals = 2 }
) {
  if (isNaN(Number(digit))) return;

  let completeObj;
  let pow = Math.pow(10, decimals);

  let objDeconstructArr = digit.replace(/^\s+|\s+$/g, "").split("");
  let which = objDeconstructArr.indexOf(".");
  let end = ~which ? which : undefined;
  let intPartObj = objDeconstructArr.slice(0, end);
  // console.log("maxDigit____", maxDigit);
  let numDigit = Number(digit);
  if (intPartObj.length > maxDigit) {
    numDigit = Number(repeat(9, maxDigit));
    let tempObj = Math.floor(accMul(numDigit, pow));
    let elseDecimalsObj = accDiv(tempObj, pow);
    completeObj = open
      ? elseDecimalsObj.toLocaleString() + "+"
      : elseDecimalsObj + "+";
  } else {
    let tempObj = Math.floor(accMul(numDigit, pow));
    let elseDecimalsObj = accDiv(tempObj, pow);
    completeObj = open ? elseDecimalsObj.toLocaleString() : elseDecimalsObj;
  }
  console.log("completeObj____", completeObj);
  el.innerHTML = completeObj;
}

function repeat(str, n) {
  return new Array(n + 1).join(str);
}

// 注册一个全局自定义指令 `v-digital-table`
Vue.directive("digitalTable", {
  // bind: function(el, binding, vnode, oldVnode) {
  //   if (typeof binding.value === "undefined") binding.value = {};
  //   if (vnode.children.length > 0 && vnode.children[0].text)
  //     reformDigital(el, vnode.children[0].text, binding.value);
  // },
  // inserted: function(el, binding, vnode, oldVnode) {
  //   if (typeof binding.value === "undefined") binding.value = {};
  //   if (vnode.children.length > 0 && vnode.children[0].text)
  //     reformDigital(el, vnode.children[0].text, binding.value);
  // },
  // update: function(el, binding, vnode, oldVnode) {
  //   if (typeof binding.value === "undefined") binding.value = {};
  //   if (vnode.children.length > 0 && vnode.children[0].text)
  //     reformDigital(el, vnode.children[0].text, binding.value);
  // },
  componentUpdated: function(el, binding, vnode, oldVnode) {
    if (typeof binding.value === "undefined") binding.value = {};
    if (vnode.children.length > 0 && vnode.children[0].text)
      reformDigital(el, vnode.children[0].text, binding.value);
  }
});
