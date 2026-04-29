import React from "react";

interface Props {
  icon: React.ReactNode;
  message: string;
}

export function UserEmptyState({ icon, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      {icon}
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
