const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password, skills } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter a valid name");
  } else if (!email || !password) {
    throw new Error("Provide email and password");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditRequest = (req) => {
  const editAllowedFields = ["firstName", "lastName", "age", "skills"];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    editAllowedFields.includes(key)
  );
  return isEditAllowed;
};

module.exports = { validateSignUp, validateEditRequest };
