// Password strength validation for admin change-password.
// Requirements: min 12 chars, 1 upper, 1 lower, 1 digit, 1 special.
export function validatePasswordStrength(pw) {
  if (typeof pw !== 'string') return 'Password is required'
  if (pw.length < 12) return 'Password must be at least 12 characters'
  if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter'
  if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter'
  if (!/[0-9]/.test(pw)) return 'Password must include a number'
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include a special character'
  return null
}
