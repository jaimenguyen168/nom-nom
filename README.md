# nom-nom

> Here is a one-sentence description based on the source code:

This project uses Next.js, TypeScript, and tRPC to build a web application, likely a food-related platform given the "nom-nom" name.

<div align="center">
  <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="Next.js" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/-tRPC-black?style=for-the-badge&logoColor=white&logo=trpc&color=2596BE" alt="tRPC" />
  <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/-OpenAI-black?style=for-the-badge&logoColor=white&logo=openai&color=412991" alt="OpenAI" />
  <img src="https://img.shields.io/badge/-shadcn/ui-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/-Clerk-black?style=for-the-badge&logoColor=white&logo=clerk&color=6C47FF" alt="Clerk" />
</div>

## 📋 <a name="table-of-contents">Table of Contents</a>

1. 📋 [Project Overview](#project-overview)
2. 📌 [Getting Started](#getting-started)

---

## <a name="project-overview">📋 Project Overview</a>

Nom-nom is a full-stack web application designed to streamline recipe and meal planning. The platform allows users to discover, create, and share recipes, as well as save and organize their favorite cookbooks. With a focus on user engagement and community building, Nom-nom aims to become the go-to destination for home cooks and food enthusiasts.

The application offers a range of features, including user authentication, recipe creation and editing, cookbook management, and social sharing. By providing a seamless and intuitive user experience, Nom-nom seeks to make cooking and meal planning easier, more enjoyable, and more accessible to everyone.

Nom-nom differentiates itself from existing solutions through its emphasis on community features, such as user-generated recipes, reviews, and ratings. The platform also leverages AI-powered agents to assist users with recipe creation and meal planning, making it a unique and innovative solution in the market.

In addition to recipes, Nom-nom allows users to create and share blogs, providing a comprehensive platform for food enthusiasts to share their passion for cooking and food.

## Key Features

👉 **User Authentication**: secure login and registration functionality using Clerk
👉 **Recipe and Blog Management**: users can create, edit, and manage their own recipes and blogs
👉 **Content Generation**: agent-based tools for generating high-quality recipes and blogs
👉 **Discovery and Saving**: users can discover and save recipes and blogs from other users
👉 **Billing and Subscription**: premium features and subscription-based billing

---

## <a name="getting-started">📌 Getting Started</a>

### Installation

**Clone the repository**

```bash
git clone https://github.com/jaimenguyen168/nom-nom.git
cd nom-nom
```

**Install dependencies**

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

CLERK_WEBHOOK_SECRET=

# Neon
DATABASE_URL=

# Inngest
INNGEST_DEV=1

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# APP URL
APP_URL=http://localhost:3000/

# OpenAI
OPENAI_API_KEY=
GROQ_API_KEY=

# Unsplash
UNSPLASH_ACCESS_KEY=
UNSPLASH_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Install dependencies**

```bash
pnpm install
```

**Run the development server**

```bash
pnpm dev
```

**Run Drizzle Studio**

```bash
pnpm db:studio
```

**Run Inngest Dev Server**

```bash
pnpm dlx inngest-cli@latest dev
```

---

<div align="center">
  <p>Built with ❤️ using <a href="https://stackcraft.dev">StackCraft</a> · <a href="https://github.com/jaimenguyen168/nom-nom">View Repository</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
