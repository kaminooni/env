import { VariableBuilder } from '../VariableBuilder'

describe('VariableBuilder', () => {
  enum TestStringEnum {
    ENUM_VALUE = 'e_value',
  }

  enum TestNumericEnum {
    ENUM_VALUE_1,
    ENUM_VALUE_2,
    ENUM_VALUE_5 = 5,
  }

  it('should read value from environment', () => {
    const builder = new VariableBuilder('TEST_KEY', 'TEST_VALUE')

    expect(builder.string()).toEqual('TEST_VALUE')
  })

  it.each([
    ['S1', 'Some String Value', 'Some String Value'],
    ['S2', '123', '123'],
    ['S3', '', ''],
  ])(
    '%s should correctly read string value `%s` == `%s`',
    (key: string, value: string | undefined, result: string) => {
      const builder = new VariableBuilder(key, value)

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
      const builder = new VariableBuilder(key, value)

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
      const builder = new VariableBuilder(key, value)

      expect(builder.number()).toEqual(result)
    }
  )

  it('should correctly read string Enum value', () => {
    const key = Object.keys(TestStringEnum)[0]
    const value = Object.values(TestStringEnum)[0]
    const builder = new VariableBuilder(key, value)

    expect(builder.enum(TestStringEnum)).toEqual(value)
  })

  it("should throw Error if string Enum value doesn't exist", () => {
    const builder = new VariableBuilder('TestStringEnum', 'invalid')

    expect(() => builder.enum(TestStringEnum)).toThrow(Error)
  })

  it('should correctly read number Enum value', () => {
    const value = '5'
    const builder = new VariableBuilder('TestNumericEnum1', value)

    expect(builder.enum(TestNumericEnum)).toEqual(value)
  })

  it("should throw Error if numeric Enum value doesn't exist", () => {
    const builder = new VariableBuilder('TestNumericEnum2', '4')

    expect(() => builder.enum(TestNumericEnum)).toThrow(Error)
  })

  it('should not throw Error if required value exist', () => {
    const builder = new VariableBuilder('required', 'value')

    expect(() => builder.string()).not.toThrow(Error)
  })

  it("should throw if required value doesn't exist", () => {
    const builder = new VariableBuilder('required', undefined)

    expect(() => builder.string()).toThrow(Error)
  })

  it.each([
    [['a', 'b', 'c']],
    [{ a: 1, b: 2, c: 3}],
    ['"string"']
  ])(
    'should decode JSON: %s',
    (value) => {
      const builder = new VariableBuilder('range', JSON.stringify(value))

      expect(builder.json()).toEqual(value)
    }
  )

  it.each([
    ['0', -10, 10],
    ['-10', -10, 10],
    ['10', -10, 10],
    ['1.99', 1, 2],
    ['-1.99', -2, -1],
    ['0', 0, 0],
    ['9999', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  ])(
    'should validate range of the value %s >= %s and <= %s -> %s',
    (value, from, to) => {
      const builder = new VariableBuilder('range', value)

      expect(builder.range(from, to)).toEqual(Number(value))
    }
  )

  it.each([
    ['100', -10, 10],
    ['-1', 0, 10],
    ['0', 10, -10],
  ])(
    'should validate range of the value %s > %s && < %s and throw an Error',
    (value, from, to) => {
      const builder = new VariableBuilder('range', value)

      expect(() => builder.range(from, to)).toThrow(Error)
    }
  )
})
