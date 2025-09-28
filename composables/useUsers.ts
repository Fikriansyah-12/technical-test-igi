import { mapJsonToUser, type User } from "~/models/User";
import type { TUser } from "~/types/apiResponse";

type UserInput = {
  username: string;
  email: string;
  password: string;
};

export const useUsers = defineStore("users", {
  state: () => ({
    users: [] as User[],
    user: null as User | null,
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async getUsers() {
      const api = useApi();
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get<TUser[]>({ url: "/users" });
        this.users = data.map(mapJsonToUser);
        return this.users;
      } catch (err: any) {
        api.handleError(err);
        this.error = err?.message ?? "Failed to fetch users";
        return [];
      } finally {
        this.loading = false;
      }
    },
  // stores/users.ts
async getUser(id: number | string) {
  const api = useApi()
  this.loading = true
  this.error = null
  try {
    const { data } = await api.get<TUser>({ url: `/users/${id}` })
    this.user = mapJsonToUser(data)
    return this.user
  } catch (err: any) {
    const local = this.users.find(u => u.id === Number(id)) ?? null
    this.user = local                  
    if (!local) this.error = err?.message ?? 'Failed to fetch user'
    return local
  } finally {
    this.loading = false
  }
},
    async createUser(input: UserInput) {
      const api = useApi();
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<{ id: number }>({
          url: "/users",
          params: input,
        });

        const created: User = {
          id:
            data?.id ??
            Math.max(0, ...this.users.map((u) => Number(u.id) || 0)) + 1,
          username: input.username,
          email: input.email,
          password: input.password,
        };

        this.users = [created, ...this.users];
        this.user = created;
        return created;
      } catch (err: any) {
        api.handleError(err);
        this.error = err?.message ?? "Failed to create user";
        return null;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id: number | string, input: Partial<UserInput>) {
      const api = useApi();
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put<TUser>({
          url: `/users/${id}`,
          params: input,
        });
        const updated = mapJsonToUser(data);

        const i = this.users.findIndex((p) => p.id === updated.id);
        if (i !== -1) this.users[i] = updated;

        if (this.user?.id === updated.id) this.user = updated;

        return updated;
      } catch (err: any) {
        api.handleError(err);
        this.error = err?.message ?? "Failed to update user";
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: number | string) {
      const api = useApi();
      this.error = null;
      this.loading = true;
      try {
        await api.del({ url: `/users/${id}` });
        const idNum = Number(id);
        this.users = this.users.filter((user) => user.id !== idNum);
        if (this.user?.id === idNum) this.user = null;
        return true;
      } catch (err: any) {
        api.handleError(err);
        this.error = err?.message ?? "Failed to delete user";
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
