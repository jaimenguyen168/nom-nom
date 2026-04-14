import React from "react";

interface PrepInfoProps {
  prepTime: number;
  cookTime: number;
  serving: number;
}

const PrepInfo = ({ prepTime, cookTime, serving }: PrepInfoProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center bg-white py-6 gap-4 mb-6 text-center border-b border-t">
      <PrepItem label="Prep time" value={prepTime} unit="mins" />
      <PrepItem label="Cook time" value={cookTime} unit="mins" />
      <PrepItem label="Serving" value={serving} />
    </div>
  );
};

export default PrepInfo;

interface PrepItemProps {
  label: string;
  value: number;
  unit?: string;
}

const PrepItem = ({ label, value, unit }: PrepItemProps) => {
  return (
    <div className="flex-1 flex-col">
      <div className="font-semibold text-muted-foreground">{label}:</div>
      <div className="text-primary-200 font-bold">
        {value} {unit}
      </div>
    </div>
  );
};
