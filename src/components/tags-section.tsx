import React from "react";

export interface Tag {
  id?: string;
  recipeId?: string;
  name?: string;
}

export interface TagsSectionProps {
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
}

const TagsSection = ({ tags, onTagClick }: TagsSectionProps) => {
  const handleTagClick = (tag: Tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (tags.length === 0) return null;

  return (
    <div className="w-full mx-auto bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tags</h2>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag)}
            className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default TagsSection;
