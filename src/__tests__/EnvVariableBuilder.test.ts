import { EnvVariableBuilder } from '../EnvVariableBuilder'
import { MissingRequiredVariableError, UnexpectedValueError } from '../errors'

describe('EnvVariableBuilder', () => {
  enum TestStringEnum {
    ENUM_VALUE = 'e_value',
  }

  enum TestNumericEnum {
    ENUM_VALUE_1,
    ENUM_VALUE_2,
    ENUM_VALUE_5 = 5,
  }

  it('should read value from environment', () => {
    const builder = new EnvVariableBuilder('TEST_KEY', 'TEST_VALUE')

    expect(builder.string()).toEqual('TEST_VALUE')
  })

  it.each([
    ['S1', 'Some String Value', 'Some String Value'],
    ['S2', '123', '123'],
    ['S3', '', ''],
    ['S4', undefined, ''],
  ])(
    '%s should correctly read string value `%s` == `%s`',
    (key: string, value: string | undefined, result: string) => {
      const builder = new EnvVariableBuilder(key, value)

      expect(builder.string()).toEqual(result)
      expect(builder.toString()).toEqual(result)
    }
  )

  it.each([
    ['B1', 'true', true],
    ['B2', 'false', false],
    ['B3', 'some random string', false],
    ['B4', '123', false],
    ['B5', '1', false],
    ['B6', '0', false],
    ['B7', '', false],
  ])(
    '%s should correctly read boolean value `%s` == `%s`',
    (key: string, value: string, result: boolean) => {
      const builder = new EnvVariableBuilder(key, value)

      expect(builder.boolean()).toEqual(result)
    }
  )

  it.each([
    ['N1', '123', 123],
    ['N2', '-123', -123],
    ['N3', '0.23', 0.23],
    ['N4', '2.99', 2.99],
    ['N5', '.65', 0.65],
    ['N6', '', 0],
    ['N7', 'some random string', NaN],
    ['N8', '1a2', NaN],
    ['N9', 'a1', NaN],
    ['N10', '1a', NaN],
  ])(
    '%s should correctly read number value `%s` == `%s`',
    (key: string, value: string, result: number) => {
      const builder = new EnvVariableBuilder(key, value)

      expect(builder.number()).toEqual(result)
    }
  )

  it('should correctly read string Enum value', () => {
    const key = Object.keys(TestStringEnum)[0]
    const value = Object.values(TestStringEnum)[0]
    const builder = new EnvVariableBuilder(key, value)

    expect(builder.enum(TestStringEnum)).toEqual(value)
  })

  it("should throw UnexpectedValueError if string Enum value doesn't exist", () => {
    const builder = new EnvVariableBuilder('TestStringEnum', 'invalid')

    expect(() => builder.enum(TestStringEnum)).toThrow(UnexpectedValueError)
  })

  it('should correctly read number Enum value', () => {
    const value = '5'
    const builder = new EnvVariableBuilder('TestNumericEnum1', value)

    expect(builder.enum(TestNumericEnum)).toEqual(value)
  })

  it("should throw UnexpectedValueError if numeric Enum value doesn't exist", () => {
    const builder = new EnvVariableBuilder('TestNumericEnum2', '4')

    expect(() => builder.enum(TestNumericEnum)).toThrow(UnexpectedValueError)
  })

  it('should not throw MissingRequiredVariableError if required value exist', () => {
    const builder = new EnvVariableBuilder('required', 'variable')

    expect(() => builder.required()).not.toThrow(MissingRequiredVariableError)
  })

  it("should throw if required value doesn't exist", () => {
    const builder = new EnvVariableBuilder('required', undefined)

    expect(() => builder.required()).toThrow(MissingRequiredVariableError)
  })

  it.each([
    [true, 'true'],
    [false, 'false'],
    ['true', 'true'],
    ['false', 'false'],
    [0, '0'],
    [123, '123'],
    [-123, '-123'],
    [1.23, '1.23'],
    [0.23, '0.23'],
    ['some string', 'some string'],
    ['', ''],
  ])(
    "should set the default value [%s] if env value doesn't exist",
    (def, expected) => {
      const builder = new EnvVariableBuilder('default')

      expect(builder.default(def).string()).toEqual(expected)
    }
  )

  it.each([
    [true],
    [false],
    ['true'],
    ['false'],
    [0],
    [123],
    [-123],
    [1.23],
    [0.23],
    ['some string'],
    [''],
  ])('should not set the default value [%s] if env value exist', (def) => {
    const builder = new EnvVariableBuilder('default_1', 'variable')

    expect(builder.default(def).string()).toEqual('variable')
  })

  it.each([
    ['', ''],
    ['    ', ''],
    ['  ', ''],
    ['    ', ''],
    [' test ', 'test'],
    ['  123', '123'],
    ['true  ', 'true'],
  ])('should trim the value [%s] -> [%s]', (value, expected) => {
    const builder = new EnvVariableBuilder('trim', value)

    expect(builder.trim().string()).toEqual(expected)
  })

  it.each([
    ['0', -10, 10, 0],
    ['-10', -10, 10, -10],
    ['10', -10, 10, 10],
    ['1.99', 1, 2, 1.99],
    ['-1.99', -2, -1, -1.99],
    ['0', 0, 0, 0],
    ['9999', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 9999],
  ])(
    'should validate range of the value %s > %s && < %s -> %s',
    (value, from, to, expected) => {
      const builder = new EnvVariableBuilder('range', value)

      expect(builder.range(from, to)).toEqual(expected)
    }
  )

  it('should not validate range if value is undefined', () => {
    const builder = new EnvVariableBuilder('range', undefined)

    expect(builder.range(1, -1)).toEqual(NaN)
  })

  it.each([
    ['100', -10, 10],
    ['-1', 0, 10],
    ['0', 10, -10],
  ])(
    'should validate range of the value %s > %s && < %s and throw an UnexpectedValueError',
    (value, from, to) => {
      const builder = new EnvVariableBuilder('range', value)

      expect(() => builder.range(from, to)).toThrow(UnexpectedValueError)
    }
  )
})
