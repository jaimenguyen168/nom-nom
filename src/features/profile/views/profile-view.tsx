"use client";

import React, { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  Edit3Icon,
  LogOutIcon,
  LucideIcon,
  BookMarkedIcon,
  LibraryIcon,
  HeartIcon,
  BookOpenIcon,
  BookmarkIcon,
  ChefHatIcon,
  CreditCardIcon,
  ZapIcon,
  SparklesIcon,
  CrownIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/use-image-upload";
import AppTitle from "@/components/app-title";
import {
  useGetCurrentUser,
  useUpdateProfile,
} from "@/hooks/trpcHooks/use-users";
import { useClerkBilling } from "@/features/billing/hooks/use-clerk-billing";
import Link from "next/link";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileView() {
  const { data: currentUser } = useGetCurrentUser();
  const { currentPlan } = useClerkBilling();
  const updateProfile = useUpdateProfile();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user: clerkUser } = useUser();
  const isOAuthUser = (clerkUser?.externalAccounts?.length ?? 0) > 0;

  const {
    isUploading,
    previewUrl,
    uploadFile,
    removeFile,
    handleFileChange,
    hasFile,
  } = useImageUpload({
    folder: "users/profiles",
    uploadPreset: "profile_images",
    maxFileSize: 10 * 1024 * 1024,
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
      username: currentUser?.username ?? "",
      bio: currentUser?.bio ?? "",
    },
  });

  if (!currentUser) return null;

  const displayImage = previewUrl || currentUser.profileImageUrl || "";

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    try {
      let profileImageUrl = currentUser.profileImageUrl ?? undefined;

      if (hasFile) {
        profileImageUrl = (await uploadFile()) ?? undefined;
      }

      await updateProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        bio: data.bio,
        profileImageUrl,
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  const handleSignOut = async () => {
    await signOut(() => router.push("/"));
  };

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16 space-y-8 pt-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AppTitle title="My Profile" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full">
        {/* Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={displayImage}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="text-3xl font-semibold bg-primary-200/90 text-white">
                {currentUser.firstName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {isEditing && (
            <div className="flex items-center gap-3">
              <label htmlFor="profile-image-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    {isUploading
                      ? "Uploading..."
                      : previewUrl
                        ? "Change Photo"
                        : "Upload Photo"}
                  </span>
                </Button>
              </label>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                >
                  Remove
                </Button>
              )}
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Plan badge */}
          <PlanBadge
            planId={currentPlan?.clerkPlanSlug ?? "free"}
            planName={currentPlan?.name ?? "Free"}
          />

          {/* Stats */}
          <div className="flex items-center gap-8 text-center">
            <div>
              <p className="text-xs text-gray-500">Member since</p>
              <p className="text-sm font-semibold">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          value={`${form.watch("firstName")} ${form.watch("lastName") ?? ""}`.trim()}
                          onChange={(e) => {
                            const parts = e.target.value.split(" ");
                            form.setValue("firstName", parts[0] ?? "");
                            form.setValue("lastName", parts.slice(1).join(" "));
                          }}
                          className={`pl-10 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                          readOnly={!isEditing}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          @
                        </span>
                        <Input
                          {...field}
                          className={`pl-8 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                          readOnly={!isEditing}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={currentUser.email}
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                  {isOAuthUser && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      via {clerkUser?.externalAccounts[0]?.provider}
                    </span>
                  )}
                </div>
              </FormItem>

              {/* Password */}
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    value="••••••••••"
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </FormItem>
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Edit3Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      {isEditing ? (
                        <Textarea
                          {...field}
                          className="pl-10 min-h-20"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="pl-10 py-3 border rounded-md bg-gray-50 min-h-20">
                          <p className="text-gray-700 text-sm">
                            {field.value || "No bio yet."}
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      removeFile();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-8"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-8"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <ActivityCard
            href={`/${currentUser.username}/recipes`}
            title="My Recipes"
            description="Recipes you created"
            icon={ChefHatIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/recipes/saved`}
            title="Saved Recipes"
            description="Recipes you saved"
            icon={BookmarkIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/blogs`}
            title="My Blogs"
            description="Blogs you created"
            icon={BookOpenIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/blogs/saved`}
            title="Saved Blogs"
            description="Blogs you saved"
            icon={HeartIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/cookbooks`}
            title="My Cookbooks"
            description="Cookbooks you created"
            icon={BookMarkedIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/cookbooks/saved`}
            title="Saved Cookbooks"
            description="Cookbooks you saved"
            icon={LibraryIcon}
          />
          <ActivityCard
            href={`/${currentUser.username}/billing`}
            title="Billing & Plan"
            description="Manage your subscription"
            icon={CreditCardIcon}
          />
        </div>

        {/* Sign Out */}
        <div className="flex justify-end w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOutIcon className="size-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

const ActivityCard = ({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(href)}
      className="p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
    </Card>
  );
};

const planConfig: Record<string, { className: string; icon: React.ReactNode }> =
  {
    free: {
      className: "bg-gray-100 text-gray-500 border-gray-200",
      icon: null,
    },
    starter: {
      className: "bg-primary-100 text-primary-300 border-primary-200",
      icon: <ZapIcon className="size-3" />,
    },
    pro: {
      className: "bg-primary-200 text-white border-primary-200",
      icon: <SparklesIcon className="size-3" />,
    },
    premium: {
      className: "bg-primary-300 text-white border-primary-300",
      icon: <CrownIcon className="size-3" />,
    },
  };

const PlanBadge = ({
  planId,
  planName,
}: {
  planId: string;
  planName: string;
}) => {
  const config = planConfig[planId] ?? planConfig.free;
  return (
    <Badge
      className={`gap-1.5 px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {planName}
    </Badge>
  );
};
