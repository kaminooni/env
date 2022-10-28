import { env } from '../env'

jest.mock('../EnvVariableBuilder')
const { EnvVariableBuilder: EnvVariableBuilderMock } = jest.requireMock(
  '../EnvVariableBuilder'
)

describe('env', () => {
  beforeEach(() => {
    EnvVariableBuilderMock.mockClear()
  })

  it.each([['test'], ['123'], ['true'], ['df13']])(
    'should read env variable and return EnvVariableBuilder for [%s] value',
    (value) => {
      process.env['test'] = value
      env('test')

      expect(EnvVariableBuilderMock).toBeCalledWith('test', value)
      expect(EnvVariableBuilderMock).toBeCalledTimes(1)

      delete process.env['test']
    }
  )
})
