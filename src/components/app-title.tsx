import React from "react";
import { cn } from "@/lib/utils";

interface AppTitleProps {
  title: string;
  className?: string;
}

const AppTitle = ({ title, className }: AppTitleProps) => {
  return (
    <h1
      className={cn("text-3xl md:text-4xl font-bold text-gray-900", className)}
    >
      {title}
    </h1>
  );
};
export default AppTitle;
