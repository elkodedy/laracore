Continue from the previous step.

Install only the core packages required for a modern enterprise application.

Frontend:

* Zustand
* React Hook Form
* Zod
* TanStack Query
* TanStack Table
* Lucide React
* Motion
* Hey API OpenAPI TS

Backend:

* Spatie Laravel Permission
* Laravel Horizon
* Scramble (OpenAPI generator)

API Contract Requirements:

* Laravel must be the single source of truth for API contracts.
* Configure Scramble to generate an OpenAPI 3.x specification.
* Export the specification as openapi.json.
* Configure Hey API to consume openapi.json.
* Generate:
  * TypeScript types
  * API SDK
  * React Query hooks
  * Zod schemas (if supported)
* Ensure React never requires manually written API types or fetch functions.
* Prepare the project for future automatic code generation.

Requirements:

* Explain why each package is needed.
* Configure package providers.
* Create reusable initialization files.
* Configure OpenAPI generation workflow.
* Configure Hey API generation workflow.
* Create generation scripts in package.json.
* Do not create any application features yet.
* Follow enterprise-grade folder organization.
* Use TypeScript strict mode.
* Use TanStack Query as the default data-fetching layer.
* Use generated SDKs and hooks as the only API access layer.

Expected output:

* Commands executed.
* Package versions.
* Configuration files.
* Folder structure updates.
* OpenAPI generation setup.
* Hey API configuration.
* package.json script updates.

Wait for approval before continuing.