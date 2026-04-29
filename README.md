# nom-nom

<img width="1200" height="600" alt="nomnom" src="https://github.com/user-attachments/assets/7255eda2-d644-4d1b-848b-92dcb8057858" />

<br />

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
2. 🔋 [Key Features](#key-features)
3. 📌 [Getting Started](#getting-started)

---

## <a name="project-overview">📋 Project Overview</a>

Nom-nom is a full-stack web application designed to streamline recipe and meal planning for home cooks and food enthusiasts. Users can discover, create, edit, and share recipes and blogs, as well as organize their favorites into cookbooks. The platform leverages AI-powered agents to assist with content generation, making it easy to produce high-quality recipes and blogs. With built-in community features such as commenting, liking, and rating, alongside secure authentication and subscription-based billing, Nom-nom provides a comprehensive and engaging experience for anyone passionate about cooking and food.

## <a name="key-features">🔋 Key Features</a>

- 👉 **User Authentication**: secure login and registration using Clerk <br />
- 👉 **Recipe & Blog Management**: create, edit, and manage your own recipes and blogs <br />
- 👉 **AI-Powered Content Generation**: generate high-quality recipes and blogs using AI agents <br />
- 👉 **Digital Cookbook Marketplace**: sell and purchase digital cookbooks from other creators <br />
- 👉 **Discovery & Saving**: discover and save recipes and blogs from other users <br />
- 👉 **Follow Your Favorite Chefs**: stay updated with content from chefs you follow <br />
- 👉 **Billing & Subscription**: premium features and subscription-based billing <br />

## 🚀 Upcoming Features

- 👉 **Tutorial Videos**: step-by-step cooking videos alongside recipes <br />
- 👉 **Meal Planning**: plan your meals for the week with ease <br />
- 👉 **Meal Tracking History**: keep track of what you've cooked over time <br />
- 👉 **Personalized Recommendations**: recipe and blog suggestions tailored to your preferences and needs <br />

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
