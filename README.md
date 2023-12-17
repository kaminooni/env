# @kaminooni/env

Simple, declarative, and type-safe access to process.env variables.

## Usage

```ts
import { env } from '@kaminooni/env'

enum Environment {
  Production = 'production',
  Development = 'development'
}

const config = {
  environment: env('NODE_ENV').enum(Environment),
  debug: env('DEBUG', false).boolean(),
  port: env('PORT', 3000).range(0, 65536),
  app: {
    name: env('APP_NAME', 'My App').string(),
    secret: env('APP_SECRET').string(),
    apiVersion: env('API_VERSION', 'v3').whitelist(['v1', 'v2', 'v3']),
    emails: env('EMAILS', ['myemail@example.com']).json<string[]>(),
    retries: env('RETRIES', 5).number(),
  },
}
```

## env(...) function

> env(key: string, defaultValue?: string) => VariableBuilder

This function takes Env variable name, reads this variable from `process.env` and returns the instance of `VariableBuilder`

## VariableBuilder

VariableBuilder helps you to validate, transform, and cast the env variables to a type of your choice.
All values are considered required, unless the default value is provided. If you try to access the non-existent variable, the builder will throw an error.

### string() / toString()

Converts env variable to `string`

```ts
env('APP_NAME').string()
```

### boolean()

Converts env variable to `boolean`
Returns `true` if env value equals `'true'` (case-insensitive). Returns `false` otherwise.

```ts
env('DEBUG').boolean()
```

### number()

Converts env variable to `number`.
> NOTE: Empty string `''` will be converted to `0`.

```ts
env('MAX_CONNECTIONS').number()
```

### whitelist(values: string[])

Verifies that value is in the white list. Throws an `Error` if it's not.

```ts
env('API_VERSION').whitelist(['v1', 'v2', 'v3'])
```

### range(from: number, to: number)

Verifies that value is a number in the specified range. Both limits are inclusive. 
Throws an `Error` if value is not in the specified range.

```ts
env('SERVER_PORT', 3000).range(0, 65536)
```

### enum()

Converts variable to the member of specified `enum`.
Throws an `Error` if the value is not a member of the provided Enum.

```ts
enum Environment {
  Production = 'production',
  Development = 'development'
}

const ENVIRONMENT: Environment = env('NODE_ENV').enum(Environment)
```

### json()
Converts env variable to JS object using JSON.parse() function

> NOTE: This functions doesn't check that JSON comply with the specified type.

```ts
const emails: string[] = env('EMAILS', ['myemail@example.com']).json<string[]>()
```