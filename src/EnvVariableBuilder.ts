import { MissingRequiredVariableError, UnexpectedValueError } from './errors'

export class EnvVariableBuilder {
  public static allowedTrueValues = ['true']

  private value?: string
  private readonly key: string

  constructor(key: string, value?: string) {
    this.key = key
    this.value = value
  }

  /**
   * Verifies that value is not undefined
   *
   * @throws {MissingRequiredVariableError} if value is undefined
   */
  required(): EnvVariableBuilder {
    if (this.value === undefined) {
      throw new MissingRequiredVariableError(this.key)
    }

    return this
  }

  /**
   * Verifies that value is one of the list.
   * - Ignores undefiled values
   *
   * @param values
   * @throws {UnexpectedValueError} if the value exists, and it is not included in the provided list
   */
  permit(values: string[]): EnvVariableBuilder {
    if (this.value !== undefined && !values.includes(this.value)) {
      throw new UnexpectedValueError(this.key, this.value)
    }

    return this
  }

  /**
   * Sets the default value if the value is `undefined`
   *
   * @param value
   */
  default(value: string | number | boolean): EnvVariableBuilder {
    this.value ??= value.toString()

    return this
  }

  /**
   * Trims the value
   * - Ignores undefiled values
   */
  trim(): EnvVariableBuilder {
    if (this.value !== undefined) {
      this.value = this.value.trim()
    }

    return this
  }

  /**
   * Converts env variable to `string`
   * - `undefined` value will be converted to empty string `''`
   */
  string(): string {
    return this.value ?? ''
  }

  /**
   * Converts env variable to `boolean`
   */
  boolean(): boolean {
    return EnvVariableBuilder.allowedTrueValues.includes(
      this.string().toLowerCase()
    )
  }

  /**
   * Converts env variable to `number`
   */
  number(): number {
    return Number(this.value)
  }

  /**
   * Converts variable to enum
   *
   * @param enumerable
   * @throws {UnexpectedValueError} if the value exists, and it is not member of provided Enum
   */
  enum<T extends Record<string | number, string | number>>(
    enumerable: T
  ): T[keyof T] {
    const allowedValues = Object.values(enumerable).map((value) =>
      value.toString()
    )

    return this.permit(allowedValues).string() as T[keyof T]
  }

  /**
   * Verifies that value is a number in the specified range
   * - Both limits are inclusive
   *
   * @param from Lower limit (inclusive)
   * @param to Upper limit (inclusive)
   * @throws {UnexpectedValueError} if the value exists and is outside the specified range
   */
  range(from: number, to: number): number {
    const value = this.number()

    if (value > to || value < from) {
      throw new UnexpectedValueError(this.key, this.value)
    }

    return value
  }

  toString(): string {
    return this.string()
  }
}
