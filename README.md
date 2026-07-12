# Hospital Management System

A full-stack Hospital Management System for managing core hospital workflows such as patients, doctors, appointments, billing, pharmacy records, users, and dashboard reporting. The project uses an Angular frontend with Firebase Authentication and a .NET Web API backend backed by Entity Framework Core and MySQL.

## Features

- Firebase Authentication for login and sign-up
- Role-aware dashboard and management screens
- Patient management
- Doctor management
- Appointment scheduling and status tracking
- Billing records
- Pharmacy and medicine inventory records
- User management
- Dashboard statistics and recent appointment overview
- REST API built with ASP.NET Core Web API
- MySQL persistence through Entity Framework Core

## Technologies Used

- Angular
- .NET Web API
- Entity Framework Core
- MySQL
- Firebase Authentication
- Tailwind CSS

## Project Structure

```text
.
├── api/
│   ├── Controllers/          # ASP.NET Core API controllers
│   ├── Data/                 # Entity Framework DbContext
│   ├── Migrations/           # Entity Framework migrations
│   ├── Models/               # API domain models
│   ├── Program.cs            # API startup and service configuration
│   └── appsettings.json      # Public-safe application settings
├── client/
│   ├── public/               # Static frontend assets
│   ├── src/
│   │   ├── app/              # Angular app configuration and routes
│   │   └── components/       # Angular feature components
│   ├── angular.json
│   └── package.json
└── README.md
```

## Screenshots

Add screenshots before publishing:

- Dashboard screenshot
- Patients page screenshot
- Doctors page screenshot
- Appointments page screenshot
- Billing page screenshot
- Pharmacy page screenshot

## Installation

### Prerequisites

- Node.js LTS
- Angular CLI
- .NET SDK
- MySQL Server
- Firebase project with Authentication enabled

### Clone the Repository

```bash
git clone <repository-url>
cd hospital-management-system
```

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE HospitalDB;
```

2. Create `api/appsettings.Development.json` locally. This file is ignored by Git:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=HospitalDB;user=<mysql-user>;password=<mysql-password>;"
  }
}
```

3. Apply Entity Framework migrations:

```bash
cd api
dotnet ef database update
```

## API Setup

```bash
cd api
dotnet restore
dotnet run
```

By default, the API is configured for local development at:

```text
http://localhost:5132
```

Swagger is available in development mode.

## Frontend Setup

```bash
cd client
npm install
npm start
```

Open the Angular app at:

```text
http://localhost:4200
```

## Firebase Setup

The frontend uses Firebase Authentication. Update `client/src/app/firebase.ts` with your Firebase Web SDK configuration if you are using a different Firebase project.

Only Firebase Web SDK configuration should be stored in the frontend. Do not commit Firebase Admin SDK service account JSON files.

## Default Demo Accounts

No default demo accounts are committed in this repository.

Create users through the sign-up flow or seed test users locally in your own development database and Firebase project.

## Future Enhancements

- Environment-based API URL configuration for Angular
- Strongly typed Angular services and models
- Server-side validation improvements
- Role and permission management in the backend
- Audit logging for critical hospital records
- Automated unit and integration tests
- Deployment configuration for cloud hosting

## License

This project is available under the MIT License. Add a `LICENSE` file before publishing if you want to formally distribute it under MIT terms.
