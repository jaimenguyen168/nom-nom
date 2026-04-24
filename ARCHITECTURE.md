# nom-nom

> This project uses Next.js, tRPC, and Neon Database to build a full-stack web application, likely with AI-powered features via Groq and OpenAI integrations.

`nextjs` `typescript` `react` `tailwindcss` `saas`

---

## Project Abstract

Nom Nom is a full-stack web application designed to revolutionize the way people discover, save, and share recipes. The platform allows users to create accounts, browse and save recipes, create and manage cookbooks, and engage with a community of fellow food enthusiasts. With a robust set of features and a user-friendly interface, Nom Nom aims to become the go-to destination for home cooks and professional chefs alike.

The project addresses the needs of users who are looking for a platform to discover new recipes, organize their favorite dishes, and connect with others who share similar interests. By providing a comprehensive and intuitive platform, Nom Nom seeks to make cooking more accessible, enjoyable, and social.

## High Level Requirements

The system must provide a seamless user experience, allowing users to easily navigate and interact with the platform. Key features include:

* User authentication and authorization
* Recipe browsing and searching
* Recipe saving and organization
* Cookbook creation and management
* Social features for engaging with other users
* Robust search and filtering capabilities

The system must be scalable, secure, and performant, ensuring a high level of availability and responsiveness.

## Conceptual Design

Nom Nom is built using a modern tech stack, leveraging the power of Next.js, tRPC, and Drizzle ORM. The application consists of a Next.js frontend, a tRPC API, and a Drizzle ORM database. The frontend provides a responsive and interactive user interface, while the API handles requests and interacts with the database.

The major components of the system include:

* A Next.js frontend, responsible for rendering the user interface and handling client-side logic
* A tRPC API, responsible for handling requests and interacting with the database
* A Drizzle ORM database, responsible for storing and retrieving data

Key libraries and frameworks used in the project include:

* Next.js for building the frontend
* tRPC for building the API
* Drizzle ORM for interacting with the database

## Background

The Nom Nom project was created to address the need for a comprehensive and user-friendly platform for discovering, saving, and sharing recipes. Existing solutions often lack a robust set of features, intuitive interfaces, or scalability.

The project specifically addresses the gaps in existing solutions by providing a full-stack platform that combines the power of a modern tech stack with a user-friendly interface.

## Required Resources

* Node.js and pnpm for development
* Next.js for building the frontend
* tRPC for building the API
* Drizzle ORM for interacting with the database
* Clerk for authentication and authorization
* Vercel for deployment

## Vision

The vision for Nom Nom is to create a platform that revolutionizes the way people discover, save, and share recipes. By providing a comprehensive and user-friendly platform, Nom Nom aims to become the go-to destination for home cooks and professional chefs alike.

The project seeks to make cooking more accessible, enjoyable, and social, and to create a community of users who can share and discover new recipes. With a robust set of features and a scalable architecture, Nom Nom is poised to become a leading platform in the food and cooking space.

---

## Requirements Specification

### System Overview

## Purpose & Scope
The Nom Nom system is a full-stack web application designed to facilitate the creation, sharing, and discovery of recipes and blogs. The system allows users to create accounts, save and share content, and interact with others through comments and likes. The system explicitly does not cover e-commerce or payment processing.

## System Goals
The Nom Nom system aims to achieve the following specific, measurable goals:

1. **Recipe and Blog Management**: Allow users to create, edit, and manage their own recipes and blogs.
2. **Content Discovery**: Provide users with a seamless way to discover new recipes and blogs through search, categorization, and trending content.
3. **User Engagement**: Foster a community of users who can interact with each other through comments, likes, and saves.
4. **Personalization**: Allow users to save and organize their favorite recipes and blogs for easy access.
5. **Content Creation**: Enable users to create and publish high-quality content, including recipes, blogs, and images.

## Key Features

* **User Authentication**: Secure user authentication and authorization through Clerk.
* **Recipe and Blog Creation**: Users can create and edit recipes and blogs with rich text, images, and tags.
* **Content Discovery**: Users can search, browse, and filter recipes and blogs by category, tag, and popularity.
* **User Interaction**: Users can comment, like, and save recipes and blogs.
* **Personalization**: Users can save and organize their favorite recipes and blogs.

## User Roles
The system has the following user roles:

