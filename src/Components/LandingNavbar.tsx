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

  const logo = (
    <span
      className="cursor-pointer text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
      onClick={() => router.push("/")}
    >
      ChatSync
    </span>
  );

  return (
    <Navbar className="fixed flex  px-20 m-10 top-0 bg-black/60 backdrop-blur-xl">
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} className="text-fuchsia-300" />

        <div className="flex items-center gap-4">
          <NavbarButton
            variant="secondary"
            onClick={() => router.push("/login")}
            className="text-white border-white/30 hover:border-fuchsia-400"
          >
            Login
          </NavbarButton>

          <NavbarButton
            variant="primary"
            onClick={() => router.push("/login")}
            className="
              bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500
              text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]
              hover:shadow-[0_0_35px_rgba(236,72,153,0.75)]
            "
          >
            Start Free
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo/>

          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-neutral-200 hover:text-fuchsia-400 transition text-lg"
            >
              {item.name}
            </a>
          ))}

          <NavbarButton
            className="w-full border-white/30 hover:border-fuchsia-400"
            variant="secondary"
            onClick={() => {
              setIsMobileMenuOpen(false);
              router.push("/login");
            }}
          >
            Login
          </NavbarButton>

          <NavbarButton
            className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white"
            variant="primary"
            onClick={() => {
              setIsMobileMenuOpen(false);
              router.push("/login");
            }}
          >
            Start Free
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default LandingNavbar;
