import { useLocalStorage } from "@vueuse/core";
import type { AxiosError } from "axios";
import { mapJsonToUser, type User } from "~/models/User";
import { mapJsonToUserAuth, type UserAuth } from '~/models/UserAuth';
import type { TUser, TUserAuth } from "~/types/apiResponse";

type Callback = () => void;

type LogoutParameters = {
  callback?: Callback | null;
  next?: string;
};

export enum AuthResponseCode {
  // EMAIL_IS_EXISTS = 200,
  // USER_NOT_EXISTS = 10,
  USER_NOT_FOUND = 400,
  USER_IS_BANNED = 20,
}

export const useUserData = () => {
  return useLocalStorage("user_data", {} as UserAuth);
}

export const useAuth = defineStore("auth", {
  state: () => ({
    token: <string | null>null,
    user: <User | null>null,
    form: {
      phone: <string>"",
      otpCode: <string>""
    },
    revealSection: <boolean>false
  }),
  actions: {
    async loginWithPhone() {
      const api = useApi();
      const _loading = useLoading();
      const _snackbar = useSnackbar();
      const _dialog = useDialog();

      if(this.form.phone === "" || this.form.phone.length <= 6) {
        _snackbar.error({
          title: "Invalid Phone Number",
          message: "Please enter a valid phone number.",
          buttonText: "Retry"
        });
        return;
      }

      try {
        _loading.show();

        await api.post({
          url: "/api/web/auth/login-using-hwg",
          params: {
            phone_number: this.form.phone
          }
        });

        _loading.hide();
        navigateTo("/auth/verify");
      } catch (error) {
        // api.handleError(error);
        const err = error as AxiosError;

        // if user is not found with entered phone number
        if(err.response?.status === AuthResponseCode.USER_NOT_FOUND) {
          _dialog.show({
            title: "Cannot find user",
            content: "User not found with this phone number",
            confirmText: "Register",
            backText: "Try Again",
            callback: {
              onTapBack() {
                _dialog.hideDialog();
              },
              onTapConfirm() {
                navigateTo("/auth/register");
                _dialog.hideDialog();
              },
            },
          });
        }
        _loading.hide();
      }
    },
    async verifyPhoneNumber() {
      const api = useApi();
      const _loading = useLoading();

      _loading.show();
      try {
        const { response } = await api.post({
          url: "/api/web/auth/login-using-hwg-confirmation", 
          params: {
            phone_number: this.form.phone,
            confirmation_code: this.form.otpCode,
          }
        });

        _loading.hide();

        // set user data
        this.setUserData(response.data.data);
        navigateTo("/profile/my-account", { external: true });

        this.$reset();
      } catch (error) {
        _loading.hide();
        api.handleError(error);
      }
    },
    setUserData(apiResponse: TUserAuth) {
      const userData = useUserData();
      userData.value = mapJsonToType(apiResponse, mapJsonToUserAuth);
    },
    async getProfile() {
      const api = useApi();

      try {
        const { response } = await api.get<TUser>({
          url: "/api/web/users/profile"
        })

        this.user = mapJsonToType(response.data.data, mapJsonToUser);
        this.revealSection = true;

        return this.user;
      } catch (error) {
        api.handleError(error);
      }
    },
    async setToken(token: string) {
      const userData = useUserData();
      userData.value.token = await token;
      this.refresh();
    },
    setUser(user: User) {
      const userData = useUserData();
      userData.value.user = user;
      this.refresh();
    },
    refresh() {
      const userData = useUserData();
      this.token = userData.value.token;
      this.user = userData.value.user;
    },
    isLoggedIn(): boolean {
      this.refresh();

      if(!this.token) return false;
      return true;
    },
    logout({ callback = null, next = "" }: LogoutParameters) {
      const userData = useUserData();
      userData.value = {
        token: null,
        user: null,
      }

      this.refresh();
      if (callback) {
        callback();
        return;
      }

      if (next) navigateTo(next);
    }
  }
});
