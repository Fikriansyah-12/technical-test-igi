import { defineStore } from "pinia";

type Callback = () => void;

type SnackbarParams = {
  title: string | null;
  message: string;
  buttonText: string;
  callback?: Callback;
};

export const useSnackbar = defineStore("snackbar", {
  state: () => ({
    isShown: <boolean>false,
    isSuccess: <boolean>false,
    message: <string>"",
    title: <string | null>null,
    buttonText: <string>"OK",
    callback: <Callback | null>null,
  }),

  actions: {
    // Action to handle snackbar exit (e.g., when the button is clicked)
    tapExit() {
      if (this.callback) {
        this.callback(); // Call the callback function if it exists
      }
      this.resetSnackbar(); // Hide the snackbar and reset state
    },

    // Set a callback function for the snackbar
    setCallback(callback = () => {}) {
      this.callback = callback;
    },

    // Reset snackbar state to default values
    resetSnackbar() {
      this.isShown = false;
      this.isSuccess = false;
      this.message = "";
      this.title = null;
      this.buttonText = "OK";
      this.callback = null;
    },

    // Show a success snackbar
    success(params: SnackbarParams) {
      this.resetSnackbar(); // Reset state to default values
      this.isShown = true; // Show the snackbar
      this.isSuccess = true; // Set success state

      this.title = params.title; // Set the snackbar title
      this.message = params.message; // Set the snackbar message
      this.buttonText = params.buttonText; // Set the button text
      this.setCallback(params.callback); // Set the callback function, if provided
    },

    // Show an error snackbar
    error(params: SnackbarParams) {
      this.resetSnackbar(); // Reset state to default values
      this.isShown = true; // Show the snackbar
      this.isSuccess = false; // Set success state

      this.title = params.title; // Set the snackbar title
      this.message = params.message; // Set the snackbar message
      this.buttonText = params.buttonText; // Set the button text
      this.setCallback(params.callback); // Set the callback function, if provided
    }
  },
});
