import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { mapJsonToUser, type User } from "~/models/User"; 
import type { TUser } from "~/types/apiResponse";         

type Callback = () => void;
type LogoutParameters = { callback?: Callback | null; next?: string };

export const useUserData = () =>
  useLocalStorage<{ token: string | null; user: User | null }>("user_data", {
    token: null,
    user: null,
  });

export const useAuth = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    form: {
      username: "" as string,
      email: "" as string,
      password: "" as string,
    },
    revealSection: false as boolean,
  }),

  actions: {
    async register() {
      const api = useApi();
      const _loading = (globalThis as any).useLoading?.();
      const _snackbar = (globalThis as any).useSnackbar?.();

      if (!this.form.username || !this.form.email || !this.form.password) {
        _snackbar?.error?.({ title: "Missing fields", message: "Fill username, email, and password." });
        return;
      }

      try {
        _loading?.show?.();
        const body = {
          email: this.form.email,
          username: this.form.username,
          password: this.form.password,
        };

        const { data: created } = await api.post<any>({ url: "/users", params: body });

        this.setUser(
          mapJsonToUser({
            id: created.id,
            username: created.username,
            email: created.email ?? "",
            password: "",
          } as TUser)
        );

        _snackbar?.success?.({ title: "Registered", message: "User created." });
        navigateTo("/auth/login");
      } catch (e) {
        api.handleError(e);
      } finally {
        _loading?.hide?.();
      }
    },

async loginWithCredentials() {
  const api = useApi()
  const _snackbar = (globalThis as any).useSnackbar?.()

  if (!this.form.username || !this.form.password) {
    _snackbar?.error?.({ title: 'Missing credentials', message: 'Enter username & password.' })
    return
  }

  try {
    // 1) login ke FakeStore
    const { data: login } = await api.post<{ token: string }>({
      url: '/auth/login',
      params: { username: this.form.username, password: this.form.password },
    })
    await this.setToken(login.token)

    // 2) ambil user list lalu simpan user yg cocok
    const { data: users } = await api.get<any[]>({ url: '/users' })
    const found = users.find((u) => u.username === this.form.username)
    if (found) {
      this.setUser(
        mapJsonToUser({
          id: found.id,
          username: found.username,
          email: found.email ?? '',
          password: '',
        } as TUser)
      )
    }

    const uname = this.form.username.trim().toLowerCase()
    const isUser = uname === 'johnd' 

    navigateTo(isUser ? '/products' : '/admin/users', { replace: true })

    // bersihkan form
    this.form.username = ''
    this.form.password = ''
  } catch (e: any) {
    const status = e?.response?.status
    if (status === 401) {
      _snackbar?.error?.({ title: 'Login failed', message: 'Username or password is incorrect.' })
      return
    }
    useApi().handleError(e)
  }
},


    async setToken(token: string) {
      const userData = useUserData();
      userData.value.token = token;
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
      return !!this.token;
    },
    logout({ callback = null, next = "" }: LogoutParameters) {
      const userData = useUserData();
      userData.value = { token: null, user: null };
      this.refresh();
      if (callback) {
        callback();
        return;
      }
      if (next) navigateTo(next);
    },
  },
});
