export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

// Estado global reactivo para Svelte 5
class ToastStore {
  toasts = $state<Toast[]>([]);

  private getDefaultTitle(type: ToastType): string {
    if (type === 'success') return 'Success';
    if (type === 'error') return 'Error';
    if (type === 'warning') return 'Warning';
    return 'Info';
  }

  add(message: string, type: ToastType = 'info', title?: string) {
    const id = crypto.randomUUID().split('-')[0];
    this.toasts.push({ id, title: title ?? this.getDefaultTitle(type), message, type });
    
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

  success(msg: string, title?: string) { this.add(msg, 'success', title); }
  error(msg: string, title?: string) { this.add(msg, 'error', title); }
  info(msg: string, title?: string) { this.add(msg, 'info', title); }
  warning(msg: string, title?: string) { this.add(msg, 'warning', title); }
}

export const toast = new ToastStore();
