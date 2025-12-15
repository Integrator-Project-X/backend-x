Sure! Here's the updated **README** with the changes related to **Appointments** and additional modifications for ownership and security:

---

# VetConnect Backend 🐾

**NestJS · TypeORM · PostgreSQL · JWT** — *Docker-first for local dev*

Welcome to the backend API for **VetConnect**, a veterinary platform that brings together **pet owners (CLIENT)** and **veterinary clinics (VET)**.
This repo contains a **NestJS + TypeORM** API with **PostgreSQL** and **JWT authentication**, fully **dockerized** so you can get it running locally with minimal fuss.

If your goal is: *clone → run → login → hit endpoints*… you’re in the right place.

---

## Table of Contents

* [What is VetConnect?](#what-is-vetconnect)
* [Tech Stack](#tech-stack)
* [Roles at a Glance](#roles-at-a-glance)
* [Auth & Identity Model](#auth--identity-model)

  * [Access vs User](#access-vs-user)
  * [JWT Payload](#jwt-payload)
* [Core User Flows](#core-user-flows)

  * [CLIENT (Pet Owner)](#client-pet-owner)
  * [VET (Clinic)](#vet-clinic)
  * [ADMIN](#admin)
* [Appointments & Ownership](#appointments--ownership)

  * [Appointment Creation (CLIENT)](#appointment-creation-client)
  * [Appointment Management (VET)](#appointment-management-vet)
  * [Ownership Enforcement](#ownership-enforcement)
* [Run Locally with Docker](#run-locally-with-docker)
* [Environment Variables](#environment-variables)
* [Test Credentials](#test-credentials)
* [API Examples](#api-examples)

  * [Login](#login)
  * [Get My Profile](#get-my-profile)
  * [Create a Pet (CLIENT)](#create-a-pet-client)
  * [List My Pets (CLIENT)](#list-my-pets-client)
  * [Create an Appointment (CLIENT)](#create-an-appointment-client)
  * [Cancel an Appointment (CLIENT)](#cancel-an-appointment-client)
* [Security Notes](#security-notes)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## What is VetConnect?

VetConnect is built to streamline the relationship between:

* **Pet Owners** who want to register pets, book appointments, and track medical history.
* **Veterinary Clinics** that manage clinic profiles, schedules, appointments, and services.

This backend provides:

* Secure **JWT auth** + role-based authorization (**CLIENT**, **VET**, **ADMIN**)
* **Ownership protections** (so users can’t touch what they don’t own)
* Consistent API behavior via global interceptors/filters

---

## Tech Stack

* **NestJS** — API framework
* **TypeORM** — database ORM
* **PostgreSQL** — primary database
* **JWT** — authentication tokens
* **Docker / Docker Compose** — local environment & reproducible setup

---

## Roles at a Glance

### CLIENT (Pet Owner)

A standard user who can:

* Create & manage **their own pets**
* Create & manage **their own appointments**
* View diagnoses and medical records tied to their visits

### VET (Clinic)

A veterinary clinic account that can:

* Manage the clinic profile
* View/manage appointments associated with the clinic
* Access clinic-scoped resources such as schedules and services

> In this project model: **clinic = vet**.
> The **VET** role is treated as the clinic identity and is scoped to the clinic’s resources.

### ADMIN

An administrative user who can:

* Manage most resources across the system
* Access protected admin routes (subject to route-level policies)

---

## Auth & Identity Model

To keep things clean (and safer), the project uses a **split identity architecture**:

### Access vs User

* **Access entity** (sensitive/authentication data)

  * Email
  * Hashed password
  * Role info
  * Active flags

* **User entity** (public profile data)

  * Full name
  * Address
  * Age
  * Phone
  * Identification number
  * Gender
  * Active flags

This separation helps ensure we never “accidentally” leak credential-related information when returning profile data.

### JWT Payload

When you log in, the API issues a JWT containing:

* `userId`
* `accessId`
* `roleId`
* `roleName`
* `email`

The JWT strategy validates the token and injects a typed principal into `req.user`, so controllers can safely identify the authenticated user.

---

## Core User Flows

### CLIENT (Pet Owner)

1. **Register**

   * Creates both `User` (profile) and `Access` (credentials + role) inside a transaction.
   * Default role: `CLIENT`.

2. **Login**

   * Validates credentials
   * Issues a JWT
   * Use it as: `Authorization: Bearer <token>`

3. **Profile**

   * `GET /users/me` returns the authenticated user's **profile** (User entity)

4. **Pets**

   * Pets are linked to the client via `pet_user`.
   * Ownership rules prevent other users from editing/deactivating pets they don’t own.

5. **Appointments**

   * Book appointments with clinics.
   * Ownership rules apply (clients only manage their own appointments).

---

### VET (Clinic)

1. **Login**

   * VET logs in and receives a JWT with role `VET`.

2. **Clinic Context**

   * The VET identity *is* the clinic.
   * Actions are limited to clinic-owned resources (appointments, schedules, services, etc.).

3. **Appointments & Services**

   * List/manage appointments for that clinic.
   * Access clinic schedules and offered services.

---

### ADMIN

1. **Login**

   * Admin logs in and receives role `ADMIN`.

2. **System-wide management**

   * Admin can access protected admin routes.
   * Endpoints may still define explicit restrictions.

---

## Appointments & Ownership

### Appointment Creation (CLIENT)

* CLIENT can only create appointments for pets they own. Ownership is enforced through `pet_user` associations.
* When creating an appointment, the **status** is automatically set to **"Pendiente"** (Pending).
* CLIENTs are restricted from setting appointment statuses or modifying appointments outside their own ownership.

### Appointment Management (VET)

* VETs can view and manage **appointments associated with their clinic**. This is scoped by `appointments.id_clinic`, which is tied to the `clinicId` in the JWT payload.
* VETs can **update appointment status** and create **diagnoses** for appointments related to their clinic.

### Ownership Enforcement

* **CLIENTs** can only manage their own pets and appointments.

  * Example: a CLIENT can **cancel** their own appointments but cannot modify someone else’s appointments.
* **VETs** are scoped to appointments related to their clinic (via `id_clinic`).
* **ADMINs** have unrestricted access to manage resources, with ownership checks bypassed for routes explicitly marked with `allowRoles: ['ADMIN']`.

---

## Run Locally with Docker

### 1) Create your environment file

```bash
cp .env.example .env
```

> Tip: keep `.env` private. Don’t commit secrets.

### 2) Start the stack

```bash
docker compose up -d
```

Rebuild from scratch:

```bash
docker compose up -d --build
```

### 3) Verify containers are running

```bash
docker ps
```

You should see:

* A **NestJS backend** container
* A **PostgreSQL** container

---

## Environment Variables

The app loads configuration from `.env`. Example:

```env
# Node.js App
APP_CONTAINER_NAME=app_project_x
APP_PORT=3001
NODE_ENV=development
APP_CPU_LIMIT=0.50
APP_MEM_LIMIT=1024M

# PostgreSQL
DB_CONTAINER_NAME=postgres_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Pr0j3ctXPass*
POSTGRES_DB=x_db
POSTGRES_PORT=5432
POSTGRES_LOCAL=5433
DB_CPU_LIMIT=0.5
DB_MEM_LIMIT=512M

# JWT access and refresh tokens
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=<YOUR_JWT_REFRESH_SECRET>
JWT_REFRESH_EXPIRES_IN=2d

# Frontend URL
FRONT_URL=http://localhost:3000
```

---

## Test Credentials

Use these accounts for local testing:

|   Role | Email                 | Password         |
| -----: | --------------------- | ---------------- |
| CLIENT | `client@client.com`   | `clientpassword` |
|  ADMIN | `admin@admin.com`     | `adminpassword`  |
|    VET | `vet1@vetconnect.com` | `Vet123*`        |

---

## API Examples

> Replace `localhost:3001` if your `APP_PORT` differs.

### Login

**Request**

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@client.com",
    "password": "clientpassword"
  }'
```

**Response (example)**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 10,
    "accessId": 22,
    "roleId": 1,
    "roleName": "CLIENT",
    "email": "client@client.com"
  }
}
```

---

### Get My Profile

```bash
curl http://localhost:3001/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

What it returns:

* The authenticated **User profile**
* Not the **Access** entity (credentials are never returned)

---

### Create a Pet (CLIENT)

**Example (multipart upload with image)**

```bash
curl -X POST http://localhost:3001/pets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "pet_name=Firulais" \
  -F "birth_date=2020-05-10T00:00:00.000Z" \
  -F "id_race=1" \
  -F "id_animal=1" \
  -F "image=@/path/to/dog.jpg"
```

**Notes**

* The pet is automatically linked to the logged-in CLIENT via `pet_user`.
* Ownership rules prevent other users from editing it.

---

### List My Pets (CLIENT)

```bash
curl http://localhost:3001/pets/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Active only:

```bash
curl http://localhost:3001/pets/me/active \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Create an Appointment (CLIENT)

```bash
curl -X POST http://localhost:3001/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id_pet": 1,
    "id_clinic": 1,
    "id_type": 1,
    "description": "Consulta general"
  }'
```

**Notes**

* CLIENTs can only create appointments for their own pets.
* The appointment status defaults to `"Pendiente"`.

---

### Cancel an Appointment (CLIENT)

```bash
curl -X PATCH http://localhost:3001/appointments/:id/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Security Notes

This project includes:

* JWT authentication with a strict payload contract
* Role-based authorization via `@Roles(...)` + `RolesGuard`
* Controller-scoped guards (secure modules incrementally)
* Ownership enforcement to reduce IDOR risk (users editing resources they don’t own)
* Global interceptors/filters for consistent output & error handling

---

## Troubleshooting

### I get 401 even after logging in

* Confirm the header format is exactly:

  * `Authorization: Bearer <token>`
* Ensure `JWT_SECRET` in `.env` matches what the running container uses.

### Database connection issues

* Verify Postgres is running:

  ```bash
  docker ps
  ```
* If ports are already taken, update `POSTGRES_LOCAL` and the compose port mapping.

### Clean rebuild

If you changed dependencies or want a fresh reset:

```bash
docker compose down -v
docker compose up -d --build
```
