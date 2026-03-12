import { authClient } from '$lib/auth-client';
import { toast } from '$lib/components/feedback/Toast.svelte';

export class AuthFormLogic {
  isLogin = $state(true);
  isLoading = $state(false);
  email = $state('');
  password = $state('');
  name = $state('');

  toggleMode = () => {
    this.isLogin = !this.isLogin;
  };

  handleAuth = async (e: Event) => {
    e.preventDefault();
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
          window.location.reload();
        }
      } else {
        const { data, error } = await authClient.signUp.email({
          email: this.email,
          password: this.password,
          name: this.name,
        });
        if (error) {
          toast.error(error.message || 'Error al registrarte');
        } else {
          toast.success('Cuenta creada con éxito');
          this.isLogin = true;
        }
      }
    } catch (e) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      this.isLoading = false;
    }
  };
}
