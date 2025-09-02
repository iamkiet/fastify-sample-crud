# Migration Guide: From Raw SQL to TypeORM

This document outlines the changes made to convert the Fastify application from using raw SQL queries with the `pg` package to TypeORM with PostgreSQL.

## Major Changes

### 1. Dependencies Updated
- Removed: `pg`, `@types/pg`
- Added: `typeorm`, `reflect-metadata`, `class-transformer`

### 2. Database Configuration
- **Before**: `src/config/database.ts` - Used `pg.Pool`
- **After**: `src/config/data-source.ts` - Uses TypeORM `DataSource`

### 3. Models → Entities
- **Before**: `src/models/user.models.ts` - Raw SQL queries
- **After**: `src/entities/user.entity.ts` - TypeORM decorators

### 4. New Repository Pattern
- **Added**: `src/repositories/user.repository.ts` - TypeORM repository wrapper

### 5. Environment Variables
- **Before**: `DATABASE_URL=postgresql://user:pass@host:port/db`
- **After**: 
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=password
  DB_NAME=fastify_db
  ```

## New Features

### 1. Automatic Password Hashing
- Passwords are automatically hashed using `@BeforeInsert` and `@BeforeUpdate` decorators
- Password validation method built into the User entity

### 2. TypeORM Migrations
- **Before**: SQL files in `src/migrations/`
- **After**: TypeScript migration classes
- New scripts:
  - `npm run migration:generate` - Generate new migration
  - `npm run migration:run` - Run pending migrations
  - `npm run migration:revert` - Revert last migration
  - `npm run schema:sync` - Sync schema (development only)

### 3. Enhanced Query Builder
- Support for complex queries with TypeORM QueryBuilder
- Built-in pagination and search functionality
- Type-safe database operations

## Updated Scripts

```json
{
  "typeorm": "typeorm-ts-node-commonjs",
  "migration:generate": "npm run typeorm migration:generate -- -d src/config/data-source.ts",
  "migration:run": "npm run typeorm migration:run -- -d src/config/data-source.ts",
  "migration:revert": "npm run typeorm migration:revert -- -d src/config/data-source.ts",
  "schema:sync": "npm run typeorm schema:sync -- -d src/config/data-source.ts"
}
```

### Migration generate command pattern (TypeORM 0.3.x)

When generating a migration, pass the output path (not just `-n`). Example:

```
npm run migration:generate -- src/migrations/AddIdentityProviderToUser
```

Then run it:

```
npm run migration:run
```

## Database Connection

### Development
- `synchronize: true` - Automatically syncs schema changes
- `logging: true` - Shows SQL queries in console

### Production
- `synchronize: false` - Requires manual migrations
- `logging: false` - No SQL logging for performance

## Testing Updates

- Tests now use TypeORM connection
- Repository mocking for unit tests
- Proper cleanup of database connections

## Migration Steps

1. **Install new dependencies**:
   ```bash
   npm install typeorm reflect-metadata class-transformer
   npm uninstall pg @types/pg
   ```

2. **Update environment variables**:
   ```bash
   # Replace DATABASE_URL with:
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=password
   DB_NAME=fastify_db
   ```

3. **Run migrations**:
   ```bash
   npm run migration:run
   ```

4. **Seed database**:
   ```bash
   npm run seed
   ```

## Benefits of TypeORM

1. **Type Safety**: Full TypeScript support with entity decorators
2. **Automatic Migrations**: Generate and manage database schema changes
3. **Query Builder**: Type-safe complex queries
4. **Relationships**: Easy to define and manage entity relationships
5. **Validation**: Built-in validation decorators
6. **Performance**: Connection pooling and query optimization
7. **Developer Experience**: Better IntelliSense and error handling

## File Structure Changes

```
src/
├── config/
│   ├── database.ts          → data-source.ts
│   └── environment.ts       → Updated env vars
├── models/                  → entities/
│   └── user.models.ts      → user.entity.ts
├── repositories/            → NEW
│   └── user.repository.ts
├── migrations/
│   ├── 001.sql             → 1700000000000-CreateUsersTable.ts
│   └── 002.sql             → Removed
└── scripts/
    └── seed.ts             → Updated for TypeORM
```

## Notes

- The old `src/models/` directory can be removed
- SQL migration files are replaced with TypeScript classes
- Password hashing is now handled automatically by the entity
- All database operations go through the repository layer
- Tests have been updated to mock the repository instead of the database
