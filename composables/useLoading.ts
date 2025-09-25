import { defineStore } from "pinia";

export const useLoading = defineStore("loading", {
  state: () => ({
    isLoading: <boolean>false
  }),

  actions: {
    show() {
      this.isLoading = true;
    },

    hide() {
      this.isLoading = false;
    },
  },
});
