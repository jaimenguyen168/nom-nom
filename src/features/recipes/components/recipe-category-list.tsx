// import React from "react";
// import Image from "next/image";
// import { FlameIcon } from "lucide-react";
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import StarRatings from "@/components/star-ratings";
//
// type RecipeFeedType = "trending" | "popular" | "new" | "a_z" | "relevance";
//
// export interface RecipeCategoryListProps {
//   categoryTitle: string;
//   category: RecipeFeedType;
// }
//
// const RecipeCategoryList = ({
//   categoryTitle,
//   category,
// }: RecipeCategoryListProps) => {
//   const trpc = useTRPC();
//   const { data } = useSuspenseQuery(
//     trpc.recipes.getMany.queryOptions({
//       pageSize: 3,
//       sortBy: category,
//       timeframe: "week",
//     }),
//   );
//
//   if (!data || data.items.length === 0) {
//     return null;
//   }
//
//   const { items: recipes } = data;
//
//   return (
//     <div className="w-full mx-auto bg-white">
//       <h2 className="text-xl font-bold text-gray-800 mb-4">{categoryTitle}</h2>
//
//       <div className="space-y-4">
//         {recipes.map((recipe) => (
//           <Link
//             key={recipe.id}
//             className="flex items-center gap-4 rounded-lg hover:bg-gray-50 transition-colors"
//             href={`/recipes/${recipe.id}`}
//           >
//             <div className="shrink-0">
//               <Image
//                 src={recipe.imageUrl || "/no-image.svg"}
//                 alt={recipe.title}
//                 width={200}
//                 height={200}
//                 className="w-40 h-24 rounded-md object-cover"
//               />
//             </div>
//
//             <div className="flex-1 min-w-0 space-y-1">
//               <h3 className="text-gray-800 font-medium text-sm leading-tight line-clamp-2">
//                 {recipe.title}
//               </h3>
//
//               <StarRatings rating={recipe.rating as unknown as number} />
//
//               <div className="flex items-center gap-1 mt-2 ">
//                 <FlameIcon className="w-4 h-4 text-primary-200" />
//                 <span className="text-gray-500 text-sm pt-0.5">
//                   {recipe?.calories as number} cals
//                 </span>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default RecipeCategoryList;
