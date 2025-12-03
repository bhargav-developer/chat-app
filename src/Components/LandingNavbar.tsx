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
import { useState } from "react";
import { useRouter } from "next/navigation";

const LandingNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "FAQ", link: "#faq" },
  ];

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />

        <NavItems items={navItems} />

        <div className="flex items-center gap-4">
          <NavbarButton onClick={() => router.push("/login")}>
            Login
          </NavbarButton>

          <NavbarButton
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.55)]"
          >
            Start Free
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
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
