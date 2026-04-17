import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const StayInTouchSection = () => {
  return (
    <section className="w-full bg-[#fdd2cc] py-12 my-10 flex justify-center">
      <div className="max-w-xl w-full text-center space-y-6 px-12">
        <h2 className="text-3xl font-bold text-black">Let’s Stay In Touch!</h2>
        <p className="text-gray-500 text-xl">
          Join our newsletter, so that we reach out to you with our news and
          offers.
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 size-5 sm:hidden" />
            <Input
              type="email"
              placeholder="Enter Your Email"
              className="w-full h-12 pl-10 sm:pl-4 bg-white"
            />
          </div>
          <Button className="w-full sm:w-auto h-12 bg-primary-200 hover:bg-primary-300 text-white font-medium shadow-md px-8 text-lg">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
export default StayInTouchSection;
