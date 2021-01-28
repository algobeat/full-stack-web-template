import isEmail from 'isemail'

export function validatePassword(data: string) {
  if (data.length < 8) {
    return 'Password must be at least 8 characters long'
  }
}

export function validateEmail(data: string) {
  if (!isEmail.validate(data)) {
    return 'Must be a valid email address'
  }
}
