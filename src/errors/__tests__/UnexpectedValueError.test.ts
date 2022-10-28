import { UnexpectedValueError } from '../UnexpectedValueError'

describe('UnexpectedValueError', () => {
  it('should have correct error message', () => {
    const error = new UnexpectedValueError('TEST_VAR', 'TEST_VALUE')

    expect(error.message).toEqual(
      `Unexpected env variable value 'TEST_VAR=TEST_VALUE'`
    )
  })
})
