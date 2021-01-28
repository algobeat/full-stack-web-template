import isEmail from "isemail";

export function validatePassword(data: string | undefined) {
  if (!data) {
    return "Password is required";
  }
  if (data.length < 8) {
    return "Password must be at least 8 characters long";
  }
}

export function validateEmail(data: string | undefined) {
  if (!data) {
    return "Email is required";
  }
  if (!isEmail.validate(data)) {
    return "Must be a valid email address";
  }
}
