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
  { title: "About", href: "/about" },
];

const NavbarHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 px-4",
        scrolled ? "bg-white shadow-md" : "bg-transparent py-3",
      )}
    >
      <div className="section-container my-0! flex items-center justify-between">
        <AppLogo />

        <div className="hidden lg:flex text-lg space-x-2 font-bold items-center">
          {navBarLinks.map(({ title, href }) => (
            <NavBarLink key={title} title={title} href={href} />
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <SearchDialog />
          <UserAuthButton />
        </div>

        <div className="lg:hidden flex items-center gap-x-2">
          <SearchDialog />
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
