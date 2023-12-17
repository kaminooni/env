import { env } from '../env'

jest.mock('../VariableBuilder')
const { VariableBuilder } = jest.requireMock(
  '../VariableBuilder'
)

const testEnvKey = 'KAMINOONI_ENV_TEST_VARIABLE'

describe('env', () => {
  beforeEach(() => {
    VariableBuilder.mockClear()
    delete process.env[testEnvKey]
  })

  it.each([['test'], ['123'], ['true'], ['df13'], ['default']])(
    'should read env variable and return VariableBuilder for [%s] value',
    (value) => {
      process.env[testEnvKey] = value
      env(testEnvKey)

      expect(VariableBuilder).toBeCalledWith(testEnvKey, value)
      expect(VariableBuilder).toBeCalledTimes(1)
    }
  )

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
      env(testEnvKey, def)
      expect(VariableBuilder).toBeCalledWith(testEnvKey, expected)
      expect(VariableBuilder).toBeCalledTimes(1)
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
    process.env[testEnvKey] = 'value'
    env(testEnvKey, def)
    expect(VariableBuilder).toBeCalledWith(testEnvKey, 'value')
    expect(VariableBuilder).toBeCalledTimes(1)
  })
})
