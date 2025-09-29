// stores/cart.ts
import { defineStore } from "pinia";
import { mapJsonToProduct, type Product } from "~/models/Product";
import type { TProduct } from "~/types/apiResponse";

type CartItemApi = { productId: number; quantity: number };
type CartApi = {
  id: number;
  userId: number;
  date: string;
  products: CartItemApi[];
};

export const useCart = defineStore("cart", {
  state: () => ({
    activeCartId: null as number | null,
    cart: null as CartApi | null,
    carts: [] as CartApi[],

    loading: { list: false, detail: false, mutate: false } as Record<
      "list" | "detail" | "mutate",
      boolean
    >,
    error: { list: null, detail: null, mutate: null } as Record<
      "list" | "detail" | "mutate",
      string | null
    >,

    productCache: new Map<number, Product>(),
  }),

  getters: {
    count: (s) =>
      s.cart ? s.cart.products.reduce((a, b) => a + b.quantity, 0) : 0,
    isEmpty: (s) => !s.cart || s.cart.products.length === 0,
    linesDetailed: (s) =>
      s.cart
        ? s.cart.products.map((l) => ({
            ...l,
            product: s.productCache.get(l.productId),
          }))
        : [],
    subtotal: (s) =>
      s.cart
        ? s.cart.products.reduce((sum, l) => {
            const p = s.productCache.get(l.productId);
            return sum + (p?.price ?? 0) * l.quantity;
          }, 0)
        : 0,
  },

  actions: {
    async getCarts() {
      const api = useApi();
      this.loading.list = true;
      this.error.list = null;
      try {
        const { data } = await api.get<CartApi[]>({ url: "/carts" });
        this.carts = data;
        return data;
      } catch (err: any) {
        this.error.list = err?.message ?? "Failed to fetch carts";
        useApi().handleError(err);
        return [];
      } finally {
        this.loading.list = false;
      }
    },

    // ========== DETAIL CART ==========
    async getCart(id: number | string) {
      const api = useApi();
      this.loading.detail = true;
      this.error.detail = null;
      try {
        const { data } = await api.get<CartApi>({ url: `/carts/${id}` });
        this.cart = data;
        this.activeCartId = data.id;
        return data;
      } catch (err: any) {
        this.error.detail = err?.message ?? "Failed to fetch cart";
        useApi().handleError(err);
        return null;
      } finally {
        this.loading.detail = false;
      }
    },

    // (optional) ambil cart milik user
    async getUserCarts(userId: number) {
      const api = useApi();
      this.loading.list = true;
      this.error.list = null;
      try {
        const { data } = await api.get<CartApi[]>({
          url: `/carts/user/${userId}`,
        });
        this.carts = data;
        return data;
      } catch (err: any) {
        this.error.list = err?.message ?? "Failed to fetch user carts";
        useApi().handleError(err);
        return [];
      } finally {
        this.loading.list = false;
      }
    },

    // ========== ENSURE CART (buat cart kalau belum ada) ==========
    async ensureCart(userId: number) {
      if (this.activeCartId && this.cart) return this.cart;
      const api = useApi();
      this.loading.mutate = true;
      this.error.mutate = null;
      try {
        const body = {
          userId,
          date: new Date().toISOString(),
          products: [] as CartItemApi[],
        };
        const { data } = await api.post<CartApi>({
          url: "/carts",
          params: body,
        });
        this.cart = data;
        this.activeCartId = data.id;
        return data;
      } catch (err: any) {
        this.error.mutate = err?.message ?? "Failed to create cart";
        useApi().handleError(err);
        return null;
      } finally {
        this.loading.mutate = false;
      }
    },

    // ========== ADD / UPDATE / REMOVE ITEM ==========
    async addItem(userId: number, productId: number, qty = 1) {
      const cart = await this.ensureCart(userId);
      if (!cart) return null;

      const q = Math.max(1, Number(qty) || 1);
      const products = [...cart.products];
      const i = products.findIndex((p) => p.productId === productId);
      if (i !== -1)
        products[i] = { ...products[i], quantity: products[i].quantity + q };
      else products.unshift({ productId, quantity: q });

      return this._saveCart(products);
    },

    async setQuantity(productId: number, qty: number) {
      if (!this.cart) return null;
      const q = Math.max(1, Number(qty) || 1);
      const products = this.cart.products.map((p) =>
        p.productId === productId ? { ...p, quantity: q } : p
      );
      return this._saveCart(products);
    },

    async removeItem(productId: number) {
      if (!this.cart) return false;
      const products = this.cart.products.filter(
        (p) => p.productId !== productId
      );
      return !!(await this._saveCart(products));
    },

    async clearCart() {
      if (!this.cart) return false;
      return !!(await this._saveCart([]));
    },

    async _saveCart(products: CartItemApi[]) {
      const api = useApi();
      if (!this.cart) return null;
      this.loading.mutate = true;
      this.error.mutate = null;
      try {
        const body = {
          userId: this.cart.userId,
          date: new Date().toISOString(),
          products,
        };
        const { data } = await api.put<CartApi>({
          url: `/carts/${this.cart.id}`,
          params: body,
        });
        this.cart = data;
        this.activeCartId = data.id;
        return data;
      } catch (err: any) {
        this.error.mutate = err?.message ?? "Failed to save cart";
        useApi().handleError(err);
        return null;
      } finally {
        this.loading.mutate = false;
      }
    },

    async hydrateCartProducts() {
      const api = useApi();
      const ids = [
        ...new Set((this.cart?.products ?? []).map((p) => p.productId)),
      ];
      for (const id of ids) {
        if (!this.productCache.has(id)) {
          const { data } = await api.get<TProduct>({ url: `/products/${id}` });
          this.productCache.set(id, mapJsonToProduct(data));
        }
      }
    },
  },
});
