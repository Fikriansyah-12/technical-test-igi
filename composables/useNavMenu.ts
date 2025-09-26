export type Role = "user" | "admin";

export interface NavItem {
  label: string;
  to?: string;
  exact?: boolean;
  children?: NavItem[];
  onClick?: () => void;
  show?: boolean;
  icon?: string;
}

export function useNavMenu(role: Role, isAuthenticated = false) {
  const userMenu: NavItem[] = [
    { label: "Beranda", to: "/", exact: true },
    { label: "Kategori", to: "/categori" },
    { label: "Produk", to: "/produk" },
    { label: "Promo", to: "/promo" },
    {
      label: "Pesanan Saya",
      to: isAuthenticated ? "/akun/pesanan" : "/auth/login",
      show: true,
    },
  ];

  const adminMenu: NavItem[] = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      exact: true,
      icon: "mdi:view-dashboard-outline",
    },
    { label: "Products", to: "/admin/products", icon: "mdi:package-variant" },
    {
      label: "Orders",
      to: "/admin/orders",
      icon: "mdi:clipboard-text-outline",
    },
    {
      label: "Users",
      to: "/admin/users",
      icon: "mdi:account-multiple-outline",
    },
    { label: "Reports", to: "/admin/reports", icon: "mdi:chart-bar" }, // opsional
    { label: "Settings", to: "/admin/profile", icon: "mdi:cog-outline" },
  ];

  const items = role === "admin" ? adminMenu : userMenu;
  return { items };
}
