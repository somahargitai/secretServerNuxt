const Validator = require('validator');
const { validateQueryParamString } = require('../../utils/secretValidator');

jest.mock('validator');

describe('Validation', () => {
  describe('ValidateQueryParamString', () => {
    test('passes for proper string', async () => {
      Validator.isEmpty = jest.fn(() => false);

      const valid = validateQueryParamString('This is a proper string');

      expect(valid.isValid).toEqual(true);
      expect(Validator.isEmpty).toHaveBeenCalledTimes(1);
    });

    test('returns with error if param string is undefined', async () => {
      Validator.isEmpty = jest.fn(() => true);

      const valid = validateQueryParamString(undefined);

      expect(valid).toEqual({
        errorMessage:
          'Error! A non-zero long query parameter string must be provided',
        isValid: false
      });
      expect(Validator.isEmpty).toHaveBeenCalledTimes(0);
    });

    test('returns with error if param string is null', async () => {
      Validator.isEmpty = jest.fn(() => true);

      const valid = validateQueryParamString(null);

      expect(valid).toEqual({
        errorMessage:
          'Error! A non-zero long query parameter string must be provided',
        isValid: false
      });
      expect(Validator.isEmpty).toHaveBeenCalledTimes(0);
    });

    test('returs with error if param string is empty', async () => {
      Validator.isEmpty = jest.fn(() => true);

      const valid = validateQueryParamString('');

      expect(valid).toEqual({
        errorMessage:
          'Error! A non-zero long query parameter string must be provided',
        isValid: false
      });
      expect(Validator.isEmpty).toHaveBeenCalledTimes(1);
    });
  });
});
