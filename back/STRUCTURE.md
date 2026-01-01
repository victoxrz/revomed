# Clean Architecture Structure

This project follows Clean Architecture principles to ensure separation of concerns, testability, and independence from external frameworks. The code is organized into concentric layers where dependencies only point inwards.

## Layers

### 1. Domain (`src/Domain`)
**Role**: Enterprise Business Rules
The core of the application. It encapsulates the most general and high-level business rules. This layer is pure C# and has zero dependencies on other projects or frameworks.

**Typical Contents**:
- **Entities**: Business objects with state and behavior (e.g., `Customer`, `Order`).
- **Value Objects**: Immutable objects defined by their properties (e.g., `Address`, `Money`).
- **Enums**: Domain-specific constants.
- **Domain Events**: Events that signify something important happened in the domain.

### 2. AppCore (`src/AppCore`)
**Role**: Application Business Rules
Defines the "what" of the application (Use Cases). It orchestrates data flow to and from the Domain entities. It defines the *interfaces* (contracts) that external layers must implement.

**Typical Contents**:
- **Interfaces**: Abstractions for infrastructure concerns (e.g., `IRepository`, `IEmailSender`).
- **Services/Use Cases**: Logic specific to application workflows (e.g., `RegisterUserService`).
- **DTOs**: Data Transfer Objects for input/output.
- **Exceptions**: Application-specific error types.

### 3. Infrastructure (`src/Infrastructure`)
**Role**: Interface Adapters & Frameworks
Implements the interfaces defined in AppCore. This layer connects the application to the outside world (databases, file systems, third-party APIs).

**Typical Contents**:
- **Data Access**: Database contexts (EF Core), migrations, and repository implementations.
- **External Integrations**: API clients, payment gateways, email providers.
- **System Services**: File system access, system clock, caching implementations.

### 4. PublicApi (`src/PublicApi`)
**Role**: Presentation / Entry Point
The interface through which users or external systems interact with the application. It handles requests, invokes AppCore services, and formats responses.

**Typical Contents**:
- **Endpoints/Controllers**: HTTP request handlers.
- **Middleware**: Cross-cutting concerns like logging, error handling, and authentication.
- **Configuration**: Dependency Injection (IoC) setup and application startup logic.

## Dependency Flow
Dependencies always point inwards toward the Domain.
1. **PublicApi** -> **AppCore** -> **Domain**
2. **Infrastructure** -> **AppCore** -> **Domain**

*Note: Infrastructure and PublicApi are at the same architectural level (outer rings), but typically the entry point (PublicApi) references Infrastructure for Dependency Injection composition.*
