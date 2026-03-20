import { browser } from '$app/environment';
import { authClient } from '$lib/auth-client';

const API_URL = typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_API_URL 
    ? (import.meta as any).env.PUBLIC_API_URL 
    : 'http://localhost:3000/api/v1';

// Types
export interface Appointment {
	id: string;
	userId: string;
	serviceId: string;
	auth0Id?: string;
	appointmentDate: string;
	appointmentTime: string;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
	createdAt: string;
	updatedAt?: string;
	// Flattened fields from backend
	serviceName?: string;
	servicePrice?: number;
	serviceDuration?: number;
	userName?: string;
	userEmail?: string;
	userPhone?: string;
	// Nested objects (for compatibility)
	service?: {
		id: string;
		name: string;
		price: number;
		duration: number;
	};
	user?: {
		id: string;
		name: string;
		email: string;
		phone?: string;
	};
}

export interface AppointmentStats {
	total: number;
	confirmed: number;
	pending: number;
	completed: number;
	cancelled: number;
	thisMonth: number;
	revenue: number;
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone?: string;
	role: 'admin' | 'employee' | 'customer';
	image?: string;
	createdAt: string;
	firstName?: string;
	lastName?: string;
}

export interface Service {
	id: string;
	name: string;
	description: string;
	price: number;
	duration: number;
	category: string;
	imageUrl?: string;
	active: boolean;
	intensity?: number;
}

export interface DashboardStats {
	totalUsers: number;
	totalServices: number;
	totalAppointments: number;
	monthlyRevenue: number;
	thisMonthAppointments: number;
	confirmedAppointments: number;
	pendingAppointments: number;
}

// Helper to get user ID from session
async function getUserId(): Promise<string | null> {
	try {
		const session = await authClient.getSession();
		return session?.data?.user?.id || null;
	} catch {
		return null;
	}
}

// Helper for fetch with auth
async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T | null> {
	if (!browser) return null;

	const userId = await getUserId();
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	};

	if (userId) {
		headers['X-User-ID'] = userId;
	}

	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers,
			credentials: 'include',
		});

		if (!response.ok) {
			console.error(`API Error: ${response.status} ${response.statusText}`);
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('API fetch error:', error);
		return null;
	}
}

// ============ ADMIN API ============

export const adminApi = {
	// ============ DASHBOARD ============
	
	async getDashboardStats(): Promise<DashboardStats | null> {
		const appointments = await fetchApi<AppointmentStats>('/appointments/stats');
		
		// Get total users count
		const users = await this.getUsers();
		
		// Get total services count
		const services = await this.getServices();

		if (!appointments || !users || !services) {
			// Return fallback data
			return {
				totalUsers: users?.length || 0,
				totalServices: services?.length || 0,
				totalAppointments: appointments?.total || 0,
				monthlyRevenue: appointments?.revenue || 0,
				thisMonthAppointments: appointments?.thisMonth || 0,
				confirmedAppointments: appointments?.confirmed || 0,
				pendingAppointments: appointments?.pending || 0,
			};
		}

		return {
			totalUsers: users.length,
			totalServices: services.length,
			totalAppointments: appointments.total,
			monthlyRevenue: appointments.revenue,
			thisMonthAppointments: appointments.thisMonth,
			confirmedAppointments: appointments.confirmed,
			pendingAppointments: appointments.pending,
		};
	},

	async getRecentAppointments(limit = 5): Promise<Appointment[]> {
		const appointments = await fetchApi<Appointment[]>('/appointments?limit=' + limit);
		return appointments || [];
	},

	// ============ APPOINTMENTS ============

	async getAppointments(filters?: {
		status?: string;
		date?: string;
		search?: string;
	}): Promise<Appointment[]> {
		const params = new URLSearchParams();
		if (filters?.status) params.set('status', filters.status);
		if (filters?.date) params.set('date', filters.date);
		if (filters?.search) params.set('search', filters.search);

		const query = params.toString();
		const endpoint = query ? `/appointments?${query}` : '/appointments';

		const appointments = await fetchApi<Appointment[]>(endpoint);
		return appointments || [];
	},

	async getAppointmentStats(): Promise<AppointmentStats | null> {
		return await fetchApi<AppointmentStats>('/appointments/stats');
	},

	async confirmAppointment(id: string): Promise<Appointment | null> {
		return await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'confirmed' }),
		});
	},

	async cancelAppointment(id: string): Promise<Appointment | null> {
		return await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'cancelled' }),
		});
	},

	async completeAppointment(id: string): Promise<Appointment | null> {
		return await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'completed' }),
		});
	},

	async deleteAppointment(id: string): Promise<boolean> {
		const result = await fetchApi<{ message: string }>(`/appointments/${id}`, {
			method: 'DELETE',
		});
		return result !== null;
	},

	// ============ USERS ============

	async getUsers(): Promise<User[]> {
		const users = await fetchApi<User[]>('/users/admin/all');
		return users || [];
	},

	async updateUserRole(userId: string, role: 'admin' | 'employee' | 'customer'): Promise<User | null> {
		return await fetchApi<User>(`/users/admin/${userId}/role`, {
			method: 'PATCH',
			body: JSON.stringify({ role }),
		});
	},

	// ============ SERVICES ============

	async getServices(): Promise<Service[]> {
		const services = await fetchApi<Service[]>('/services');
		return services || [];
	},

	async getService(id: string): Promise<Service | null> {
		return await fetchApi<Service>(`/services/${id}`);
	},

	async createService(data: {
		name: string;
		description: string;
		price: number;
		duration: number;
		category: string;
		imageUrl?: string;
		active?: boolean;
		intensity?: number;
	}): Promise<Service | null> {
		return await fetchApi<Service>('/services', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async updateService(
		id: string,
		data: Partial<{
			name: string;
			description: string;
			price: number;
			duration: number;
			category: string;
			imageUrl: string;
			active: boolean;
			intensity: number;
		}>
	): Promise<Service | null> {
		return await fetchApi<Service>(`/services/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	async deleteService(id: string): Promise<boolean> {
		const result = await fetchApi<{ message: string }>(`/services/${id}`, {
			method: 'DELETE',
		});
		return result !== null;
	},

	async toggleServiceActive(id: string, active: boolean): Promise<Service | null> {
		return await this.updateService(id, { active });
	},
};
