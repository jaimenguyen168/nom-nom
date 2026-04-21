"use client";


import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import StayInTouchSection from "@/features/home/components/stay-in-touch-section";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const ContactView = () => {

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    console.log("Contact form submitted:", data);
  };


  return (
    <div className="w-full pb-20">
      <div className="w-full lg:max-w-7xl mx-auto px-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-gray-600 hover:text-gray-800"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-black font-semibold">
                Contact
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
        </div>

        {/* Contact Form Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          {/* Left Column - Contact Form */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="bg-gray-50 border-0 rounded-md py-6"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email Address"
                          type="email"
                          {...field}
                          className="bg-gray-50 border-0 rounded-md py-6"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Subject"
                          {...field}
                          className="bg-gray-50 border-0 rounded-md py-6"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Message"
                          {...field}
                          className="bg-gray-50 border-0 rounded-md resize-none h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-primary-200 text-white px-12 py-3 rounded-md"
                >
                  Send
                </Button>
              </form>
            </Form>
          </div>

          {/* Right Column - Info */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="text-sm text-gray-500 mb-8">
              Send message to us, Write for us, we would be happy to help
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              We Would Be happy to help you just write to us
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Feel free to reach out anytime — whether you want to share a
              recipe, ask a question, collaborate, or just say hello. We love
              hearing from food lovers of all kinds. Your ideas, stories, and
              feedback help us keep growing and make the community richer for
              everyone.
            </p>
          </div>
        </div>

        {/* Learn More Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          {/* Left Column - Text */}
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl md:text-4xl font-semibold text-center md:text-start text-gray-900 mb-4">
              Looking for Something Delicious?
            </h2>
            <p className="text-gray-600 mb-6 text-center md:text-start">
              Explore hundreds of recipes created, shared, and loved by our
              community.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link href="/recipes">
                <Button className="bg-primary-200 text-white px-12 py-2 rounded-md">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="md:w-1/2 flex gap-4 order-1 md:order-2 justify-end">
            <div className="relative w-56 h-56 rounded-full overflow-hidden">
              <Image
                src="/recipe-1.png"
                alt="Food preparation"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative -ml-16 -mt-12 w-40 h-40 rounded-full overflow-hidden border-3 border-white">
              <Image
                src="/recipe-2.png"
                alt="Delicious meal"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <StayInTouchSection />

      {/* Bottom Learn More Section */}
      <div className="text-center pt-16 pb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Want to learn more about Us?
        </h2>
        <p className="text-gray-600 mb-6">You Can Learn More Here</p>
        <Link href="/about">
          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md">
            About us
          </Button>
        </Link>
      </div>
    </div>
  );
};
