import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  className?: string;
}

const ContactSection = ({ className }: ContactSectionProps) => {
  return (
    <div
      className={cn("bg-primary-100 rounded-lg p-6 pb-12 space-y-8", className)}
    >
      <h3 className="font-bold text-2xl text-center">
        Stay connected with our Recipes updates
      </h3>
      <p className="text-lg text-center">
        for the latest health tips and delicious recipes
      </p>
      <div className="space-y-4">
        <div className="relative w-full">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
          <Input
            type="email"
            placeholder="Enter Your Email"
            className="w-full h-12 border border-gray-200 bg-white rounded-lg text-sm pl-9"
          />
        </div>
        <Button className="w-full bg-primary-200 hover:bg-primary-300 text-white h-12 rounded-lg font-semibold text-lg">
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default ContactSection;
