# nom-nom

> This project uses Next.js, tRPC, and Neon Database to create a full-stack web application, likely with AI-powered features via @ai-sdk/groq and @ai-sdk/openai integrations.

<div align="center">
  <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="Next.js" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/-tRPC-black?style=for-the-badge&logoColor=white&logo=trpc&color=2596BE" alt="tRPC" />
</div>

## 📋 <a name="table-of-contents">Table of Contents</a>

1. ✨ [Introduction](#introduction)
2. 📋 [Requirements Specification](#requirements-specification)
3. 📌 [Getting Started](#getting-started)

---

## <a name="introduction">✨ Introduction</a>

## Project Abstract

NomNom is a comprehensive recipe and food blog platform designed to streamline content creation, discovery, and community engagement. The platform caters to food enthusiasts, bloggers, and recipe creators, offering tools for creating, sharing, and managing recipes and blog posts. With a robust set of features, NomNom aims to foster a vibrant community around food, enabling users to explore new recipes, save favorites, and connect with like-minded individuals.

## High Level Requirements

The system must provide an intuitive and engaging experience for users, allowing them to effortlessly browse, create, and manage recipes and blog posts. Key functionalities include user authentication, recipe and blog post creation, editing, and publishing; categorization and tagging; search and filtering; and a user-friendly interface for saving and discovering content. The platform should also support agent-based features for automated content generation and management.

## Conceptual Design

NomNom is built as a web application using Next.js, with a robust backend powered by tRPC and Drizzle. The system consists of several major components:

*   **Client-side**: A responsive Next.js application handling user interactions, rendering pages, and managing client-side state.
*   **Server-side**: tRPC-powered API routes manage data fetching, mutations, and authentication.
*   **Database**: Drizzle provides a scalable and efficient database solution for storing and retrieving data.

The platform utilizes Clerk for authentication and authorization, ensuring secure and seamless user onboarding.

## Background

Existing food blog and recipe platforms often lack comprehensive features, intuitive interfaces, or scalable architectures. NomNom addresses these gaps by providing a cohesive solution that streamlines content creation, discovery, and community engagement.

The current landscape of food blogging and recipe platforms is fragmented, with many solutions focusing on specific aspects, such as recipe creation or social sharing. NomNom integrates these features, offering a unified platform for users to create, share, and engage with food-related content.

## Required Resources

*   **Development tools**: TypeScript, Next.js, tRPC, Drizzle, Clerk
*   **Infrastructure**: Vercel, Neon Database
*   **Services**: Clerk for authentication, Inngest for agent-based features

These resources enable the development and deployment of a scalable, secure, and feature-rich platform for food enthusiasts and content creators.

---

## <a name="requirements-specification">📋 Requirements Specification</a>

### System Overview

## Purpose & Scope

The NomNom system is a full-stack web application designed to facilitate the creation, sharing, and discovery of recipes and blogs. It allows users to create and manage their own content, interact with others, and save their favorite recipes and blogs. The system is built using Next.js, TypeScript, and a range of supporting technologies.

The system explicitly does not cover e-commerce or payment processing; its primary focus is on content creation and community engagement.

## System Goals

The NomNom system aims to achieve the following specific, measurable goals:

👉 **Enable users to easily create and manage recipes and blogs**: Provide a user-friendly interface for creating, editing, and publishing recipes and blogs.
👉 **Facilitate discovery and exploration of content**: Implement features that help users find and engage with recipes and blogs that match their interests.
👉 **Foster community engagement and interaction**: Allow users to save, comment on, and share recipes and blogs, promoting interaction and discussion.
👉 **Provide a seamless and responsive user experience**: Ensure that the system is accessible and usable across a range of devices and browsers.
👉 **Ensure data consistency and integrity**: Implement robust data modeling and validation to maintain the accuracy and reliability of user-generated content.

## Key Features

The NomNom system offers the following key features:

👉 **Recipe and blog creation**: Users can create and manage their own recipes and blogs, including adding images, tags, and categories.
👉 **Content discovery**: Users can browse and search for recipes and blogs, filtering by tags, categories, and other criteria.
👉 **Saving and favoriting**: Users can save and favorite recipes and blogs, allowing them to easily access and share their favorite content.
👉 **Commenting and discussion**: Users can comment on recipes and blogs, facilitating discussion and community engagement.
👉 **User profiles and authentication**: Users can create and manage their own profiles, including uploading profile pictures and managing their account settings.

## User Roles

The NomNom system has the following user roles:

👉 **Authenticated users**: Users who have created an account and are logged in to the system. They can create and manage their own content, interact with others, and save their favorite recipes and blogs.
👉 **Guests**: Users who are not logged in to the system. They can view and search for recipes and blogs, but cannot create or interact with content.

## Assumptions & Constraints

The NomNom system is built on the following assumptions:

👉 **User-generated content**: The system relies on users creating and sharing their own recipes and blogs.
👉 **Community engagement**: The system assumes that users will interact with each other and with the content on the platform.

The system has the following known limitations and constraints:

👉 **Scalability**: The system's ability to handle large volumes of user-generated content and traffic.
👉 **Data consistency**: The system's ability to maintain the accuracy and reliability of user-generated content.

## Success Criteria

The NomNom system will be considered successful if it achieves the following measurable outcomes:

👉 **User adoption**: A significant number of users create accounts and engage with the system.
👉 **Content creation**: A substantial amount of high-quality, user-generated content is created and shared on the platform.
👉 **Community engagement**: Users actively interact with each other and with the content on the platform, including commenting, saving, and sharing recipes and blogs.
👉 **Retention and growth**: Users continue to use and engage with the system over time, and the user base grows steadily.

### Architecture Diagram

The provided source code appears to be a Next.js project that utilizes various technologies such as TypeScript, tRPC, Clerk, and Drizzle. 

The project follows a standard Next.js file structure, with pages organized into different routes. For instance, authentication-related pages are located in `src/app/(auth)`, while private and public pages are located in `src/app/(private)` and `src/app/(public)`, respectively.

The project uses tRPC for building APIs, with procedures defined in separate files under `src/trpc/routers`. These procedures interact with a database using Drizzle, and some of them utilize Clerk for authentication.

Several reusable UI components are defined throughout the project, such as `AppBreadcrumb`, `AppLogo`, `AppPagination`, and `CallToAction`. These components are likely used across multiple pages to provide a consistent user experience.

The project's configuration files, such as `next.config.ts` and `tsconfig.json`, are also provided. The `next.config.ts` file defines the project's Next.js configuration, while the `tsconfig.json` file specifies the TypeScript compiler options.

The project's architecture can be broken down into the following layers:

👉 **Presentation Layer**: This layer consists of the React components that make up the user interface, such as pages, layouts, and reusable UI components.
👉 **API Layer**: This layer consists of the tRPC procedures that define the API endpoints, which interact with the database and other external services.
👉 **Database Layer**: This layer consists of the Drizzle configuration and database schema, which define how data is stored and retrieved.
👉 **Authentication Layer**: This layer consists of Clerk, which handles user authentication and authorization.

Overall, the project appears to be a well-structured Next.js application that utilizes various technologies to provide a robust and scalable architecture. 

The tech stack used in the project offers several benefits, including:

👉 **Type Safety**: TypeScript provides type safety features that help catch errors at compile-time rather than runtime.
👉 **Efficient API Development**: tRPC provides a efficient way to build APIs, with features such as automatic API documentation and type safety.
👉 **Authentication and Authorization**: Clerk provides a robust authentication and authorization system that integrates well with the project's API layer.
👉 **Database Interaction**: Drizzle provides a simple and efficient way to interact with the database, with features such as automatic query generation and caching. 

However, without more context about the project's requirements and goals, it's difficult to provide a more detailed analysis of the architecture. 

Some areas that could be improved or explored further include:

👉 **Error Handling**: The project could benefit from a more robust error handling system, with features such as centralized error logging and error pages.
👉 **Security**: The project could benefit from additional security features, such as input validation and rate limiting.
👉 **Performance Optimization**: The project could benefit from performance optimization techniques, such as code splitting and caching. 

Overall, the project appears to be well-structured and maintainable, with a clear separation of concerns and a robust tech stack.

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
