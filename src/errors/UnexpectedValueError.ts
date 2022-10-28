import { EnvVariableBuilderError } from './EnvVariableBuilderError'

export class UnexpectedValueError extends EnvVariableBuilderError {
  constructor(name: string, value?: string) {
    super(`Unexpected env variable value '${name}=${value}'`)
  }
}
