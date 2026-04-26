"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AppLogo from "@/components/app-logo";
import UserAuthButton from "@/components/user-auth-button";
import SearchDialog from "@/components/search-dialog";

const navBarLinks = [
  { title: "Home", href: "/" },
  { title: "Recipes", href: "/recipes" },
  { title: "Categories", href: "/categories" },
  { title: "Blogs", href: "/blogs" },
  { title: "Pricing", href: "/pricing" },
  { title: "About", href: "/about" },
];

const NavbarHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 px-4",
        scrolled ? "bg-white shadow-md h-14" : "bg-transparent h-16",
      )}
    >
      {/* h-full + items-center = vertically center everything inside */}
      <div className="flex items-center h-full gap-2">
        {/* Logo — never shrinks */}
        <div className="shrink-0 mr-8">
          <AppLogo />
        </div>

        {/* Desktop centered nav links */}
        <div className="hidden lg:flex text-lg space-x-2 font-bold items-center absolute left-1/2 -translate-x-1/2">
          {navBarLinks.map(({ title, href }) => (
            <NavBarLink key={title} title={title} href={href} />
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <SearchDialog isOpen={searchOpen} onOpenChange={setSearchOpen} />
          <UserAuthButton />
        </div>

        {/* Mobile right side */}
        <div className="lg:hidden flex items-center gap-x-2 flex-1 min-w-0 justify-end">
          <SearchDialog isOpen={searchOpen} onOpenChange={setSearchOpen} />
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="size-6 text-black" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 mt-2"
              sideOffset={5}
            >
              {navBarLinks.map(({ title, href }) => (
                <DropdownMenuItem
                  key={title}
                  asChild
                  className="hover:bg-primary-200/30 focus:bg-primary-200/30"
                >
                  <Link
                    href={href}
                    className="w-full cursor-pointer justify-end font-semibold"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserAuthButton />
        </div>
      </div>
    </nav>
  );
};

export default NavbarHeader;

const NavBarLink = ({ title, href }: { title: string; href: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-black px-3 py-2 rounded-2xl hover:text-primary-200/80",
        isActive && "text-primary-200",
      )}
    >
      {title}
    </Link>
  );
};
