# Clean Architecture Implementation

This project has been restructured following Uncle Bob's Clean Architecture principles. The codebase is now organized into distinct layers with clear separation of concerns and dependency inversion.

## Architecture Overview

```
src/
├── core/                           # Core Business Logic (Domain + Application)
│   ├── domain/                     # Domain Layer (Entities, Value Objects, Repository Interfaces)
│   │   ├── entities/              # Business Entities
│   │   ├── value-objects/         # Value Objects
│   │   ├── repositories/          # Repository Interfaces
│   │   └── events/               # Domain Events
│   └── application/               # Application Layer (Use Cases, Services)
│       ├── use-cases/            # Application Use Cases
│       ├── services/             # Application Services
│       └── ports/                # Application Ports
├── interface-adapters/            # Interface Adapters Layer
│   ├── controllers/              # HTTP Controllers
│   ├── presenters/              # Data Presenters
│   └── gateways/                # External Service Gateways
├── infrastructure/               # Infrastructure Layer
│   ├── database/                # Database Implementations
│   │   ├── repositories/        # Repository Implementations
│   │   └── models/              # Database Models/Mappers
│   ├── storage/                 # File Storage
│   └── auth/                    # Authentication
├── frameworks-drivers/           # Frameworks & Drivers Layer
│   └── web/                     # Web Framework Specific Code
│       ├── api/                 # API Routes & Middleware
│       ├── components/          # UI Components
│       └── pages/               # Web Pages
└── shared/                      # Shared Utilities
    ├── types/                   # Shared Types
    ├── utils/                   # Utility Functions
    ├── constants/               # Constants
    ├── errors/                  # Error Classes
    └── di/                      # Dependency Injection
```

## Layer Dependencies

The dependency rule is strictly enforced:

1. **Domain Layer** (Innermost) - No dependencies on other layers
2. **Application Layer** - Depends only on Domain
3. **Interface Adapters** - Depends on Application & Domain
4. **Infrastructure** - Depends on Application & Domain
5. **Frameworks & Drivers** (Outermost) - Depends on all inner layers

## Key Components

### Domain Layer
- **Entities**: Core business objects with business rules (Doctor, Promo, etc.)
- **Value Objects**: Immutable objects representing domain concepts (Email, PhoneNumber, EntityId)
- **Repository Interfaces**: Abstract contracts for data access

### Application Layer
- **Use Cases**: Application-specific business rules and orchestration
- **Services**: Cross-cutting application services

### Interface Adapters
- **Controllers**: Handle HTTP requests/responses, delegate to use cases
- **Presenters**: Format data for external systems

### Infrastructure
- **Repository Implementations**: Concrete implementations using Supabase
- **Database Models**: Data mapping between domain entities and database

### Dependency Injection
- **Container**: Manages dependency injection and object creation
- Ensures proper dependency inversion

## Benefits

1. **Independence**: Business logic is independent of frameworks, databases, and external agencies
2. **Testability**: Easy to unit test business logic in isolation
3. **Flexibility**: Can easily swap implementations (database, UI framework, etc.)
4. **Maintainability**: Clear separation of concerns makes code easier to understand and modify
5. **Scalability**: Architecture supports growth and complexity

## Usage Example

```typescript
// API Route using Clean Architecture
import { Container } from '../../../shared/di/Container'
import { withAuth } from '../../../frameworks-drivers/web/api/middleware/AuthMiddleware'

const container = Container.getInstance()
const doctorController = container.getDoctorController()

export const GET = withAuth(async (request: NextRequest) => {
  return doctorController.getAll()
})
```

## Migration Status

✅ **Completed:**
- Clean Architecture folder structure
- Domain entities and value objects
- Repository interfaces
- Use cases (application layer)
- Repository implementations (infrastructure)
- Controllers (interface adapters)
- Dependency injection container
- Updated API routes for doctors

🔄 **In Progress:**
- Updating remaining API routes
- Frontend component integration

📋 **Pending:**
- Complete all entity implementations
- Frontend components refactoring
- Add comprehensive error handling
- Add logging and monitoring