export class VariableBuilder {
  constructor(
    private readonly name: string,
    private readonly value?: string
  ) {
  }

  /**
   * Verifies that value is one of the list.
   *
   * @param values
   * @throws {Error} if the value is not included in the provided list
   */
  whitelist(values: string[]): string {
    const value = this.string()

    if (!values.includes(value)) {
      throw new Error(
        `Unexpected value of the env variable: "${this.name}". Value is not in the white list.`
      );
    }

    return value;
  }

  /**
   * Converts env variable to `string`
   *
   * @throws {Error} if value is undefined
   */
  string(): string {
    if (this.value === undefined) {
      throw new Error(`Missing required env variable: "${this.name}"`);
    }

    return this.value;
  }

  /**
   * Converts env variable to `boolean`
   *
   * @throws {Error} if value is undefined
   * @return {boolean} Returns `true` if env value equals `'true'` (case-insensitive). Returns `false` otherwise.
   */
  boolean(): boolean {
    return this.string().toLowerCase().trim() === "true";
  }

  /**
   * Converts env variable to `number`
   *
   * @throws {Error} if value is undefined
   */
  number(): number {
    return Number(this.string());
  }

  /**
   * Converts env variable to JS object using JSON.parse function
   *
   * @throws {Error} if value is undefined
   */
  json<T>(): T {
    return JSON.parse(this.string())
  }

  /**
   * Converts variable to enum
   *
   * @param enumerable
   * @throws {Error} if the value is undefined or not a member of the provided Enum
   */
  enum<T extends Record<string | number, string | number>>(
    enumerable: T
  ): T[keyof T] {
    const allowedValues = Object.values(enumerable).map((value) =>
      value.toString()
    );

    return this.whitelist(allowedValues) as T[keyof T];
  }

  /**
   * Verifies that value is a number in the specified range
   * - Both limits are inclusive
   *
   * @param from Lower limit (inclusive)
   * @param to Upper limit (inclusive)
   * @throws {Error} if the value is undefined or outside the specified range
   */
  range(from: number, to: number): number {
    const value = this.number();

    if (value > to || value < from) {
      throw new Error(
        `Unexpected value of the env variable "${this.name}". Value is not in range: [${from},${to}]`
      );
    }

    return value;
  }

  toString(): string {
    return this.string();
  }
}
