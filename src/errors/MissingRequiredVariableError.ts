import { EnvVariableBuilderError } from './EnvVariableBuilderError'

export class MissingRequiredVariableError extends EnvVariableBuilderError {
  constructor(name: string) {
    super(`Required env variable '${name}' not found`)
  }
}
