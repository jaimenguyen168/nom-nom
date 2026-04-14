import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <SignIn
      appearance={{
        elements: {
          cardBox: "border! shadow-none! rounded-lg!",
        },
      }}
    />
  );
};

export default SignInPage;
