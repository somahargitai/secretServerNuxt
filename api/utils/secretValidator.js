const Validator = require('validator');

const validateSecret = secretData => {
  if (secretData === null || secretData === undefined) {
    const errorMsg = 'Error! Empty secret object provided!';
    console.error(errorMsg);
    return {
      errorMessage: errorMsg,
      isValid: false
    };
  }
  if (
    secretData.secret === null ||
    secretData.secret === undefined ||
    Validator.isEmpty(secretData.secret)
  ) {
    const errorMsg = 'Error! A non-zero long Secret must be provided';
    console.error(errorMsg);
    return {
      errorMessage: errorMsg,
      isValid: false
    };
  }
  if (
    secretData.expireAfterViews === null ||
    secretData.expireAfterViews === undefined ||
    !Validator.isInt(secretData.expireAfterViews, { gt: 0 })
  ) {
    const errorMsg = 'Error! A view limit, greater than 0 should be provided';
    console.error(errorMsg);
    return {
      errorMessage: errorMsg,
      isValid: false
    };
  }
  if (
    secretData.expireAfter === null ||
    secretData.expireAfter === undefined ||
    !Validator.isInt(secretData.expireAfter, { min: 0 })
  ) {
    const errorMsg = 'Error! A positive or zero time limit should be provided';
    console.error(errorMsg);
    return {
      errorMessage: errorMsg,
      isValid: false
    };
  }
  return {
    errorMessage: '',
    isValid: true
  };
};

const validateQueryParamString = queryParam => {
  if (
    queryParam === null ||
    queryParam === undefined ||
    Validator.isEmpty(queryParam)
  ) {
    const errorMessage =
      'Error! A non-zero long query parameter string must be provided';
    console.error(errorMessage);
    return {
      errorMessage,
      isValid: false
    };
  }
  return {
    errorMessage: '',
    isValid: true
  };
};

module.exports = {
  validateSecret,
  validateQueryParamString
};
