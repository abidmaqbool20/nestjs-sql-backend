<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient, scalable, and maintainable server-side applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" />
  </a>
</p>

---

## Description

This repository provides a **production-ready NestJS backend boilerplate** intended for real-world, scalable applications.

The architecture emphasizes:
- clear separation of concerns,
- strong configuration management,
- safe database migrations,
- background job processing,
- CLI tooling,
- caching,
- notifications,
- and environment-based execution.

The application supports **PostgreSQL and MySQL**, with the active database selected at runtime via environment variables.

---

## Features

- JWT Authentication (Passport-JWT)
- Global Exception Handling
- Centralized Logging Layer
- Helper Utilities Module
- API Rate Limiting
- Request Validation (`class-validator`)
- Encryption and Decryption Utilities
- PostgreSQL & MySQL support (runtime switchable)
- TypeORM with Migration-first workflow
- Roles & Permissions (RBAC)
- Users, Roles, Permissions modules with migrations
- Database Seeder implementation
- CRUD operations on User module
- Redis Cache
- Node Cache
- API Documentation (Swagger)
- Standardized API Response Layer
- Email sending (Handlebars templates)
- Email & Web Push Notifications
- Bull Queue Management
- Background Jobs
- Auto-discovered CLI Commands
- Postman API Collection

---

## Installation

Install project dependencies:

```bash
npm install

```  

## Environment Setup (Required)

Before running the application, you must create an environment file.
Create .env.development

```bash
cp .env.example .env.development
```

## Generating VAPID Keys (Web Push Notifications)

Web Push Notifications require VAPID public/private keys.

Generate them using:

```bash
npx web-push generate-vapid-keys
```

Example output:

Public Key:  BExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Private Key: 6Vxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


Add these values to your .env.development file:

VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here


## Running the Application
Development mode

```bash
npm run start
```
Watch mode (recommended during development)
```bash
npm run start:dev
```
Production mode
```bash
npm run start:prod
```

## Database Setup
Run Migrations (Required)

This step creates all database tables.
```bash
npm run migration:run
```
Seed Initial Data: Seed default data such as roles and permissions:
```bash
npm run seed
```
⚠️ Important:
Migrations must be executed before seeding.

## CLI Commands

The project includes a dynamic CLI system.
All commands are auto-discovered from the src/cli/commands directory.

List available commands
```bash
npm run cli -- --help
```
List Bull queues
```bash
npm run cli list-queues
```
Empty a queue

```bash
npm run cli empty-queue default all
```

## API Documentation

Swagger documentation is available at:
```bash
http://localhost:5001/api
```

## Author
Abid Maqbool
- Email - [abidmaqbool20@gmail.com](abidmaqbool20@gmail.com)
- Website - [https://abidmaqbool.com](https://abidmaqbool.com)
 

## License
This project is licensed under the MIT License.