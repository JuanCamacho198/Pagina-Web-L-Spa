export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Estado global reactivo para Svelte 5
class ToastStore {
  toasts = $state<Toast[]>([]);

  add(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID().split('-')[0];
    this.toasts.push({ id, message, type });
    
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: string) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }

  success(msg: string) { this.add(msg, 'success'); }
  error(msg: string) { this.add(msg, 'error'); }
  info(msg: string) { this.add(msg, 'info'); }
  warning(msg: string) { this.add(msg, 'warning'); }
}

export const toast = new ToastStore();
