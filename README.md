# Mumii Mono-repo

A modern mobile-first Next.js application with internationalization support and microservices architecture.

## 🏗️ Architecture

```
mumii/
├── apps/
│   └── frontend/          # Next.js frontend application
├── services/
│   └── api-service/       # Express.js API service
└── package.json           # Root workspace configuration
```

## 🚀 Features

### Frontend (Next.js)

- ✅ **Mobile-first design** - Responsive layouts optimized for mobile devices
- ✅ **Internationalization (i18n)** - Support for Vietnamese and English
- ✅ **Modern UI components** - Built with Tailwind CSS and Lucide React icons
- ✅ **TypeScript** - Full type safety across the application
- ✅ **Optimized performance** - Next.js 15 with Turbopack

### API Service (Express.js)

- ✅ **RESTful API** - Express.js with TypeScript
- ✅ **CORS enabled** - Configured for frontend integration
- ✅ **Security headers** - Helmet.js for security
- ✅ **Environment configuration** - Dotenv for configuration management

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mumii
   ```

2. **Install all dependencies**

   ```bash
   npm install
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # For API service
   cp services/api-service/.env.example services/api-service/.env
   ```

### 🚦 Running the Applications

#### Frontend Development

```bash
# Start frontend only
npm run dev:frontend
# or
npm run dev
```

Frontend will be available at: http://localhost:3000

#### API Service Development

```bash
# Start API service only
npm run dev:api
```

API service will be available at: http://localhost:3001

#### Full Stack Development

```bash
# Terminal 1: Start API service
npm run dev:api

# Terminal 2: Start frontend
npm run dev:frontend
```

## 📱 Mobile-First Design

The application is built with a mobile-first approach:

- **Responsive breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Touch-friendly interactions**: Minimum 44px touch targets
- **Mobile navigation**: Collapsible menu for small screens
- **Optimized layouts**: Grid and flexbox layouts that adapt to screen size

## 🌐 Internationalization

The application supports multiple languages:

- **English (en)** - Default language
- **Vietnamese (vi)** - Secondary language

### Adding New Languages

1. Create locale files in `apps/frontend/src/locales/[lang]/`
2. Add language to the supported languages list in `i18n.ts`
3. Update the language selector component

### Language Files Structure

```
src/locales/
├── en/
│   ├── common.json      # Common translations
│   └── navigation.json  # Navigation translations
└── vi/
    ├── common.json
    └── navigation.json
```

## 🧪 Available Scripts

### Root Level

- `npm run dev` - Start frontend development server
- `npm run dev:frontend` - Start frontend only
- `npm run dev:api` - Start API service only
- `npm run build` - Build frontend for production

### Frontend Specific

- `npm run lint` - Run ESLint

## 🔧 Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Lucide React** - Icon library
- **react-i18next** - Internationalization

### API Service

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
