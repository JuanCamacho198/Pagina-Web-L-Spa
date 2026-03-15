import { authClient } from '$lib/auth-client';
import { toast } from '$lib/stores/toast.svelte';

export class AuthFormLogic {
  isLogin = $state(true);
  isLoading = $state(false);
  email = $state('');
  password = $state('');
  name = $state('');
  errors = $state<Record<string, string>>({});

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
    this.isLogin = !this.isLogin;
  };

  handleAuth = async (e: Event) => {
    e.preventDefault();
    
    if (!this.validate()) {
      return;
    }
    
    this.isLoading = true;

    try {
      if (this.isLogin) {
        const { data, error } = await authClient.signIn.email({
          email: this.email,
          password: this.password,
        });
        if (error) {
          toast.error(error.message || 'Error al iniciar sesión');
        } else {
          toast.success('¡Bienvenido de nuevo!');
          // Redirect to home and ensure state is fresh
          window.location.href = '/';
        }
      } else {
        const { data, error } = await authClient.signUp.email({
          email: this.email,
          password: this.password,
          name: this.name,
        });
        console.log('Signup result:', { data, error });
        if (error) {
          toast.error(error.message || 'Error al registrarte');
        } else {
          toast.success('¡Cuenta creada! Ya puedes iniciar sesión.');
          this.isLogin = true;
          this.password = ''; // Clear password after signup
        }
      }
    } catch (e) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      this.isLoading = false;
    }
  };
}
