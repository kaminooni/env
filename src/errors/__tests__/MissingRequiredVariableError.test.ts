import { MissingRequiredVariableError } from '../MissingRequiredVariableError'

describe('MissingRequiredVariableError', () => {
  it('should have correct error message', () => {
    const error = new MissingRequiredVariableError('TEST_VAR')

    expect(error.message).toEqual("Required env variable 'TEST_VAR' not found")
  })
})
