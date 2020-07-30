![Node.js CI](https://github.com/amplication/prisma-schema-dsl/workflows/Node.js%20CI/badge.svg)

# Prisma Schema DSL

JavaScript interface for [Prisma Schema DSL](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema)

## Installation

```
npm install prisma-schema-dsl
```

## API

### Print

#### `print(schema: Schema): Promise<string>`

Prints Prisma schema file from AST.
The schema is formatted using prisma-format.

### Builders

#### `createSchema(models: Model[], dataSource?: DataSource): Schema`

Creates a schema AST from given model and data source objects.

## Development

- Clone the repository `git clone git@github.com:amplication/prisma-schema-dsl.git`
- Install the dependencies `npm install`
- Run tests `npm test`

---

Created with <3 by amplication
