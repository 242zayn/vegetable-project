# Vegetable Seller Project - Backend Context

## 🎯 Project Overview
This is a "Vegetable Seller" backend project created for learning purposes. It focuses on mastering backend development, specifically with **NestJS**, **MongoDB (Mongoose)**, and building robust REST APIs.

## 🛠️ Tech Stack
- **Framework:** NestJS (Node.js) *(Note: Often confused with Next.js, but this repository specifically contains the NestJS backend)*
- **Database:** MongoDB
- **ORM/ODM:** Mongoose (`@nestjs/mongoose`)
- **Authentication:** JWT (`@nestjs/jwt`), Passport (`passport-jwt`)
- **Security:** bcrypt (Password hashing)
- **Validation:** `class-validator`, `class-transformer` (used via Global Pipes)
- **Language:** TypeScript

## 📂 Project Structure & Modules
The application is structured in standard NestJS architecture, grouped by domain modules inside `src/modules/`:
- `AuthModule`: Authentication, login, and JWT validation.
- `UsersModule`: User schema and profile management.
- `ShopsModule`: Vegetable seller shop details.
- `CategoriesModule` & `ProductsModule`: Managing product catalogs.
- `CartModule` & `OrdersModule`: Handling the e-commerce flow.
- `ReviewsModule` & `VisitsModule`: Managing feedback and analytics.
- `AdminModule`: Admin-specific endpoints.

## 📝 Key Commands
- `npm run start:dev` - Start the server in watch mode (Development).
- `npm run build` - Build the project for production.
- `npm run format` - Format the code with Prettier.

## 🤖 Instructions for AI / Claude
When analyzing or generating code for this repository, please adhere to the following rules:
1. **Teaching Focus:** The user is actively learning backend development. Provide clear explanations for *why* a particular NestJS or MongoDB pattern is being used.
2. **NestJS Patterns:** Stick to standard NestJS decorators, dependency injection, and separation of concerns (Controller for routing, Service for business logic).
3. **Database Interactions:** Use `@InjectModel()` for Mongoose models. Ensure proper asynchronous handling (`async/await`) for database queries.
4. **Validation:** Ensure all incoming request payloads are validated using DTO classes with `class-validator` decorators. The app uses `ValidationPipe` globally.
5. **Code Style:** Keep TypeScript code strictly typed. Use interfaces for complex return types where appropriate.
