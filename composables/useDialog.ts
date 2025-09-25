import { defineStore } from "pinia";

type DialogCallback = {
  onTapBack: () => void;
  onTapConfirm: () => void;
};
  
type DialogParams = {
  title: string;
  content: string;
  confirmText: string | null;
  backText: string | null;
  callback: DialogCallback;
};
  
export const useDialog = defineStore("dialog", {
  state: () => ({
    isShown: <boolean>false,
    title: <string>"",
    content: <string>"",
    confirmText: <string>"",
    backText: <string>"",
    callback: <DialogCallback>{}
  }),

  actions: {
    getDefaultCallback() {
      return {
        onTapBack: () => {
          this.hideDialog();
        },
        onTapConfirm: () => {
          this.hideDialog();
        },
      };
    },

    showDialog() {
      this.isShown = true;
    },

    hideDialog() {
      this.isShown = false;
    },

    setCallback(callback: DialogCallback | null = null) {
      this.callback = this.getDefaultCallback();
      if (callback) {
        this.callback = callback;
      }
    },

    show(params: DialogParams) {
      this.title = params.title;
      this.content = params.content;

      if (params.confirmText) {
        this.confirmText = params.confirmText;
      }

      if (params.backText) {
        this.backText = params.backText;
      }

      if (!params.callback) {
        params.callback = {
          onTapBack: () => {
            this.hideDialog();
          },
          onTapConfirm: () => {
            this.hideDialog();
          }
        }
      }

      this.setCallback(params.callback);
      this.showDialog();
    }
  }
});
