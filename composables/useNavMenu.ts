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

  ];

  const adminMenu: NavItem[] = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      exact: true,
      icon: "mdi:view-dashboard-outline",
    },
    { label: "Products", to: "/admin/product", icon: "mdi:package-variant" },
    {
      label: "Users",
      to: "/admin/users",
      icon: "mdi:account-multiple-outline",
    },
  ];

  const items = role === "admin" ? adminMenu : userMenu;
  return { items };
}
