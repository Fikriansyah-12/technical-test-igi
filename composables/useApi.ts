import Axios, { type AxiosResponse } from "axios";

type Request = {
  url: string;
  params?: Record<string, any>;
};

type Response<T> = {
  data: T,
  response: AxiosResponse,
}
export const useApi = definePiniaStore("api", () => {
  const config = useRuntimeConfig();
  const axios = Axios;

  const snackbar = useSnackbar();
  const userData = useUserData();
  const auth = useAuth();

  axios.defaults.baseURL = config.public.baseUrl;

  setHeader();

  function setHeader() {
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    if (userData.value.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.value.token}`;
    }
    // axios.defaults.headers.common["lang"] = "en";
  }

  function get<T>({url, params = {}}: Request): Promise<Response<T>> {
    setHeader();
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params })
        .then((response) => resolve({ data: response.data.data, response }))
        .catch((error) => reject(error));
    });
  }

  function post<T>({url, params = {}}: Request): Promise<Response<T>> {
    setHeader();
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((response) => resolve({ data: response.data.data, response }))
        .catch((error) => reject(error));
    });
  }

  function put<T>({url, params = {}}: Request): Promise<Response<T>> {
    setHeader();
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((response) => resolve({ data: response.data.data, response }))
        .catch((error) => reject(error));
    });
  }

  function uploadFile({ url, params = {} }: Request) {
    const formData = new FormData();
    const keys = Object.keys(params);

    for (let i = 0; i < keys.length; i++) {
      formData.append(keys[i], params![keys[i]]);
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, formData, {
          headers: {
            Accept: "application/json",
            ContentType: "multipart/form-data",
          },
        })
        .then((response) => {
          resolve({ data: response.data.data, response });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function handleError(error: any): boolean {
    let handled = false;
    console.error(error);
    if (!error.response) {
      snackbar.error({ 
        title: "Error" ,
        message: "Failed to fetch data.",
        buttonText: "Close"
      });
      return true;
    }

    if (error.response?.status == 422) {
      const errors = error.response.data.data;
      const message: string[] = [];

      Object.keys(errors).forEach((key) => {
        if (errors[key] instanceof Array) {
          message.push(errors[key][0]);
        }
      });

      snackbar.error({
        title: "Error",
        message: `${message.join("<br>")}`,
        buttonText: "Close"
      });
      handled = true;
    } else if (error.response?.status == 503) {
      snackbar.error({
        title: "Server under maintenance",
        message: "Please try again later",
        buttonText: "Close"
      });
      handled = true;
    } else if (error.response?.status >= 500) {
      snackbar.error({
        title: "Whoops",
        message: "Server error. Please try again later.",
        buttonText: "Close"
      });
      handled = true;
    } else if (error.response?.status == 401) {
      snackbar.error({
        title: "Session Expired",
        message: "Please try logging in again",
        buttonText: "Continue",
        callback: () => {
          auth.logout({
            callback() {
              navigateTo("/auth/login", { external: true });
            },
          });
        },
      });
      handled = true;
    } else if (error.response?.status == 400) {
      const code = error.response.data.data.code;
      if (code == "refresh_required") {
        window.location.reload();
        return true;
      } else {
        snackbar.error({
          title: "Bad Request",
          message: error.response.data.data.message,
          buttonText: "Close"
        });

        handled = true;
      }
    } else {
      // Handle other error
    }

    return handled;
  }


  return {
    get,
    post,
    put,
    handleError,
    uploadFile,
  };
});
