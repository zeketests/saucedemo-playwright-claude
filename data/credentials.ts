export const VALID_PASSWORD = 'secret_sauce';

export const Users = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user',
} as const;

export const ErrorMessages = {
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
} as const;

export const CheckoutErrors = {
  FIRST_NAME_REQUIRED: 'Error: First Name is required',
  LAST_NAME_REQUIRED: 'Error: Last Name is required',
  POSTAL_CODE_REQUIRED: 'Error: Postal Code is required',
} as const;

export const ProtectedRoutes = [
  { path: '/inventory.html', label: 'inventory' },
  { path: '/cart.html', label: 'cart' },
  { path: '/checkout-step-one.html', label: 'checkout' },
] as const;

export const protectedRouteError = (path: string) =>
  `Epic sadface: You can only access '${path}' when you are logged in.`;
