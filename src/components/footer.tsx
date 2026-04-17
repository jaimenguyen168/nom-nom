"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppLogo from "@/components/app-logo";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-8 md:px-12 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <AppLogo />
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              A place for food lovers to create, discover, and share recipes and
              stories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-sm space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Explore</h3>
            <ul className="space-y-1.5 text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-primary-200">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary-200">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary-200">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Create */}
          <div className="text-sm space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">Create</h3>
            <ul className="space-y-1.5 text-gray-600">
              <li>
                <Link href="/recipes/new" className="hover:text-primary-200">
                  New Recipe
                </Link>
              </li>
              <li>
                <Link href="/blogs/new" className="hover:text-primary-200">
                  New Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes/new?agent=true"
                  className="text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text font-medium"
                >
                  Inspire Recipe ✨
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs/new?agent=true"
                  className="text-transparent bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text font-medium"
                >
                  Inspire Blog ✨
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 text-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Newsletter</h3>
            <p className="text-xs text-gray-500 mb-3">
              Get recipes and tips delivered to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  type="email"
                  placeholder="Your email"
                  className="pl-9 h-9 bg-white text-sm"
                />
              </div>
              <Button className="h-9 bg-primary-200 hover:bg-primary-300 text-white text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} NomNom. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-primary-200">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary-200">
              Contact
            </Link>
            <Link href="/terms-privacy" className="hover:text-primary-200">
              Terms & Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
