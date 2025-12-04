"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PinIcon } from "lucide-react";

const LandingNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [pinned, setPinned] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Testimonials", link: "#testimonials" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!pinned) setIsShrunk(window.scrollY > 90);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pinned]);

  return (
    <Navbar pinned={pinned} className="px-2">
      {/* Desktop */}
      <NavBody pinned={pinned} setPinned={setPinned} visible={isShrunk} className="text-sm">
        {/* LEFT */}
        <NavbarLogo />
        <NavItems items={navItems} />

        {/* RIGHT — Pin + Login + Start */}
        <div className="flex  items-center gap-4">
          {(!isShrunk || pinned) && (
            <button
              onClick={() => setPinned(!pinned)}
              className="rounded-md cursor-pointer p-[6px] bg-white/10 hover:bg-white/20 transition"
              title={pinned ? "Unpin navbar" : "Pin navbar"}
            >
              <PinIcon
                size={16}
                className={`${pinned ? "text-fuchsia-400 rotate-45" : "text-white/70"} transition`}
              />
            </button>
          )}

          <NavbarButton onClick={() => router.push("/login")}>Login</NavbarButton>

          <NavbarButton
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.55)]"
          >
            Start Free
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav visible={isShrunk}>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white text-lg transition font-semibold"
            >
              {item.name}
            </a>
          ))}

          <NavbarButton onClick={() => router.push("/login")} className="w-full">
            Login
          </NavbarButton>

          <NavbarButton
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.55)]"
          >
            Start Free
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default LandingNavbar;
