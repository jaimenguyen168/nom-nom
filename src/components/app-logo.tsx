import React from "react";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const AppLogo = ({ size = "md" }: AppLogoProps) => {
  const sizeClasses = {
    xs: {
      text: "text-sm",
      icon: "size-3",
    },
    sm: {
      text: "text-xl",
      icon: "size-4",
    },
    md: {
      text: "text-2xl",
      icon: "size-5",
    },
    lg: {
      text: "text-3xl",
      icon: "size-6",
    },
    xl: {
      text: "text-4xl",
      icon: "size-7",
    },
  };

  return (
    <Link
      href="/"
      className={cn("font-bold flex items-center", sizeClasses[size].text)}
    >
      <UtensilsCrossed
        className={cn(
          "text-primary-200",
          sizeClasses[size].icon,
          size !== "xs" ? "mr-2" : "mr-1",
        )}
      />

      <span className="text-black">Nom</span>
      <span className="text-primary-200">Nom</span>
    </Link>
  );
};

export default AppLogo;
