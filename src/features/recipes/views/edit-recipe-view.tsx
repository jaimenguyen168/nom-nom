"use client";

import React, { useEffect, useState } from "react";
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
import {
  useDeleteRecipe,
  useGetRecipe,
  useUpdateRecipe,
} from "@/hooks/trpcHooks/use-recipes";
import { createRecipeSchema } from "@/db/schemas/recipes";
import { Switch } from "@/components/ui/switch";
import AppTitle from "@/components/app-title";
import { useGetCategories } from "@/hooks/trpcHooks/use-categories";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter as useNextRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  username: string;
  recipeSlug: string;
}

export default function EditRecipeView({ username, recipeSlug }: Props) {
  const { data } = useGetRecipe(username, recipeSlug);
  const { userId } = useAuth();
  const router = useRouter();

  const isOwner = userId === data.recipes.userId;

  useEffect(() => {
    if (!isOwner) {
      router.replace(`/recipes/${recipeSlug}`);
    }
  }, [isOwner, router, username, recipeSlug]);

  if (!isOwner) return null;

  return (
    <EditRecipeForm data={data} username={username} recipeSlug={recipeSlug} />
  );
}

function EditRecipeForm({
  data,
  username,
  recipeSlug,
}: {
  data: ReturnType<typeof useGetRecipe>["data"];
  username: string;
  recipeSlug: string;
}) {
  const router = useNextRouter();
  const { data: categories } = useGetCategories();

  const recipe = data.recipes;
  const ingredients = data.ingredients;
  const instructions = data.instructions;
  const nutrition = data.nutrition;
  const tags = data.tags;
  const categoriesData = data.categories;
  const updateRecipe = useUpdateRecipe(username, recipeSlug);

  const path = `/${username}/recipes?recipeSlug=${recipeSlug}`;

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

  const [existingImageUrl, setExistingImageUrl] = useState(
    recipe.imageUrl ?? "",
  );
  const deleteRecipe = useDeleteRecipe();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await deleteRecipe.mutateAsync({ recipeId: recipe.id });
    toast.success("Recipe deleted successfully");
    router.push(`/${username}/recipes`);
  };

  const prepHours = recipe.prepTimeMinutes
    ? Math.floor(recipe.prepTimeMinutes / 60).toString()
    : "0";
  const prepMinutes = recipe.prepTimeMinutes
    ? (recipe.prepTimeMinutes % 60).toString()
    : "0";
  const cookHours = recipe.cookTimeMinutes
    ? Math.floor(recipe.cookTimeMinutes / 60).toString()
    : "0";
  const cookMinutes = recipe.cookTimeMinutes
    ? (recipe.cookTimeMinutes % 60).toString()
    : "0";

  const form = useForm<z.infer<typeof createRecipeSchema>>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: recipe.title,
      description: recipe.description ?? "",
      imageUrl: recipe.imageUrl ?? "",
      servings: recipe.servings?.toString() ?? "",
      cookingTime: { hours: cookHours, minutes: cookMinutes },
      prepTime: { hours: prepHours, minutes: prepMinutes },
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount ?? "",
        unit: ing.unit ?? "",
        isOptional: ing.isOptional ?? false,
      })),
      instructions: instructions
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((inst) => ({
          stepNumber: inst.stepNumber,
          instruction: inst.instruction,
        })),
      nutrition: nutrition.map((n) => ({
        nutrientName: n.nutrientName,
        amount: n.amount,
        unit: n.unit,
      })),
      tags: tags.map((t) => t.name),
      isPublic: recipe.isPublic ?? false,
      categoryIds: categoriesData.map((c) => c.categoryId),
    },
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
  } = useFieldArray({ control: form.control, name: "nutrition" });

  const watchTags = useWatch({ control: form.control, name: "tags" });

  const onSubmit = async (formData: z.infer<typeof createRecipeSchema>) => {
    try {
      let imageUrl = existingImageUrl;
      if (hasFile) {
        imageUrl = (await uploadFile()) || existingImageUrl;
      }

      await updateRecipe.mutateAsync(
        { recipeId: recipe.id, ...formData, imageUrl },
        {
          onSuccess: () => {
            toast.success("Recipe updated successfully");
            router.push(path);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      console.error("Recipe update error:", error);
      toast.error("Failed to update recipe");
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

  const isLoading = updateRecipe.isPending || isUploading;
  const displayImageUrl = previewUrl || existingImageUrl;

  return (
    <div>
      <div className="flex justify-between items-center pb-16">
        <AppTitle title="Edit recipe" className="mb-2" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-1.5 text-primary-200 border-primary-200 hover:border-primary-300 hover:text-primary-300"
          >
            <Trash2Icon className="size-4" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
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
              {displayImageUrl ? (
                <div className="relative w-full h-128 border rounded-lg overflow-hidden">
                  <Image
                    src={displayImageUrl}
                    alt="Recipe preview"
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeFile();
                      setExistingImageUrl("");
                    }}
                    className="absolute size-8 top-3 right-3 rounded-full"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg py-20 text-center">
                  <div className="space-y-4">
                    <div className="text-gray-600">
                      Upload Your Recipe Image
                    </div>
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
              {watchTags && watchTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {watchTags.map((tag, index) => (
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
            {isLoading ? "Updating..." : "Update Recipe"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {recipe.title}
              </span>
              ? This will permanently remove the recipe along with all its
              ingredients, instructions, reviews, comments, and saves. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteRecipe.isPending}
              className="bg-primary-200 hover:bg-primary-300 text-white"
            >
              {deleteRecipe.isPending ? "Deleting..." : "Delete Recipe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
