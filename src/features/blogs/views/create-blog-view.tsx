"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Heading,
  ImageIcon,
  List,
  Loader2,
  Quote,
  Trash2Icon,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBlogSchema, contentBlockSchema } from "@/db/schemas/blogs";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useCreateBlog } from "@/hooks/trpcHooks/use-blogs";
import { cn, slugify } from "@/lib/utils";
import AppTitle from "@/components/app-title";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";
import { Switch } from "@/components/ui/switch";

type CreateBlogForm = z.infer<typeof createBlogSchema>;
type ContentBlock = z.infer<typeof contentBlockSchema>;
type ContentBlockType = ContentBlock["type"];

interface ContentImageState {
  file: File | null;
  previewUrl: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

const blogDefaultValues: CreateBlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  featuredImage: "",
  topic: "",
  contentBlocks: [{ type: "paragraph", value: "" }],
  status: "draft",
  tags: [],
};

const CreateBlogView = () => {
  const router = useRouter();
  const createBlog = useCreateBlog();

  const {
    isUploading: isFeaturedImageUploading,
    previewUrl: featuredImagePreview,
    uploadFile: uploadFeaturedImage,
    removeFile: removeFeaturedImage,
    handleFileChange: handleFeaturedImageChange,
    hasFile: hasFeaturedImage,
  } = useImageUpload({
    folder: "blogs/featured",
    uploadPreset: "blog_content_images",
    maxFileSize: 30 * 1024 * 1024,
  });

  const [contentImages, setContentImages] = useState<
    Record<number, ContentImageState>
  >({});

  const form = useForm<CreateBlogForm>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: blogDefaultValues,
  });

  const watchTitle = useWatch({ control: form.control, name: "title" });
  const watchStatus = useWatch({ control: form.control, name: "status" });

  useEffect(() => {
    if (watchTitle) {
      form.setValue("slug", slugify(watchTitle), { shouldValidate: false });
    }
  }, [watchTitle, form]);

  const [tagInput, setTagInput] = useState("");
  const { data: categories } = useGetCategories();

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({ control: form.control, name: "contentBlocks" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control: form.control, name: "tags" });

  const handleContentImageChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setContentImages((prev) => ({
        ...prev,
        [index]: {
          file,
          previewUrl,
          uploadedUrl: null,
          isUploading: false,
          error: null,
        },
      }));
    };

  const removeContentImage = (index: number) => {
    setContentImages((prev) => {
      const updated = { ...prev };
      if (updated[index]?.previewUrl) {
        URL.revokeObjectURL(updated[index].previewUrl!);
      }
      delete updated[index];
      return updated;
    });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_content_images");
    formData.append("folder", "blogs/content");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url;
  };

  const onSubmit = async (data: CreateBlogForm) => {
    try {
      let featuredImageUrl = "";
      if (hasFeaturedImage) {
        featuredImageUrl = (await uploadFeaturedImage()) || "";
      }

      // Upload all content images
      const uploadedContentImages: Record<number, string> = {};
      for (const [indexStr, imageState] of Object.entries(contentImages)) {
        const index = parseInt(indexStr);
        if (imageState.file && !imageState.uploadedUrl) {
          setContentImages((prev) => ({
            ...prev,
            [index]: { ...prev[index], isUploading: true },
          }));
          try {
            const url = await uploadToCloudinary(imageState.file);
            uploadedContentImages[index] = url;
            setContentImages((prev) => ({
              ...prev,
              [index]: { ...prev[index], uploadedUrl: url, isUploading: false },
            }));
          } catch {
            setContentImages((prev) => ({
              ...prev,
              [index]: {
                ...prev[index],
                error: "Upload failed",
                isUploading: false,
              },
            }));
          }
        }
      }

      // Map content blocks with uploaded image URLs
      const updatedContentBlocks = data.contentBlocks.map((block, index) => {
        if (block.type === "image" && uploadedContentImages[index]) {
          return { ...block, url: uploadedContentImages[index] };
        }
        return block;
      });

      await createBlog.mutateAsync(
        {
          ...data,
          featuredImage: featuredImageUrl || undefined,
          contentBlocks: updatedContentBlocks,
        },
        {
          onSuccess: (createdBlog) => {
            toast.success("Blog created successfully");
            router.push(
              `/blogs/${createdBlog.username}/${createdBlog.blogSlug}`,
            );
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      console.error("Blog creation error:", error);
      toast.error("Failed to create blog");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      appendTag({ name: tagInput.trim() });
      setTagInput("");
    }
  };

  const addContentBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock =
      type === "heading"
        ? { type, value: "", level: 2 }
        : type === "list"
          ? { type, value: "", items: [""] }
          : type === "quote"
            ? { type, value: "", author: "" }
            : type === "image"
              ? { type, value: "", url: "" }
              : { type: "paragraph", value: "" };

    appendContent(newBlock);
  };

  const isLoading =
    createBlog.isPending ||
    isFeaturedImageUploading ||
    Object.values(contentImages).some((img) => img.isUploading);

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <div className="flex justify-between items-center pt-6 pb-16">
        <AppTitle title="Create new blog post" />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-transparent! bg-linear-to-r! from-purple-500! via-pink-500! to-orange-500! bg-clip-text! hover:from-purple-600! hover:via-pink-600! hover:to-orange-600! font-medium"
            onClick={() => router.push("/blogs/new?agent=true")}
          >
            <span className="flex items-center gap-2 text-xl">
              Inspire me ✨
            </span>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="blog-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Path (Auto-generated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="blog-path"
                    {...field}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </FormControl>
                <FormDescription>
                  Automatically generated from your title
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Excerpt */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your blog post"
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {field.value?.length || 0}/200
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Image */}
          <FormItem>
            <FormLabel>Featured Image</FormLabel>
            {featuredImagePreview ? (
              <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                <Image
                  src={featuredImagePreview}
                  alt="Featured image preview"
                  width={1000}
                  height={400}
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFeaturedImage}
                  className="absolute size-8 top-3 right-3 rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg py-20 text-center">
                <div className="space-y-4">
                  <div className="text-gray-600">Upload Featured Image</div>
                  <label htmlFor="featured-image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-gray-600"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />+ Upload
                      </span>
                    </Button>
                  </label>
                  <input
                    id="featured-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-400 mt-4">
                    Max file size 30 MB | Supported: JPG, PNG, WEBP
                  </div>
                </div>
              </div>
            )}
          </FormItem>

          {/* Topic */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., dessert, breakfast, cooking tips"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Main topic of your blog post</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Blocks */}
          <FormItem>
            <FormLabel>Content</FormLabel>
            <div className="space-y-6">
              {contentFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline">
                      {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContent(index)}
                      className="text-primary-200 hover:text-primary-300"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>

                  {field.type === "paragraph" && (
                    <FormField
                      control={form.control}
                      name={`contentBlocks.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Write your paragraph..."
                              className="resize-none h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {field.type === "heading" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`contentBlocks.${index}.level`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heading Level</FormLabel>
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(v) => field.onChange(parseInt(v))}
                            >
                              <FormControl>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6].map((l) => (
                                  <SelectItem key={l} value={l.toString()}>
                                    H{l}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`contentBlocks.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Heading text..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {field.type === "quote" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`contentBlocks.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quote Text</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the quote..."
                                className="resize-none h-20"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`contentBlocks.${index}.author`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Quote author..."
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value || "")
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {field.type === "image" && (
                    <div className="space-y-4">
                      {contentImages[index]?.previewUrl ? (
                        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                          <Image
                            src={contentImages[index].previewUrl!}
                            alt="Content image"
                            width={800}
                            height={400}
                            className="object-cover w-full h-full"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContentImage(index)}
                            className="absolute size-8 top-3 right-3 rounded-full"
                          >
                            <X className="size-5" />
                          </Button>
                          {contentImages[index]?.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                          {contentImages[index]?.error && (
                            <div className="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-xs p-2 rounded">
                              {contentImages[index].error}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 text-center">
                          <div className="space-y-4">
                            <div className="text-gray-600">Upload Image</div>
                            <label htmlFor={`content-image-${index}`}>
                              <Button
                                type="button"
                                variant="outline"
                                className="text-gray-600"
                                asChild
                              >
                                <span>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </span>
                              </Button>
                            </label>
                            <input
                              id={`content-image-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={handleContentImageChange(index)}
                              className="hidden"
                            />
                            <div className="text-xs text-gray-400">
                              Images will be uploaded when you publish
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {field.type === "list" && (
                    <ListBlockComponent blockIndex={index} form={form} />
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <span className="text-sm text-gray-600 w-full mb-2">
                  Add content:
                </span>
                {(
                  [
                    "paragraph",
                    "heading",
                    "quote",
                    "image",
                    "list",
                  ] as ContentBlockType[]
                ).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContentBlock(type)}
                  >
                    {type === "paragraph" && (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {type === "heading" && <Heading className="w-4 h-4 mr-2" />}
                    {type === "quote" && <Quote className="w-4 h-4 mr-2" />}
                    {type === "image" && <ImageIcon className="w-4 h-4 mr-2" />}
                    {type === "list" && <List className="w-4 h-4 mr-2" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </FormItem>

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
            {tagFields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tagFields.map((tag, index) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    #{tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
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

          {/* Status */}
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel className="text-base">
                    {field.value === "published" ? "Published" : "Draft"}
                  </FormLabel>
                  <FormDescription>
                    {field.value === "published"
                      ? "Anyone can see this blog post"
                      : "Only you can see this blog post"}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "published"}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "published" : "draft")
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              form="blog-form"
              className="w-32"
              disabled={isLoading}
              variant={watchStatus === "published" ? "default" : "outline"}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading
                ? "Saving..."
                : watchStatus === "published"
                  ? "Publish"
                  : "Save Draft"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlogView;

const ListBlockComponent = ({
  blockIndex,
  form,
}: {
  blockIndex: number;
  form: UseFormReturn<z.infer<typeof createBlogSchema>>;
}) => {
  const items = (form.watch(
    `contentBlocks.${blockIndex}.items`,
  ) as string[]) ?? [""];

  const updateItem = (itemIndex: number, value: string) => {
    const updated = [...items];
    updated[itemIndex] = value;
    form.setValue(`contentBlocks.${blockIndex}.items`, updated);
  };

  const addItem = () => {
    form.setValue(`contentBlocks.${blockIndex}.items`, [...items, ""]);
  };

  const removeItem = (itemIndex: number) => {
    form.setValue(
      `contentBlocks.${blockIndex}.items`,
      items.filter((_, i) => i !== itemIndex),
    );
  };

  return (
    <div className="space-y-3">
      <FormLabel>List Items</FormLabel>
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className="flex items-center gap-2">
          <Input
            placeholder="List item..."
            value={item}
            onChange={(e) => updateItem(itemIndex, e.target.value)}
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(itemIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        onClick={addItem}
        className="text-primary-200 hover:text-primary-300 p-0 h-auto font-normal"
      >
        + Add Item
      </Button>
    </div>
  );
};
