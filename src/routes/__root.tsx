import { PillIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FontSizeControl } from "@/components/my-ui/fontSizeControl";

const RootLayout = () => (
  <>
    <header className="sticky top-0 z-20 flex h-11 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <PillIcon className="size-4" aria-hidden="true" />
        </span>
        <span className="font-semibold text-foreground text-sm tracking-tight">Pharma App</span>
      </div>
      <FontSizeControl />
    </header>
    <main>
      <Outlet />
    </main>
    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </>
);

export const Route = createRootRoute({ component: RootLayout });
