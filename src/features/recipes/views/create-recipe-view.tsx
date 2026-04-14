"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2Icon, X, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useCreateRecipe } from "@/hooks/trpcHooks/use-recipes";
import { createRecipeSchema } from "@/db/schemas/recipes";
import { Switch } from "@/components/ui/switch";

const CreateRecipeView = () => {
  const router = useRouter();
  const createRecipe = useCreateRecipe();

  const {
    isUploading,
    previewUrl,
    uploadFile,
    removeFile,
    handleFileChange,
    hasFile,
  } = useImageUpload({
    folder: "recipes",
    uploadPreset: "recipe_images",
    maxFileSize: 30 * 1024 * 1024,
  });

  const form = useForm<z.infer<typeof createRecipeSchema>>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: recipeDefaultValues,
  });

  const [tagInput, setTagInput] = useState("");

  const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: instructionFields, append: appendInstruction } =
    useFieldArray({
      control: form.control,
      name: "instructions",
    });

  const {
    fields: nutritionFields,
    append: appendNutrition,
    remove: removeNutrition,
  } = useFieldArray({
    control: form.control,
    name: "nutrition",
  });

  const onSubmit = async (data: z.infer<typeof createRecipeSchema>) => {
    try {
      let imageUrl = "";
      if (hasFile) {
        imageUrl = (await uploadFile()) || "";
      }

      await createRecipe.mutateAsync(
        { ...data, imageUrl: imageUrl || undefined },
        {
          onSuccess: (createdRecipe) => {
            toast.success("Recipe created successfully");
            router.push(
              `/${createdRecipe.username}/${createdRecipe.recipeSlug}`,
            );
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      console.error("Recipe creation error:", error);
      toast.error("Failed to create recipe");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeIngredient = (index: number) => {
    const current = form.getValues("ingredients") || [];
    form.setValue(
      "ingredients",
      current.filter((_, i) => i !== index),
    );
  };

  const removeInstruction = (index: number) => {
    const current = form.getValues("instructions") || [];
    form.setValue(
      "instructions",
      current.filter((_, i) => i !== index),
    );
  };

  const removeTag = (tagToRemove: string) => {
    const current = form.getValues("tags") || [];
    form.setValue(
      "tags",
      current.filter((tag) => tag !== tagToRemove),
    );
  };

  const isLoading = createRecipe.isPending || isUploading;

  const tags = useWatch({ control: form.control, name: "tags" });

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-16">
      <div className="flex justify-between items-center pt-6 pb-16">
        <h1>Create new recipe</h1>
        <Button
          variant="ghost"
          className="text-transparent! bg-linear-to-r! from-purple-500! via-pink-500! to-orange-500! bg-clip-text! hover:from-purple-600! hover:via-pink-600! hover:to-orange-600! font-medium"
          onClick={() => router.push("/recipes/new-with-ai")}
        >
          <span className="flex items-center gap-2 text-xl">With AI ✨</span>
        </Button>
      </div>

      <Form {...form}>
        <form
          id="recipe-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Recipe name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormItem>
            <FormLabel>Recipe image</FormLabel>
            {previewUrl ? (
              <div className="relative w-full h-128 border rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Recipe preview"
                  width={1000}
                  height={1000}
                  className="object-cover"
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg py-20 text-center">
                <div className="space-y-4">
                  <div className="text-gray-600">Upload Your Recipe Image</div>
                  <label htmlFor="image-upload">
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
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-400 mt-4">
                    Max file size 30 MB | Supported: JPG, PNG, WEBP
                  </div>
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
                    placeholder="Introduce your recipe"
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {field.value?.length || 0}/100
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ingredients */}
          <FormItem>
            <FormLabel>Ingredients</FormLabel>
            <div className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-10 gap-4">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormDescription className="text-xs">
                          Ingredient Name
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g., Chicken breast"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormDescription className="text-xs">
                          Amount
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormDescription className="text-xs">
                          Unit
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., lb, cup" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.isOptional`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center justify-center">
                        <FormDescription className="text-xs text-center">
                          Optional
                        </FormDescription>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-2"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end justify-center">
                    {index >= 2 && (
                      <div className="flex flex-col items-center justify-center">
                        <FormDescription className="text-xs text-center mb-2.5">
                          Remove
                        </FormDescription>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="text-primary-200 hover:text-primary-300 hover:bg-transparent"
                        >
                          <Trash2Icon className="size-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  appendIngredient({
                    name: "",
                    amount: "",
                    unit: "",
                    isOptional: false,
                  })
                }
                className="text-primary-200 hover:text-primary-300 px-0 font-normal"
              >
                + Add More
              </Button>
            </div>
          </FormItem>

          {/* Instructions */}
          <FormItem>
            <FormLabel>Instructions</FormLabel>
            <div className="space-y-3">
              {instructionFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`instructions.${index}.instruction`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Write instruction" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index >= 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="text-primary-200 hover:text-primary-300 px-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  appendInstruction({
                    stepNumber: instructionFields.length + 1,
                    instruction: "",
                  })
                }
                className="text-primary-200 hover:text-primary-300 p-0 h-auto font-normal"
              >
                + Add More
              </Button>
            </div>
          </FormItem>

          {/* Servings */}
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input placeholder="#" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  How many portions does this recipe make?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cooking Time */}
          <FormItem>
            <FormLabel>Cooking Time</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="cookingTime.hours"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Hours 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookingTime.minutes"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Minutes 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription className="text-xs">
              How long does it take to cook this recipe?
            </FormDescription>
          </FormItem>

          {/* Prep Time */}
          <FormItem>
            <FormLabel>Prep Time</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="prepTime.hours"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Hours 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prepTime.minutes"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Minutes 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>
              How long does it take to prepare this recipe?
            </FormDescription>
          </FormItem>

          {/* Nutrition */}
          <FormItem>
            <FormLabel>Nutrition Facts</FormLabel>
            <div className="space-y-3">
              {nutritionFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`nutrition.${index}.nutrientName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="text-xs">
                          Nutrient Name
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g., Protein"
                            {...field}
                            disabled={field.value === "calories"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`nutrition.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="text-xs">
                          Amount
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="#"
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
                    name={`nutrition.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="text-xs">
                          Unit
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., g, kcal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    {nutritionFields[index].nutrientName !== "calories" && (
                      <div className="flex flex-col items-center justify-center">
                        <FormDescription className="text-xs text-center mb-2.5">
                          Remove
                        </FormDescription>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNutrition(index)}
                          className="text-primary-200 hover:text-primary-300 hover:bg-transparent"
                        >
                          <Trash2Icon className="size-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  appendNutrition({ nutrientName: "", amount: 0, unit: "" })
                }
                className="text-primary-200 hover:text-primary-300 p-0 h-auto font-normal"
              >
                + Add More
              </Button>
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
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormItem>

          {/* Visibility */}
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel className="text-base">
                    {field.value ? "Public" : "Private"}
                  </FormLabel>
                  <FormDescription>
                    {field.value
                      ? "Anyone can see this recipe"
                      : "Only you can see this recipe"}
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
        </form>
      </Form>

      <div className="flex flex-row justify-end">
        <Button
          type="submit"
          form="recipe-form"
          className="px-8 mt-8 self-end"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Creating..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default CreateRecipeView;

const recipeDefaultValues: z.infer<typeof createRecipeSchema> = {
  title: "",
  description: "",
  imageUrl: "",
  ingredients: [
    { name: "", amount: "", unit: "", isOptional: false },
    { name: "", amount: "", unit: "", isOptional: false },
  ],
  instructions: [
    { stepNumber: 1, instruction: "" },
    { stepNumber: 2, instruction: "" },
  ],
  nutrition: [{ nutrientName: "calories", amount: 0, unit: "kcal" }],
  tags: [],
  servings: "",
  cookingTime: { hours: "", minutes: "" },
  prepTime: { hours: "", minutes: "" },
  isPublic: false,
};
