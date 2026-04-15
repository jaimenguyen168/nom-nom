import React from "react";

export interface Instruction {
  id: string;
  instruction: string;
  recipeId: string;
  stepNumber: number;
}

interface InstructionsInfoProps {
  instructions: Instruction[];
}

const InstructionsInfo = ({ instructions }: InstructionsInfoProps) => {
  const sortedInstructions = [...instructions].sort(
    (a, b) => a.stepNumber - b.stepNumber,
  );

  return (
    <div className="mb-8">
      {/* Instructions Header */}
      <h2 className="text-2xl font-semibold mb-4">Instructions:</h2>

      {/* Instructions List */}
      <div className="space-y-4">
        {sortedInstructions.map((instruction) => (
          <div key={instruction.id} className="flex gap-3 items-start">
            {/* Step Number Circle */}
            <div
              className={`shrink-0 w-5 h-5 text-white bg-primary-200 rounded-md flex items-center justify-center font-semibold text-sm mt-0.5`}
            >
              {instruction.stepNumber}
            </div>

            {/* Instruction Text */}
            <p className="text-gray-700">{instruction.instruction}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InstructionsInfo;
