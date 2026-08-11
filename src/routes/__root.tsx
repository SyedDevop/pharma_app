import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FontSizeControl } from "@/components/my-ui/fontSizeControl";

const RootLayout = () => (
  <div className="flex min-h-screen flex-col">
    <header
      data-tauri-drag-region
      className="sticky top-0 z-20 flex h-11 items-center justify-between border-b bg-background px-4"
    >
      <Link to="/" className="font-semibold">
        Pharma App
      </Link>
      <FontSizeControl />
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
