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
import { slugify } from "@/lib/utils";
import AppTitle from "@/components/app-title";

type CreateBlogForm = z.infer<typeof createBlogSchema>;
type ContentBlock = z.infer<typeof contentBlockSchema>;
type ContentBlockType = ContentBlock["type"];

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
    isUploading,
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

  const form = useForm<CreateBlogForm>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: blogDefaultValues,
  });

  const watchTitle = useWatch({ control: form.control, name: "title" });

  useEffect(() => {
    if (watchTitle) {
      form.setValue("slug", slugify(watchTitle), { shouldValidate: false });
    }
  }, [watchTitle, form]);

  const [tagInput, setTagInput] = useState("");

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

  const onSubmit = async (data: CreateBlogForm) => {
    try {
      let featuredImageUrl = "";
      if (hasFeaturedImage) {
        featuredImageUrl = (await uploadFeaturedImage()) || "";
      }

      await createBlog.mutateAsync(
        { ...data, featuredImage: featuredImageUrl || undefined },
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
          ? { type, value: "", items: [{ text: "" }] }
          : type === "quote"
            ? { type, value: "", author: "" }
            : type === "image"
              ? { type, value: "", url: "" }
              : { type: "paragraph", value: "" };

    appendContent(newBlock);
  };

  const isLoading = createBlog.isPending || isUploading;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <div className="flex justify-between items-center pt-6 pb-16">
        <AppTitle title="Create new blog post" />
        <Button
          type="submit"
          form="blog-form"
          className="px-8"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Publishing..." : "Publish"}
        </Button>
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

                  {field.type === "list" && (
                    <ListBlockComponent blockIndex={index} form={form} />
                  )}

                  {field.type === "image" && (
                    <div className="space-y-4">
                      <ImageBlockComponent blockIndex={index} form={form} />
                    </div>
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

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `contentBlocks.${blockIndex}.items`,
  });

  return (
    <div className="space-y-3">
      <FormLabel>List Items</FormLabel>
      {fields.map((item, itemIndex) => (
        <div key={item.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`contentBlocks.${blockIndex}.items.${itemIndex}.text`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="List item..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(itemIndex)}
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
        onClick={() => append({ text: "" })}
        className="text-primary-200 hover:text-primary-300 p-0 h-auto font-normal"
      >
        + Add Item
      </Button>
    </div>
  );
};

const ImageBlockComponent = ({
  blockIndex,
  form,
}: {
  blockIndex: number;
  form: UseFormReturn<z.infer<typeof createBlogSchema>>;
}) => {
  const { isUploading, previewUrl, uploadFile, removeFile, handleFileChange } =
    useImageUpload({
      folder: "blogs/content",
      uploadPreset: "blog_content_images",
      maxFileSize: 30 * 1024 * 1024,
    });

  const handleUpload = async () => {
    const url = await uploadFile();
    if (url) {
      form.setValue(`contentBlocks.${blockIndex}.url`, url);
      form.setValue(`contentBlocks.${blockIndex}.value`, url);
    }
  };

  return (
    <div>
      {previewUrl ? (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt="Content image"
            width={800}
            height={400}
            className="object-cover w-full h-full"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeFile}
            className="absolute size-8 top-3 right-3 rounded-full"
          >
            <X className="size-5" />
          </Button>
          {!form.getValues(`contentBlocks.${blockIndex}.url`) && (
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
              className="absolute bottom-3 right-3"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 text-center">
          <div className="space-y-4">
            <div className="text-gray-600">Upload Image</div>
            <label htmlFor={`content-image-${blockIndex}`}>
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
              id={`content-image-${blockIndex}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-xs text-gray-400">
              Max file size 30 MB | Supported: JPG, PNG, WEBP
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
