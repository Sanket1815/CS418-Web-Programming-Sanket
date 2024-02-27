# Project Title

This Course Advisory Portal offers guidance and information for students seeking advice on course selection and academic planning. Built with Node.js, NestJS, Apollo GraphQL, and MikroORM on the backend and React and Next.js on the frontend, this system provides a robust and user-friendly interface backed by a MySQL database.

# Get Started

## Prerequisites

- Node.js
- MySQL
- Any Editor (eg-Vs Code)

## Installation

Clone the repository and install the dependencies for frontend and backend.

```bash
  npm install
```

### Database Setup

```bash
const config: Options = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  user: '[YourUsername]',
  password: '[YourPassword]',
  dbName: 'nestjsreact',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  // other configurations...
};
```

## Usage

### For Backend

```bash
npm start
```

### For Frontend

```bash
npm run dev
```

## Built With

- **Backend**: Node.js, NestJS, Apollo GraphQL, MikroORM, TypeScript
- **Frontend**: React, Next.js, TypeScript
- **Database**: MySQL
