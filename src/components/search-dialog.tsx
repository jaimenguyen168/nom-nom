import React from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const SearchDialog = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {}}
      className="py-6 rounded-full text-gray-500 hover:text-primary-200 hover:bg-transparent"
      aria-label="Search"
    >
      <SearchIcon className="size-6" />
    </Button>
  );
};
export default SearchDialog;
