import { createBrowserRouter, redirect, type RouteObject } from "react-router";
import type { ComponentType } from "react";

interface RouteMeta {
  path: string;
  auth?: boolean;
  roles?: string[];
}

type RouteComponent = ComponentType<unknown> & {
  route?: RouteMeta;
};

interface PageModule {
  default: RouteComponent;
}

const modules: Record<string, PageModule> = import.meta.glob<PageModule>(
  "@/presentation/views/**/*.page.tsx",
  { eager: true }
);

console.log("🔍 Импортированные модули:");
for (const [key, mod] of Object.entries(modules)) {
  console.log("—", key, "=>", mod.default?.route);
}
const routes = Object.values(modules)
  .map((mod): RouteObject | null => {
    const Component = mod.default;
    const meta = Component.route;

    if (!meta?.path) return null;

    return {
      path: meta.path,
      element: <Component />,
      loader: meta.auth
        ? async () => {
            const token = localStorage.getItem("token");
            if (!token) throw redirect("/login");

            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (meta.roles && !meta.roles.includes(user.role)) {
              throw redirect("/403");
            }

            return null;
          }
        : undefined,
    };
  })
  .filter((route): route is RouteObject => route !== null);

export const router = createBrowserRouter(routes);
