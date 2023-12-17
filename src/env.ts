import { VariableBuilder } from "./VariableBuilder";

const simpleTypes = ["string", "number", "boolean", "undefined"];

/**
 * @param key Env variable name
 * @param defaultValue Default env variable
 */
export const env = <T>(key: string, defaultValue?: T) => {
  let fallback = simpleTypes.includes(typeof defaultValue)
    ? defaultValue?.toString()
    : JSON.stringify(defaultValue)

  return new VariableBuilder(key, process.env[key] ?? fallback);
};
