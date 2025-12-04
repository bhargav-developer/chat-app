"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import React, { useRef, useState } from "react";
import { PinIcon } from "lucide-react";

/* ───────────── ROOT NAVBAR ───────────── */
export const Navbar = ({
  children,
  className,
  pinned,
}: {
  children: React.ReactNode;
  className?: string;
  pinned?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref });

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!pinned) setVisible(latest > 90);
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        `${pinned ? "absolute" : "fixed"} inset-x-0 top-0 z-50 w-full`,
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { visible })
          : child
      )}
    </motion.div>
  );
};

/* ───────────── DESKTOP NAV BODY ───────────── */
export const NavBody = ({
  children,
  className,
  visible,
  pinned,
  setPinned,
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  pinned: boolean;
  setPinned: (v: boolean) => void;
}) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(12px)" : "none",
      width: visible ? "50%" : "100%",
      y: visible ? 14 : 32,
    }}
    transition={{ type: "spring", stiffness: 190, damping: 38 }}
    className={cn(
      "mx-auto hidden max-w-7xl w-full lg:flex items-center justify-between rounded-full px-6 py-3",
      visible && "bg-black/50 border border-white/20 shadow-[0_0_18px_rgba(255,255,255,0.08)]",
      className
    )}
  >
    {children}


    {/* <div className="flex items-center gap-4">
      {(!visible || pinned) && (
        <button
          onClick={() => setPinned(!pinned)}
          className="rounded-md p-[6px] bg-white/10 hover:bg-white/20 transition"
          title={pinned ? "Unpin navbar" : "Pin navbar"}
        >
          <PinIcon
            size={16}
            className={`${pinned ? "text-fuchsia-400 rotate-45" : "text-white/70"} transition`}
          />
        </button>
      )}

    </div> */}
  </motion.div>
);

/* ───────────── NAV ITEMS ───────────── */
export const NavItems = ({
  items,
  className,
  onItemClick,
}: {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn("flex flex-row gap-2 items-center text-sm font-medium", className)}
    >
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          onClick={onItemClick}
          onMouseEnter={() => setHovered(idx)}
          className="relative px-4 py-2 transition"
        >
          {hovered === idx && (
            <motion.div
              layoutId="nav-hover"
              className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md"
            />
          )}
          <span
            className={cn(
              "relative z-20 font-semibold",
              hovered === idx
                ? "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
                : "text-white/85 hover:text-white"
            )}
          >
            {item.name}
          </span>
        </a>
      ))}
    </motion.div>
  );
};

/* ───────────── MOBILE NAV ───────────── */
export const MobileNav = ({ children, className, visible }: any) => (
  <motion.div
    animate={{ y: visible ? 12 : 28, width: visible ? "92%" : "100%" }}
    transition={{ type: "spring", stiffness: 180, damping: 38 }}
    className={cn(
      "mx-auto flex lg:hidden w-full flex-col items-center justify-between px-3 py-2",
      visible && "bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg",
      className
    )}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({ children }: any) => (
  <div className="flex w-full justify-between items-center">{children}</div>
);

export const MobileNavMenu = ({ children, isOpen }: any) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="absolute top-16 inset-x-0 z-50 flex flex-col gap-4 rounded-xl 
        bg-black/60 backdrop-blur-xl border border-fuchsia-500/25 px-6 py-8 shadow-[0_0_30px_rgba(236,72,153,0.45)]"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({ isOpen, onClick }: any) =>
  isOpen ? <IconX className="text-white" onClick={onClick} /> : <IconMenu2 className="text-white" onClick={onClick} />;

/* ───────────── LOGO + BUTTON ───────────── */
export const NavbarLogo = () => (
  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
    ChatSync
  </span>
);

export const NavbarButton = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { className?: string }) => (
  <button
    {...props}
    className={cn(
      "px-5 py-2 text-sm font-semibold rounded-xl transition duration-200",
      "bg-black/40 border border-white/20 text-white hover:border-fuchsia-400 hover:scale-[1.03]",
      className
    )}
  >
    {children}
  </button>
);
