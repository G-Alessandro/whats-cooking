# What's Cooking

Mobile application developed with React Native and Expo to find recipes based on available ingredients or discover new ones.

The project includes a mobile frontend, a REST API backend, and a PostgreSQL database.

<img src="./readme-assets/app-image.gif" alt="What's Cooking Demo" width="200">
 
## Demo

The APK can be installed directly on an Android device. No Google Play Store installation is required.

[**Download Android APK**](https://github.com/G-Alessandro/whats-cooking/releases/latest)

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Infrastructure](#infrastructure)
- [Running the project locally](#running-the-project-locally)
- [Testing](#testing)
- [Deployment](#deployment)
- [Android Build](#android-build)
- [Credits](#credits)

## Features

- User registration and authentication
- Recipe search
- Recipe instructions
- Add and remove favorite recipes

## Technologies

### Mobile

- React Native
- Expo
- TypeScript
- Zod

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod
- Vitest
- Supertest

## Infrastructure

- Docker
- Fly.io
- Neon PostgreSQL
- EAS Build

## Running the project locally

### Prerequisites

- Node.js
- npm
- Docker
- Android Studio / Android Emulator

### Mobile

From the project root:

```bash
 cd mobile
```

```bash
npm install
```

Create your environment variables using .env.example.

##### Start Expo:

```bash
npm start
```

### Backend

From the project root:

```bash
cd backend
```

```bash
npm install
```

Create your environment variables using .env.example.

Run the development server:

```bash
npm run dev
```

## Testing

The backend includes automated tests using:

- Vitest
- Supertest
- Prisma
- PostgreSQL test database

Start the test database with Docker:

```bash
docker compose up -d
```

Run the tests:

```bash
npm test
```

Stop the test database with:

```bash
docker compose down
```

## Deployment

The backend is deployed on Fly.io and uses Neon PostgreSQL as the production database.

## Android Build

Android builds are generated using EAS Build.

To create a preview APK:

```bash
eas build --platform android --profile preview
```

## Credits

### SVG

- [Favorite Outline](https://www.svgrepo.com/svg/485518/favorite?edit=true)
- [Favorite Filled](https://www.svgrepo.com/svg/485564/favorite)
- [Loading](https://www.svgrepo.com/svg/485087/loading-part-2)
