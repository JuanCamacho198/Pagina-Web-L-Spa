import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import { authClient } from '$lib/auth-client';

const API_URL = PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Types
export interface ApiError {
	status: number;
	message: string;
	timestamp: string;
}

export interface ApiResponse<T> {
	data: T;
	error: null;
}

export interface ApiErrorResponse {
	data: null;
	error: ApiError;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

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
): Promise<ApiResult<T>> {
	if (!browser) {
		return {
			data: null,
			error: { status: 0, message: 'Not in browser environment', timestamp: new Date().toISOString() }
		};
	}

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
			const errorMessage = await response.text().catch(() => response.statusText);
			console.error(`API Error: ${response.status} ${response.statusText}`);
			return {
				data: null,
				error: { status: response.status, message: errorMessage, timestamp: new Date().toISOString() }
			};
		}

		const data = await response.json();
		return { data, error: null };
	} catch (error) {
		console.error('API fetch error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Network error';
		return {
			data: null,
			error: { status: 0, message: errorMessage, timestamp: new Date().toISOString() }
		};
	}
}

// ============ ADMIN API ============

export const adminApi = {
	// ============ DASHBOARD ============
	
	async getDashboardStats(): Promise<DashboardStats | null> {
		const appointmentsResult = await fetchApi<AppointmentStats>('/appointments/stats');
		
		// Get total users count
		const usersResult = await this.getUsers();
		
		// Get total services count
		const servicesResult = await this.getServices();

		if (!appointmentsResult || appointmentsResult.error || !usersResult || !servicesResult) {
			// Return fallback data
			return {
				totalUsers: usersResult?.length || 0,
				totalServices: servicesResult?.length || 0,
				totalAppointments: appointmentsResult?.data?.total || 0,
				monthlyRevenue: appointmentsResult?.data?.revenue || 0,
				thisMonthAppointments: appointmentsResult?.data?.thisMonth || 0,
				confirmedAppointments: appointmentsResult?.data?.confirmed || 0,
				pendingAppointments: appointmentsResult?.data?.pending || 0,
			};
		}

		return {
			totalUsers: usersResult.length,
			totalServices: servicesResult.length,
			totalAppointments: appointmentsResult.data.total,
			monthlyRevenue: appointmentsResult.data.revenue,
			thisMonthAppointments: appointmentsResult.data.thisMonth,
			confirmedAppointments: appointmentsResult.data.confirmed,
			pendingAppointments: appointmentsResult.data.pending,
		};
	},

	async getRecentAppointments(limit = 5): Promise<Appointment[]> {
		const result = await fetchApi<Appointment[]>('/appointments?limit=' + limit);
		return result.error ? [] : (result.data || []);
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

		const result = await fetchApi<Appointment[]>(endpoint);
		return result.error ? [] : (result.data || []);
	},

	async getAppointmentStats(): Promise<AppointmentStats | null> {
		const result = await fetchApi<AppointmentStats>('/appointments/stats');
		return result.error ? null : result.data;
	},

	async confirmAppointment(id: string): Promise<Appointment | null> {
		const result = await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'confirmed' }),
		});
		return result.error ? null : result.data;
	},

	async cancelAppointment(id: string): Promise<Appointment | null> {
		const result = await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'cancelled' }),
		});
		return result.error ? null : result.data;
	},

	async completeAppointment(id: string): Promise<Appointment | null> {
		const result = await fetchApi<Appointment>(`/appointments/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'completed' }),
		});
		return result.error ? null : result.data;
	},

	async deleteAppointment(id: string): Promise<boolean> {
		const result = await fetchApi<{ message: string }>(`/appointments/${id}`, {
			method: 'DELETE',
		});
		return !result.error && result.data !== null;
	},

	// ============ USERS ============

	async getUsers(): Promise<User[]> {
		const result = await fetchApi<User[]>('/users/admin/all');
		return result.error ? [] : (result.data || []);
	},

	async updateUserRole(userId: string, role: 'admin' | 'employee' | 'customer'): Promise<User | null> {
		const result = await fetchApi<User>(`/users/admin/${userId}/role`, {
			method: 'PATCH',
			body: JSON.stringify({ role }),
		});
		return result.error ? null : result.data;
	},

	// ============ SERVICES ============

	async getServices(): Promise<Service[]> {
		const result = await fetchApi<Service[]>('/services');
		return result.error ? [] : (result.data || []);
	},

	async getService(id: string): Promise<Service | null> {
		const result = await fetchApi<Service>(`/services/${id}`);
		return result.error ? null : result.data;
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
		const result = await fetchApi<Service>('/services', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return result.error ? null : result.data;
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
		const result = await fetchApi<Service>(`/services/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
		return result.error ? null : result.data;
	},

	async deleteService(id: string): Promise<boolean> {
		const result = await fetchApi<{ message: string }>(`/services/${id}`, {
			method: 'DELETE',
		});
		return !result.error && result.data !== null;
	},

	async toggleServiceActive(id: string, active: boolean): Promise<Service | null> {
		return await this.updateService(id, { active });
	},
};
