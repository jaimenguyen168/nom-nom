"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, XIcon, UploadIcon, CheckIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useCreateCookbook } from "@/hooks/trpcHooks/use-cookbooks";
import { createCookbookSchema } from "@/db/schemas/cookbooks";
import AppTitle from "@/components/app-title";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";
import { useGetCurrentUser } from "@/hooks/trpcHooks/use-users";
import { cn } from "@/lib/utils";
import { useGetMyRecipes } from "@/hooks/trpcHooks/use-recipes";

const CreateCookbookView = () => {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUser();
  const createCookbook = useCreateCookbook();
  const { data: categories } = useGetCategories();

  const [tagInput, setTagInput] = useState("");
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);

  const { data: myRecipes } = useGetMyRecipes("public");

  const coverImage = useImageUpload({
    folder: "cookbooks",
    uploadPreset: "recipe_images",
    maxFileSize: 30 * 1024 * 1024,
  });

  const bannerImage = useImageUpload({
    folder: "cookbooks",
    uploadPreset: "recipe_images",
    maxFileSize: 30 * 1024 * 1024,
  });

  const form = useForm<z.infer<typeof createCookbookSchema>>({
    resolver: zodResolver(createCookbookSchema),
    defaultValues: {
      title: "",
      description: "",
      cuisine: "",
      servingsRange: "",
      language: "English",
      edition: "",
      isFree: true,
      price: undefined,
      currency: "USD",
      status: "draft",
      tags: [],
      categoryIds: [],
    },
  });

  const isFree = useWatch({ control: form.control, name: "isFree" });
  const tags = useWatch({ control: form.control, name: "tags" });

  const toggleRecipe = (id: string) => {
    setSelectedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const current = form.getValues("tags") ?? [];
      if (!current.includes(tagInput.trim())) {
        form.setValue("tags", [...current, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      (form.getValues("tags") ?? []).filter((t) => t !== tag),
    );
  };

  const onSubmit = async (data: z.infer<typeof createCookbookSchema>) => {
    try {
      let coverImageUrl = "";
      let bannerImageUrl = "";

      if (coverImage.hasFile)
        coverImageUrl = (await coverImage.uploadFile()) ?? "";
      if (bannerImage.hasFile)
        bannerImageUrl = (await bannerImage.uploadFile()) ?? "";

      const result = await createCookbook.mutateAsync({
        ...data,
        coverImageUrl: coverImageUrl || undefined,
        bannerImageUrl: bannerImageUrl || undefined,
        recipeIds: selectedRecipeIds,
      });

      toast.success("Cookbook created!");
      router.push(
        `/${currentUser?.username}/cookbooks?cookbookSlug=${result.slug}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create cookbook");
    }
  };

  const isLoading =
    createCookbook.isPending ||
    coverImage.isUploading ||
    bannerImage.isUploading;

  return (
    <div>
      <div className="flex justify-between items-center pb-16">
        <AppTitle title="Create Cookbook" className="mb-2" />
      </div>

      <div className="max-w-5xl mx-auto">
        <Form {...form}>
          <form
            id="cookbook-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cookbook Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your cookbook name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              {coverImage.previewUrl ? (
                <div className="relative w-full h-72 border rounded-lg overflow-hidden">
                  <Image
                    src={coverImage.previewUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={coverImage.removeFile}
                    className="absolute size-8 top-3 right-3 rounded-full"
                  >
                    <XIcon className="size-5" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 text-center">
                  <div className="space-y-3">
                    <p className="text-gray-600">Upload Cover Image</p>
                    <label htmlFor="cover-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-gray-600"
                        asChild
                      >
                        <span>
                          <UploadIcon className="w-4 h-4 mr-2" /> Upload
                        </span>
                      </Button>
                    </label>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={coverImage.handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-400">
                      Max 30MB | JPG, PNG, WEBP
                    </p>
                  </div>
                </div>
              )}
            </FormItem>

            {/* Banner Image */}
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormDescription className="text-xs">
                Optional — displayed at the top of the cookbook page
              </FormDescription>
              {bannerImage.previewUrl ? (
                <div className="relative w-full h-40 border rounded-lg overflow-hidden">
                  <Image
                    src={bannerImage.previewUrl}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={bannerImage.removeFile}
                    className="absolute size-8 top-3 right-3 rounded-full"
                  >
                    <XIcon className="size-5" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg py-8 text-center">
                  <div className="space-y-3">
                    <label htmlFor="banner-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-gray-600"
                        asChild
                      >
                        <span>
                          <UploadIcon className="w-4 h-4 mr-2" /> Upload Banner
                        </span>
                      </Button>
                    </label>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={bannerImage.handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </FormItem>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your cookbook..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cuisine + Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Italian, Asian, Mexican"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Select difficulty"
                            className="w-full"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Servings Range + Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="servingsRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2-4 servings" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Edition */}
            <FormField
              control={form.control}
              name="edition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edition</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1st Edition" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Optional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Press Enter to add tags
              </FormDescription>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <XIcon className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormItem>

            {/* Categories */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => {
                const selected = field.value ?? [];
                const toggleCategory = (id: string) => {
                  if (selected.includes(id)) {
                    field.onChange(selected.filter((c) => c !== id));
                  } else if (selected.length < 3) {
                    field.onChange([...selected, id]);
                  }
                };
                return (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormDescription className="text-xs">
                      Select up to 3 categories
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories?.map((category) => {
                        const isSelected = selected.includes(category.id);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                              isSelected
                                ? "bg-primary-200 text-white border-primary-200"
                                : "bg-white text-gray-600 border-gray-300 hover:border-primary-200",
                              !isSelected &&
                                selected.length >= 3 &&
                                "opacity-50 cursor-not-allowed",
                            )}
                            disabled={!isSelected && selected.length >= 3}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Recipe Picker */}
            <FormItem>
              <FormLabel>Recipes</FormLabel>
              <FormDescription className="text-xs">
                Select recipes to include in this cookbook
              </FormDescription>
              {!myRecipes?.items || myRecipes.items.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">
                  No public recipes found. Create some recipes first.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {myRecipes.items.map((recipe) => {
                    const isSelected = selectedRecipeIds.includes(recipe.id);
                    return (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => toggleRecipe(recipe.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                          isSelected
                            ? "border-primary-200 bg-primary-50"
                            : "border-gray-200 hover:border-primary-200",
                        )}
                      >
                        <div className="relative size-12 shrink-0 rounded-md overflow-hidden bg-gray-100">
                          {recipe.imageUrl && (
                            <Image
                              src={recipe.imageUrl}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {recipe.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {recipe.calories} cals
                          </p>
                        </div>
                        {isSelected && (
                          <CheckIcon className="size-4 text-primary-200 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </FormItem>

            {/* Pricing */}
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">
                      {field.value ? "Free" : "Paid"}
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Anyone can access this cookbook for free"
                        : "Set a price for this cookbook"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isFree && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="9.99"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="USD" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base capitalize">
                      {field.value}
                    </FormLabel>
                    <FormDescription>
                      {field.value === "published"
                        ? "Cookbook is visible to everyone"
                        : field.value === "draft"
                          ? "Only you can see this cookbook"
                          : "Cookbook is archived and hidden"}
                    </FormDescription>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            form="cookbook-form"
            className="px-8"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Creating..." : "Create Cookbook"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCookbookView;
