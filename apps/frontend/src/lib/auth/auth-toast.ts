type AuthAction = 'login' | 'register';

type AuthErrorDescriptor = {
  key: string;
  fallback: string;
};

type ErrorShape = {
  code?: string;
  status?: number;
};

const LOGIN_ERROR_DESCRIPTORS = {
  invalidCredentials: {
    key: 'auth.toast.login.error.invalidCredentials',
    fallback: 'We could not validate your credentials. Please try again.'
  },
  emailNotVerified: {
    key: 'auth.toast.login.error.emailNotVerified',
    fallback: 'Please verify your email before signing in.'
  },
  rateLimited: {
    key: 'auth.toast.login.error.rateLimited',
    fallback: 'Too many attempts. Please wait a moment and try again.'
  },
  server: {
    key: 'auth.toast.login.error.server',
    fallback: 'Unable to sign in right now. Please try again later.'
  },
  generic: {
    key: 'auth.toast.login.error.message',
    fallback: 'Unable to sign in right now.'
  }
} as const;

const REGISTER_ERROR_DESCRIPTORS = {
  emailInUse: {
    key: 'auth.toast.register.error.emailInUse',
    fallback: 'That email is already in use. Try signing in instead.'
  },
  weakPassword: {
    key: 'auth.toast.register.error.weakPassword',
    fallback: 'Your password is too weak. Please choose a stronger one.'
  },
  rateLimited: {
    key: 'auth.toast.register.error.rateLimited',
    fallback: 'Too many attempts. Please wait a moment and try again.'
  },
  server: {
    key: 'auth.toast.register.error.server',
    fallback: 'Unable to create your account right now. Please try again later.'
  },
  generic: {
    key: 'auth.toast.register.error.message',
    fallback: 'Unable to create your account right now.'
  }
} as const;

function getErrorMeta(error: unknown): { code: string; status: number | null } {
  const candidate = (error ?? {}) as ErrorShape;
  const code = typeof candidate.code === 'string' ? candidate.code.toUpperCase() : '';
  const status = typeof candidate.status === 'number' ? candidate.status : null;
  return { code, status };
}

export function getAuthErrorMessageDescriptor(action: AuthAction, error: unknown): AuthErrorDescriptor {
  const { code, status } = getErrorMeta(error);

  if (action === 'login') {
    if (
      status === 401 ||
      code.includes('INVALID_CREDENTIAL') ||
      code.includes('INVALID_EMAIL_OR_PASSWORD') ||
      code.includes('WRONG_CREDENTIAL') ||
      code.includes('USER_NOT_FOUND') ||
      code.includes('INVALID_PASSWORD')
    ) {
      return LOGIN_ERROR_DESCRIPTORS.invalidCredentials;
    }

    if (code.includes('EMAIL_NOT_VERIFIED')) {
      return LOGIN_ERROR_DESCRIPTORS.emailNotVerified;
    }

    if (status === 429 || code.includes('TOO_MANY_REQUESTS') || code.includes('RATE_LIMIT')) {
      return LOGIN_ERROR_DESCRIPTORS.rateLimited;
    }

    if (status !== null && status >= 500) {
      return LOGIN_ERROR_DESCRIPTORS.server;
    }

    return LOGIN_ERROR_DESCRIPTORS.generic;
  }

  if (
    status === 409 ||
    code.includes('USER_ALREADY_EXISTS') ||
    code.includes('EMAIL_ALREADY_EXISTS') ||
    code.includes('EMAIL_IN_USE') ||
    code.includes('DUPLICATE')
  ) {
    return REGISTER_ERROR_DESCRIPTORS.emailInUse;
  }

  if (
    status === 422 ||
    code.includes('WEAK_PASSWORD') ||
    code.includes('PASSWORD_TOO_SHORT') ||
    code.includes('PASSWORD_WEAK')
  ) {
    return REGISTER_ERROR_DESCRIPTORS.weakPassword;
  }

  if (status === 429 || code.includes('TOO_MANY_REQUESTS') || code.includes('RATE_LIMIT')) {
    return REGISTER_ERROR_DESCRIPTORS.rateLimited;
  }

  if (status !== null && status >= 500) {
    return REGISTER_ERROR_DESCRIPTORS.server;
  }

  return REGISTER_ERROR_DESCRIPTORS.generic;
}
