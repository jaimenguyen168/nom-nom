"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export type Category = {
  id: string;
  key: string;
  name: string;
  imageUrl: string;
};

const CategoryItem = ({ category }: { category: Category }) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(
          `/categories/${category.key}?categoryName=${encodeURIComponent(category.name)}`,
        )
      }
      className="flex flex-col items-center text-center cursor-pointer"
    >
      <div className="size-36 md:size-32 xl:size-40 overflow-hidden rounded-full shadow-md">
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <p className="mt-3 text-sm font-medium text-gray-800">{category.name}</p>
    </div>
  );
};

export default CategoryItem;
