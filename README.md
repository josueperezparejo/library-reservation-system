# Library Reservation System

A full-stack application for managing library book reservations, built with NestJS, GraphQL, Prisma, Next.js, and PostgreSQL.

## Architecture

```
root/
├── apps/
│   ├── backend/          # NestJS + GraphQL + Prisma
│   └── frontend/         # Next.js 15 + Tailwind + Apollo Client
├── docker-compose.yml    # PostgreSQL + backend + frontend
├── .env.example
└── README.md
```

### Backend Architecture

Clean modular architecture following SOLID principles:

```
src/
├── modules/
│   ├── users/            # User creation and lookup
│   │   ├── users.resolver.ts     # GraphQL entry points
│   │   ├── users.service.ts      # Business logic
│   │   └── users.repository.ts  # Prisma data access
│   ├── books/            # Full CRUD for books
│   └── reservations/     # Reservation management + business rules
├── common/
│   ├── exceptions/       # Typed GraphQL business exceptions
│   └── pagination/       # Generic paginated response
└── prisma/               # Global PrismaService
```

**Key decisions:**

- **Code-first GraphQL** — TypeScript decorators drive the schema, ensuring single source of truth
- **Repository pattern** — decouples Prisma from business logic, making services testable in isolation
- **Typed exceptions** — each business rule violation throws a named `GraphQLError` subclass, giving clients machine-readable `extensions.code` values
- **CUID IDs** — shorter and sortable compared to UUID, better for time-ordered queries
- **Global PrismaModule** — single connection pool shared across all modules

### Frontend Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home — available books + quick reserve
│   ├── books/            # Full CRUD management
│   ├── users/            # Create user + list
│   ├── reservations/     # Query with date filters
│   └── returns/          # Return books flow
├── components/
│   ├── ui/               # Design system primitives (Button, Input, Modal...)
│   ├── books/            # BookCard, BookForm
│   ├── reservations/     # ReserveModal, ReservationCard
│   └── layout/           # Navbar
├── lib/
│   ├── apollo-client.ts  # Apollo setup
│   └── graphql/          # All queries and mutations as typed gql tags
├── store/                # Zustand stores
│   ├── books.store.ts
│   └── reservations.store.ts
└── types/                # Shared TypeScript types
```

**Key decisions:**

- **Apollo Client** — mature, handles caching and optimistic updates; `watchQuery` with `cache-and-network` keeps data fresh without extra round-trips
- **Zustand** — minimal boilerplate for cross-component state (selected book for reservation modal, return flow state)
- **`use client` only where needed** — pages that require interactivity are client components; layout and static wrappers stay server-side
- **react-hook-form** — uncontrolled forms with minimal re-renders and built-in validation

## Business Rules

| Rule                                             | Where enforced                                        |
| ------------------------------------------------ | ----------------------------------------------------- |
| A book can only have one active reservation      | `ReservationsService.create`                          |
| A user can have maximum 3 active reservations    | `ReservationsService.create`                          |
| Due date must be after reservation date          | `ReservationsService.create`                          |
| A returned book cannot be returned again         | `ReservationsService.returnBook`                      |
| Book/user must exist before creating reservation | via `UsersService.findById` + `BooksService.findById` |
| ISBN must be unique across books                 | `BooksService.create` / `BooksService.update`         |
| Email must be unique across users                | `UsersService.create`                                 |

## Data Model

```prisma
model User {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  reservations Reservation[]
}

model Book {
  id           String        @id @default(cuid())
  title        String
  author       String
  isbn         String        @unique
  description  String?
  coverUrl     String?
  reservations Reservation[]
}

model Reservation {
  id              String            @id @default(cuid())
  userId          String
  bookId          String
  reservationDate DateTime
  dueDate         DateTime
  returnDate      DateTime?
  status          ReservationStatus @default(ACTIVE)  // ACTIVE | RETURNED
}
```

## Running the Project

### Option 1 — Docker (recommended)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services (PostgreSQL + backend + frontend)
docker compose up --build

# Services:
#   Frontend  → http://localhost:3000
#   GraphQL   → http://localhost:4000/graphql
#   Postgres  → localhost:5432
#
# Note: Docker may display the container ID as hostname (e.g. http://8e88476d5379:3000).
# Always use localhost in your browser, not the container ID.
```

