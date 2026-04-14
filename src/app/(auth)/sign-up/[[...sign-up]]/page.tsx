import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <SignUp
      appearance={{
        elements: {
          cardBox: "border! shadow-none! rounded-lg!",
        },
      }}
    />
  );
};

export default SignUpPage;
