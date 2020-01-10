import Vue from "vue";
import Vuex from "vuex";
import { throttle } from "@/tools/utils";
import modules from "./module";

Vue.use(Vuex);

Vuex.Store.prototype.preDispatch = throttle(function(...args) {
  if (!(this instanceof Vuex.Store)) return;
  if (!!this.unsubscribeAction) this.unsubscribeAction();
  const that = this;
  this.unsubscribeAction = that.subscribeAction({
    before: (action, state) => {},
    after: (action, state) => {
      console.log("action_____", that);
      if (args[0] === action.type && typeof args[2] === "function")
        args[2](action, state);
    }
  });
  return that.dispatch(...args);
}, process.env.VUE_APP_THROTTLE_WAIT);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: modules
});
