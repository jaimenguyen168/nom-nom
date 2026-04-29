# nom-nom

> Here is a one-sentence description based on the source code:

This project uses Next.js, TypeScript, and tRPC to build a web application, likely a food-related platform given the "nom-nom" name.

<div align="center">
  <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="Next.js" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/-tRPC-black?style=for-the-badge&logoColor=white&logo=trpc&color=2596BE" alt="tRPC" />
</div>

## 📋 <a name="table-of-contents">Table of Contents</a>

1. 📋 [Requirements Specification](#requirements-specification)
2. 📌 [Getting Started](#getting-started)

---

## <a name="requirements-specification">📋 Requirements Specification</a>

### System Overview

## Project Overview

Nom-nom is a full-stack web application designed to streamline recipe and meal planning. The platform allows users to discover, create, and share recipes, as well as save and organize their favorite cookbooks. With a focus on user engagement and community building, Nom-nom aims to become the go-to destination for home cooks and food enthusiasts.

The application offers a range of features, including user authentication, recipe creation and editing, cookbook management, and social sharing. By providing a seamless and intuitive user experience, Nom-nom seeks to make cooking and meal planning easier, more enjoyable, and more accessible to everyone.

Nom-nom differentiates itself from existing solutions through its emphasis on community features, such as user-generated recipes, reviews, and ratings. The platform also leverages AI-powered agents to assist users with recipe creation and meal planning, making it a unique and innovative solution in the market.

In addition to recipes, Nom-nom allows users to create and share blogs, providing a comprehensive platform for food enthusiasts to share their passion for cooking and food.


## High Level Requirements

The Nom-nom system must provide a user-friendly interface for discovering, creating, and sharing recipes and blogs, as well as managing cookbooks and interacting with the community. From the user's perspective, the system should allow for easy navigation, intuitive recipe and blog creation and editing, and seamless social sharing.

Key user needs and workflows include:

* User authentication and profile management

* Recipe creation, editing, and deletion

* Blog creation, editing, and deletion

* Cookbook management, including creation, editing, and saving

* Social sharing and community engagement, including commenting, liking, and rating

* AI-powered recipe and blog suggestions and meal planning assistance

The system should be designed to handle a large volume of user-generated content, including recipes, blogs, and user interactions.


## Conceptual Design

Nom-nom is a web application built using a Next.js frontend and a tRPC backend. The application features a client-side rendered interface, with server-side rendering enabled for improved performance and SEO.

## Existing Documentation
### Architecture Diagram (diagram)
The nom-nom application is built on a robust tech stack, leveraging various libraries and frameworks to provide a seamless user experience.

At its core, the application utilizes Next.js as its React framework, with TypeScript as the primary programming language. The tech stack also includes several key dependencies such as `@ai-sdk/groq`, `@ai-sdk/openai`, `@base-ui/react`, `@clerk/nextjs`, `@hookform/resolvers`, `@neondatabase/serverless`, `@phosphor-icons/react`, `@stripe/stripe-js`, `@tailwindcss/typography`, `@tanstack/react-query`, `@trpc/client`, `@trpc/server`, `@trpc/tanstack-react-query`, ai, class-variance-authority, client-only, clsx, cmdk, date-fns, dotenv, drizzle-orm, embla-carousel-react, inngest, input-otp, lucide-react, motion, nanoid, next, next-themes, prettier, radix-ui, react, react-day-picker, react-dom, react-error-boundary, react-hook-form, react-icons, react-resizable-panels, recharts, server-only, shadcn, sonner, stripe, superjson, svix, tailwind-merge, tw-animate-css, vaul, zod

### System Overview (document)
## Purpose & Scope
The nom-nom system is a full-stack web application designed to allow users to create, share, and discover recipes and blogs. The system enables users to save and organize their favorite recipes and blogs, and provides features such as user authentication, billing, and agent-based content generation.

The system does not cover traditional e-commerce functionality, such as payment processing for physical goods, nor does it focus on social media-style interactions between users.

## System Goals
The nom-nom system aims to achieve the following specific, measurable goals:

* Allow users to easily create and manage their own recipes and blogs

* Provide a robust and scalable platform for users to discover and save recipes and blogs

* Enable users to generate high-quality content using agent-based tools

* Ensure secure and reliable user authentication and authorization

* Implement a fair and transparent billing system for premium features

## Key Features
The nom-nom system offers the following key features:

👉 **User Authentication**: secure login and registration functionality using Clerk

👉 **Recipe and Blog Management**: users can create, edit, and manage their own recipes and blogs
👉 **Content Generation**: agent-based tools for generating high-quality recipes and blogs

👉 **Discovery and Saving**: users can discover and save recipes and blogs from other users
👉 **Billing and Subscription**: premium features and subscription-based billing

## User Roles
The nom-nom system has the following user roles:

👉 **Authenticated User**: a user who has registered and logged in to the system

👉 **Recipe and Blog Author**: a user who has created and published recipes and blogs
👉 **Subscriber**: a user who has subscribed to premium features

## Assumptions & Constraints
The nom-nom system is built on the following assumptions:

* Users will have a reliable internet connection and a modern web browser

* Users will have a valid email address and be able to verify their account

* The system will be deployed on a cloud-based infrastructure with scalable resources

The system has the following known limitations and constraints:

* Limited support for older browsers and devices

* Dependence on third-party services for authentication and billing

## Success Criteria
The nom-nom system will be considered successful if it achieves the following measurable outcomes:

👉 **User Adoption**: a minimum of 1,000 registered users within the first 6 months

👉 **Engagement**: an average of 10 user interactions per day (e.g. creating, saving, or viewing recipes and blogs)
👉 **Revenue Growth**: a minimum of $1,000 in monthly recurring revenue within the first year

👉 **Customer Satisfaction**: an average rating of 4.5/5 stars in user reviews and feedback

---

## <a name="getting-started">📌 Getting Started</a>

### Installation

First, run the development server:

```bash
npm run dev
```


---

<div align="center">
  <p>Built with ❤️ using <a href="https://stackcraft.dev">StackCraft</a> · <a href="https://github.com/jaimenguyen168/nom-nom">View Repository</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
