# DoDealers

A full-stack SaaS application concept for used-car dealerships to manage vehicles, purchases, expenses, documents, and profitability.

## Overview

DoDealers is designed around the workflow of a used-car dealership, from acquiring a vehicle to tracking its expenses and managing its current status.

The project focuses on keeping vehicle-level financial and operational data organized in one system.

## Features

* Dealer/organization management
* User authentication
* Vehicle management
* Vehicle purchase tracking
* Vehicle expense tracking
* Vehicle documents
* Vehicle photos
* Vehicle status history
* Dashboard and dealership statistics
* Vehicle profitability tracking
* Settings and organization management
* REST API
* Database migrations with Alembic

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* TanStack React Query
* Zustand
* Axios
* React Hook Form
* Zod
* Recharts
* Radix UI

### Backend

* Python
* FastAPI
* SQLModel
* SQLAlchemy
* PostgreSQL
* Alembic
* JWT authentication

### Development

* Git
* GitHub
* REST APIs
* Environment-based configuration

## Architecture

```text
used-car/
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── router/
│   │   │   ├── schema/
│   │   │   └── service/
│   │   └── requirements.txt
│   │
│   └── web/
│       ├── src/
│       ├── package.json
│       └── next.config.mjs
│
├── .env.example
└── package.json
```

## Core Data Model

The backend is structured around dealership and vehicle-related entities including:

* Organizations
* Users
* Branches
* Vehicles
* Vehicle purchases
* Vehicle expenses
* Vehicle documents
* Vehicle photos
* Vehicle status history

This structure allows a vehicle to be treated as a continuous record throughout its dealership lifecycle.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ehsaneyyy/used-car.git
cd used-car
```

### 2. Backend setup

```bash
cd apps/api
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment variables using the provided `.env.example`.

Run the API:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend setup

From the repository root:

```bash
npm install
npm run dev:web
```

The frontend runs on the Next.js development server.

## Available Scripts

From the repository root:

```bash
npm run dev:web
npm run build:web
```

Frontend scripts:

```bash
cd apps/web
npm run dev
npm run build
npm run start
npm run lint
```

## Project Status

This is an actively developed SaaS project concept focused on the operational and financial management of used-car dealerships.

The architecture is designed to support additional dealership workflows and reporting features as development continues.

## Author

**Mohammed Ehsan**

* GitHub: [ehsaneyyy](https://github.com/ehsaneyyy)
* LinkedIn: [Mohammed Ehsan](https://linkedin.com/in/mohammed-ehsan-85259a371)