* **Authenticated User**: A user who has created an account and logged in to the system. They can create, edit, and manage their own content, as well as interact with others.
* **Guest User**: A user who has not logged in to the system. They can view public content but cannot interact with others or create their own content.

## Assumptions & Constraints
The system is built on the following assumptions and constraints:

* **Content is User-Generated**: The system relies on users to create and publish high-quality content.
* **Scalability**: The system is designed to scale to meet the needs of a growing user base.
* **Security**: The system prioritizes user data security and authentication.

## Success Criteria
The system will be considered successful if it achieves the following measurable outcomes:

1. **User Adoption**: A minimum of 100 registered users within the first 6 weeks of launch.
2. **Content Creation**: A minimum of 500 recipes and blogs created within the first 3 months of launch.
3. **User Engagement**: A minimum of 100 comments and 500 likes within the first 2 months of launch.
4. **Retention**: A minimum of 75% of users return to the site within 30 days of their initial visit.
5. **Customer Satisfaction**: A minimum of 85% of users report being satisfied with the system through surveys and feedback.

### Architecture Diagram

The provided source code appears to be a Next.js project with a robust architecture, utilizing various technologies such as TypeScript, React, and tRPC. The project seems to be a recipe and blog platform, with features like user authentication, recipe and blog creation, and commenting.

The project structure is organized into several directories, including `src/app`, `src/components`, `src/trpc`, and `src/inngest`. The `src/app` directory contains the main application routes, including authentication, private, and public routes. The `src/components` directory contains reusable UI components, such as buttons, inputs, and layouts. The `src/trpc` directory contains the tRPC routers and procedures for handling API requests. The `src/inngest` directory contains Inngest client and functions for handling background tasks.

The project uses several libraries and frameworks, including:

* Next.js for the frontend and backend
* tRPC for building a typesafe API
* Clerk for user authentication
* Drizzle for database operations
* Inngest for background tasks

The project's architecture can be broken down into several layers:

* The `src/app` directory contains the main application routes, which handle client-side rendering and API requests.
* The `src/components` directory contains reusable UI components, which are used throughout the application.
* The `src/trpc` directory contains the tRPC routers and procedures, which handle API requests and interact with the database.
* The `src/inngest` directory contains Inngest client and functions, which handle background tasks and interact with the database.

The project's database schema is defined using Drizzle, which provides a typesafe way to interact with the database. The schema includes tables for users, recipes, blogs, comments, and more.

Overall, the project's architecture is well-organized, scalable, and maintainable. It utilizes modern technologies and frameworks to provide a robust and efficient platform for building a recipe and blog application.

The project also uses a HydrateClient component to prefetch data on the server-side, which helps to improve performance and SEO. The prefetching is done using tRPC's queryOptions, which allows for efficient data fetching and caching.

The project's use of Inngest for background tasks and tRPC for API requests provides a robust and scalable way to handle complex operations. The project's architecture also allows for easy extension and modification, making it a great foundation for future development. 

In the `next.config.ts` file, the `images` property is used to configure remote patterns for images, which allows the application to fetch images from various sources. The `allowedDevOrigins` property is used to configure allowed origins for development, which helps to prevent CORS issues.

The project's use of Clerk for user authentication provides a secure and scalable way to handle user authentication. The project's architecture also allows for easy integration with other authentication providers.

The project's database schema is designed to handle complex relationships between recipes, blogs, comments, and users. The use of Drizzle provides a typesafe way to interact with the database, which helps to prevent errors and improve maintainability.

The project's use of tRPC provides a typesafe way to handle API requests, which helps to prevent errors and improve maintainability. The project's architecture also allows for easy extension and modification of API requests.

The project's use of Inngest provides a scalable way to handle background tasks, which helps to improve performance and efficiency. The project's architecture also allows for easy integration with other background task providers.

Overall, the project's architecture is well-designed, scalable, and maintainable. It utilizes modern technologies and frameworks to provide a robust and efficient platform for building a recipe and blog application. 

The code organization and structure are clear and easy to follow. The use of descriptive variable names and comments helps to understand the code. The project's architecture is modular and allows for easy extension and modification. 

The project's use of modern technologies and frameworks provides a great foundation for future development and scalability.

---

*Generated by [StackCraft](https://stackcraft.dev) · [View repo](https://github.com/jaimenguyen168/nom-nom)*
