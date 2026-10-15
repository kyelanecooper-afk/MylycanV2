export type SignupErrors = { email?: string; password?: string };

// Preview-only validation; the future auth service must validate independently.
export function validateSignup(email: string, password: string): SignupErrors {
  const errors: SignupErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter an email address we can reach you at.';
  }
  if (password.length < 15) {
    errors.password = 'Please use at least 15 characters. A few words together can be easier to remember.';
  } else if (password.length > 128) {
    errors.password = 'Please keep your password to 128 characters or fewer.';
  }
  return errors;
}
