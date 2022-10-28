# @kaminooni/env

Easy yet type-safe access to process.env variables.

## Usage

```ts
import { env } from '@kaminooni/env'

enum Environment {
  Production = 'production',
  Development = 'development'
}

const ENVIRONMENT: Environment = env('NODE_ENV')
  .required()
  .enum(Environment)

const DEBUG = env('DEBUG')
  .default(false)
  .boolean()

const APP_NAME = env('APP_NAME')
  .default('My App')
  .trim()
  .string()

const APP_SECRET = env('APP_SECRET')
  .required()
  .string()

const SERVER_PORT = env('SERVER_PORT')
  .default(3000)
  .range(0, 65536)

const API_VERSION = env('API_VERSION')
  .permit(['v1', 'v2', 'v3'])
  .default('v3')
  .string()
```

## First Step / env(...) function

> env(key: string) => EnvVariableBuilder

The firs

This function takes Env variable name, reads this variable from `process.env` and returns the instance
of `EnvVariableBuilder`

## Builder

Builder helps you to validate, transform, set default, and cast the env variables to a type of your choice.

### permit(values: string[])

Verifies that value is one of the list.

- This function does nothing if env value is `undefined`

```ts
const API_VERSION = env('API_VERSION')
  .permit(['v1', 'v2', 'v3'])
  .string()
```

### range(from: number, to: number)

Verifies that value is a number in the specified range.

- Returns number
- Both limits are inclusive

```ts
const SERVER_PORT = env('SERVER_PORT')
  .default(3000)
  .range(0, 65536)
```

### required()

Verifies that value is not undefined.
Throws `MissingRequiredVariableError` if env value is `undefined`

```ts
const APP_SECRET = env('APP_SECRET')
  .required()
  .string()
```

### default(value: string | number | boolean)

Sets the default value if env value is `undefined`

```ts
const DEBUG = env('DEBUG')
  .default(false)
  .boolean()
```

### trim()

Trims the env value

- This function does nothing if env value is `undefined`

```ts
const APP_NAME = env('APP_NAME')
  .trim()
  .string()
```

### string() / toString()

Converts env variable to `string`

- `undefined` value will be converted to empty string `''`

```ts
const APP_NAME = env('APP_NAME')
  .string()
```

### boolean()

Converts env variable to `boolean`

- Case-insensitive
- By default, returns `true` if env value equals `'true'`. Returns `false` otherwise.

```ts
const DEBUG = env('DEBUG').boolean()
```

#### How to change the default list of allowed true values

List of allowed "true" values could be changed by updating the `EnvVariableBuilder.allowedTrueValues` variable

```ts
import { EnvVariableBuilder } from '@kaminooni/env'

EnvVariableBuilder.allowedTrueValues = ['1']

process.env['DEBUG'] = 1

const DEBUG = env('DEBUG').boolean() // Returns true
```

### number()

Converts env variable to `number`

- `undefined` value will be converted to `NaN`
- Empty string `''` will be converted to `0`

```ts
const MAX_CONNECTIONS = env('MAX_CONNECTIONS').number()
```

### enum()

Converts variable to `enum`

- Throws `UnexpectedValueError` if the value exists, and it is not member of provided Enum

```ts
enum Environment {
  Production = 'production',
  Development = 'development'
}

const ENVIRONMENT: Environment = env('NODE_ENV')
  .required()
  .enum(Environment)
```