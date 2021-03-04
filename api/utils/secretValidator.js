const Validator = require("validator");

const validateSecret = secretData => {
  if (secretData === null || secretData === undefined) {
    console.error("Error! Empty secret object provided!");
    return {
      errorMessage: "Error! Empty secret object provided!",
      isValid: false
    };
  }
  if (
    secretData.secret === null ||
    secretData.secret === undefined ||
    Validator.isEmpty(secretData.secret)
  ) {
    console.error("Error! A non-zero long Secret must be provided");
    return {
      errorMessage: "Error! A non-zero long Secret must be provided",
      isValid: false
    };
  }
  if (
    secretData.expireAfterViews === null ||
    secretData.expireAfterViews === undefined ||
    !Validator.isInt(secretData.expireAfterViews, { gt: 0 })
  ) {
    console.error("Error! A view limit, greater than 0 should be provided");
    return {
      errorMessage: "Error! A view limit, greater than 0 should be provided",
      isValid: false
    };
  }
  if (
    secretData.expireAfter === null ||
    secretData.expireAfter === undefined ||
    !Validator.isInt(secretData.expireAfter, { gt: 0 })
  ) {
    console.error("Error! A time limit, greater than 1 should be provided");
    return {
      errorMessage: "Error! A time limit, greater than 1 should be provided",
      isValid: false
    };
  }
  return {
    errorMessage: "",
    isValid: true
  };
};

const validateQueryParamString = queryParam => {
  if (
    queryParam === null ||
    queryParam === undefined ||
    Validator.isEmpty(queryParam)
  ) {
    console.error(
      "Error! A non-zero long query parameter string must be provided"
    );
    return {
      errorMessage:
        "Error! A non-zero long query parameter string must be provided",
      isValid: false
    };
  }
  return {
    errorMessage: "",
    isValid: true
  };
};

module.exports = {
  validateSecret,
  validateQueryParamString
};
