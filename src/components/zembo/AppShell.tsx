import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TabBar } from "./TabBar";
import { CreateSheet } from "./CreateSheet";

const TABS = ["/", "/live", "/messages", "/profile"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [createOpen, setCreateOpen] = useState(false);
  const isTab = TABS.includes(pathname);
  const isThread = pathname.startsWith("/messages/");
  const isTable = pathname.startsWith("/table/");
  const isGame = pathname.startsWith("/play/") || pathname.startsWith("/face-a-face");
  const isSetup = pathname.startsWith("/talk-show/config") || pathname.startsWith("/talk-show/preview");
  const isSlam = pathname.startsWith("/talk-show/slam-therapie");
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/connexion") || pathname === "/signup" || pathname === "/login";
  const isWorld = pathname.startsWith("/world");
  const isWorldDiscover = pathname === "/world/discover";
  const isLiveShow =
    pathname.startsWith("/talk-show/storytime") ||
    pathname.startsWith("/talk-show/micro-ouvert") ||
    pathname.startsWith("/talk-show/stand");
  const noDock =
    isThread || isGame || isLiveShow || isSlam || isAdmin || isAuth || (isWorld && !isWorldDiscover);



  return (
    <div className="flex min-h-[100dvh] justify-center bg-[oklch(0.05_0_0)]">
      <div className="relative w-full max-w-[430px] overflow-hidden bg-background">
        <div className="relative h-[100dvh] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.main
              key={pathname}
              initial={isTab ? { opacity: 0, y: 8 } : { opacity: 0, x: 60 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={isTab ? { opacity: 0, y: -6 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              className={cn(
                "h-full",
                isThread || isTable || isLiveShow || isSetup || isSlam || isAdmin || isAuth || isWorldDiscover
                  ? "overflow-hidden"
                  : isGame || isWorld
                    ? "app-scroll"
                    : "app-scroll pb-[112px]",
              )}

            >

              {children}
            </motion.main>
          </AnimatePresence>

          {!noDock && <TabBar onCreate={() => setCreateOpen(true)} />}

          <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
      </div>
    </div>
  );
}