The backend automatically runs `prisma migrate deploy` and `prisma db seed` on startup.

### Option 2 — Local development

#### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or use Docker for just the DB)

```bash
# Start just PostgreSQL via Docker
docker compose up postgres -d
```

#### Backend

```bash
cd apps/backend
cp .env.example .env   # Edit DATABASE_URL if needed
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# GraphQL Playground → http://localhost:4000/graphql
```

#### Frontend

```bash
cd apps/frontend
cp .env.example .env   # Edit NEXT_PUBLIC_GRAPHQL_URL if needed
npm install
npm run dev
# → http://localhost:3000
```

## GraphQL API Examples

### Create a user

```graphql
mutation {
  createUser(input: { name: "Alice Johnson", email: "alice@library.com" }) {
    id
    name
    email
  }
}
```

### Get available books

```graphql
query {
  availableBooks {
    id
    title
    author
    isAvailable
  }
}
```

### Create a reservation

```graphql
mutation {
  createReservation(
    input: {
      userId: "USER_ID"
      bookId: "BOOK_ID"
      reservationDate: "2026-04-23"
      dueDate: "2026-05-07"
    }
  ) {
    id
    status
    user {
      name
    }
    book {
      title
    }
    dueDate
  }
}
```

### Query reservations by user with date filter

```graphql
query {
  reservationsByUser(
    userId: "USER_ID"
    fromDate: "2026-01-01"
    toDate: "2026-12-31"
    page: 1
    limit: 20
  ) {
    items {
      id
      status
      reservationDate
      dueDate
      book {
        title
        author
      }
    }
    total
    totalPages
    hasNextPage
  }
}
```

### Query reservations by book

```graphql
query {
  reservationsByBook(bookId: "BOOK_ID", fromDate: "2026-01-01") {
    items {
      id
      status
      user {
        name
        email
      }
      reservationDate
      dueDate
      returnDate
    }
    total
  }
}
```

### Return a book

```graphql
mutation {
  returnBook(reservationId: "RESERVATION_ID") {
    id
    status
    returnDate
    book {
      title
    }
  }
}
```

### CRUD — Create a book

```graphql
mutation {
  createBook(
    input: {
      title: "Clean Code"
      author: "Robert C. Martin"
      isbn: "9780132350884"
      description: "A handbook of agile software craftsmanship"
    }
  ) {
    id
    title
    isAvailable
  }
}
```

### CRUD — Update a book

```graphql
mutation {
  updateBook(input: { id: "BOOK_ID", title: "Clean Code: A Handbook" }) {
    id
    title
    updatedAt
  }
}
```

### CRUD — Delete a book

```graphql
mutation {
  deleteBook(id: "BOOK_ID") {
    id
    title
  }
}
```

## Business Error Codes

All business rule violations return a GraphQL error with an `extensions.code`:

| Code                           | Description                              |
| ------------------------------ | ---------------------------------------- |
| `BOOK_ALREADY_RESERVED`        | Book already has an active reservation   |
| `USER_RESERVATION_LIMIT`       | User has reached 3 active reservations   |
| `INVALID_DATE_RANGE`           | Due date is not after reservation date   |
| `RESERVATION_ALREADY_RETURNED` | Reservation is already in RETURNED state |
| `BOOK_NOT_FOUND`               | No book with the given ID                |
| `USER_NOT_FOUND`               | No user with the given ID                |
| `RESERVATION_NOT_FOUND`        | No reservation with the given ID         |
| `DUPLICATE_EMAIL`              | User email already registered            |
| `DUPLICATE_ISBN`               | Book ISBN already exists                 |

## Environment Variables

| Variable                  | Default                         | Description                   |
| ------------------------- | ------------------------------- | ----------------------------- |
| `DATABASE_URL`            | —                               | PostgreSQL connection string  |
| `PORT`                    | `4000`                          | Backend server port           |
| `NODE_ENV`                | `development`                   | Environment mode              |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint for frontend |
