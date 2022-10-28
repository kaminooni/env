import { EnvVariableBuilder } from './EnvVariableBuilder'

/**
 * @param key Env variable name
 */
export const env = (key: string) =>
  new EnvVariableBuilder(key, process.env[key])
