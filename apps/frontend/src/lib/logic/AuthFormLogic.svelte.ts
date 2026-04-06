import { authClient } from '$lib/auth-client';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import {
  getLocalizedPath,
  normalizeLocalizedReturnTo,
  resolveActiveLocale
} from '$lib/i18n/utils';
import { getAuthErrorMessageDescriptor } from '$lib/auth/auth-toast';
import { toast } from '$lib/stores/toast.svelte';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

export class AuthFormLogic {
  isLogin = $state(true);
  isLoading = $state(false);
  email = $state('');
  password = $state('');
  name = $state('');
  errors = $state<Record<string, string>>({});

  private t(key: string, fallback: string): string {
    const translate = get(_);
    const value = translate(key);
    return typeof value === 'string' && value !== key ? value : fallback;
  }

  private getCookieLocale(): string | null {
    if (typeof document === 'undefined') return null;

    const raw = document.cookie
      .split('; ')
      .find((chunk) => chunk.startsWith('lang='))
      ?.split('=')[1];

    return raw ?? null;
  }

  private getActiveLocale(): string {
    const urlLocale = typeof window === 'undefined' ? null : get(page).params.lang;
    return resolveActiveLocale({
      urlLocale,
      cookieLocale: this.getCookieLocale()
    });
  }

  private async redirectAfterAuth(defaultPath = '/'): Promise<void> {
    const activeLocale = this.getActiveLocale();

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const returnTo = new URLSearchParams(search).get('returnTo');

    const target = normalizeLocalizedReturnTo(returnTo, activeLocale, defaultPath);
    await goto(target, { replaceState: true, invalidateAll: true });
  }

  constructor(initialMode: 'login' | 'register' = 'login') {
    this.isLogin = initialMode === 'login';
  }

  validate = () => {
    this.errors = {};
    if (!this.email) {
      this.errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors.email = 'Ingresa un correo electrónico válido';
    }
    if (!this.password) {
      this.errors.password = 'La contraseña es requerida';
    } else if (this.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!this.isLogin) {
      if (!this.name) {
        this.errors.name = 'El nombre completo es requerido';
      }
    }
    return Object.keys(this.errors).length === 0;
  };

  toggleMode = () => {
    const activeLocale = this.getActiveLocale();

    if (this.isLogin) {
      goto(getLocalizedPath('/registro', activeLocale), { replaceState: true });
    } else {
      goto(getLocalizedPath('/login', activeLocale), { replaceState: true });
    }
  };

  handleAuth = async (e: Event) => {
    e.preventDefault();
    
    if (!this.validate()) {
      return;
    }
    
    this.isLoading = true;

    try {
      if (this.isLogin) {
        const { error } = await authClient.signIn.email({
          email: this.email,
          password: this.password,
        });
        if (error) {
          const descriptor = getAuthErrorMessageDescriptor('login', error);
          toast.error(
            this.t(descriptor.key, descriptor.fallback),
            this.t('auth.toast.login.error.title', 'Sign in failed')
          );
        } else {
          toast.success(
            this.t('auth.toast.login.success.message', 'Welcome back to L-SPA.'),
            this.t('auth.toast.login.success.title', 'Welcome back')
          );
          await authClient.getSession();
          await this.redirectAfterAuth('/');
        }
      } else {
        const { error } = await authClient.signUp.email({
          email: this.email,
          password: this.password,
          name: this.name,
        });
        if (error) {
          const descriptor = getAuthErrorMessageDescriptor('register', error);
          toast.error(
            this.t(descriptor.key, descriptor.fallback),
            this.t('auth.toast.register.error.title', 'Registration failed')
          );
        } else {
          toast.success(
            this.t('auth.toast.register.success.message', 'Your account is ready. You can sign in now.'),
            this.t('auth.toast.register.success.title', 'Account created')
          );
          await authClient.getSession();
          await this.redirectAfterAuth('/');
        }
      }
    } catch (e) {
      toast.error(
        this.t('auth.toast.generic.error.message', 'An unexpected error occurred. Please try again.'),
        this.t('auth.toast.generic.error.title', 'Unexpected error')
      );
    } finally {
      this.isLoading = false;
    }
  };
}
