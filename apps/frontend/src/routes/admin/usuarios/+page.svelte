<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Plus, Edit, Trash2, Eye, Loader2, X, ChevronDown } from 'lucide-svelte';
	import { adminApi, type User } from '$lib/api/admin';
	import Skeleton from 'boneyard-js/svelte';

	// Data from API
	let users: User[] = $state([]);
	let loading = $state(true);
	let actionLoading = $state<string | null>(null);

	// Filters
	let searchQuery = $state('');
	let selectedRole = $state('all');

	// Role dropdown state
	let openRoleDropdown = $state<string | null>(null);

	// Role mapping (backend uses 'customer', UI shows 'cliente')
	const roleLabels: Record<string, string> = {
		admin: 'Administrador',
		employee: 'Empleado',
		customer: 'Cliente'
	};

	// Load data from API
	async function loadData() {
		loading = true;
		try {
			users = await adminApi.getUsers();
		} catch (error) {
			console.error('Error loading users:', error);
		} finally {
			loading = false;
		}
	}

	// Filtered users
	let filteredUsers = $derived(
		users.filter(user => {
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch = !searchQuery || 
				(user.name || '').toLowerCase().includes(searchLower) ||
				(user.email || '').toLowerCase().includes(searchLower);
			const matchesRole = selectedRole === 'all' || user.role === selectedRole;
			return matchesSearch && matchesRole;
		})
	);

	function getRoleColor(role: string) {
		switch(role) {
			case 'admin': return 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
			case 'employee': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
			case 'customer': return 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
			default: return 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
		}
	}

	function getRoleLabel(role: string) {
		return roleLabels[role] || role;
	}

	function formatDate(dateStr: string | undefined) {
		if (!dateStr) return '--';
		const date = new Date(dateStr);
		return date.toLocaleDateString('es-CO', { 
			day: 'numeric', 
			month: 'short', 
			year: 'numeric' 
		});
	}

	async function updateUserRole(userId: string, newRole: 'admin' | 'employee' | 'customer') {
		actionLoading = userId;
		openRoleDropdown = null;
		try {
			const result = await adminApi.updateUserRole(userId, newRole);
			if (result) {
				users = users.map(u => u.id === userId ? result : u);
			}
		} catch (error) {
			console.error('Error updating user role:', error);
		} finally {
			actionLoading = null;
		}
	}

	function toggleRoleDropdown(userId: string) {
		openRoleDropdown = openRoleDropdown === userId ? null : userId;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.role-dropdown')) {
			openRoleDropdown = null;
		}
	}

	onMount(() => {
		loadData();
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	let isLoading = $derived(loading);
</script>

<Skeleton loading={isLoading}>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight uppercase">Usuarios</h1>
			<p class="text-gray-500 dark:text-gray-400 font-medium mt-1">Gestiona los usuarios del sistema</p>
		</div>
		<div class="flex items-center gap-4">
			<button 
				onclick={loadData}
				disabled={loading}
				class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
			>
				{#if loading}
					<Loader2 size={14} class="animate-spin" />
				{/if}
				Actualizar
			</button>
		</div>
	</div>

		<!-- Filters -->
		<div class="flex items-center gap-4">
			<div class="flex-1 relative">
				<Search size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
				<input 
					type="text" 
					placeholder="Buscar usuarios..." 
					bind:value={searchQuery}
					class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
				/>
			</div>
			<select 
				bind:value={selectedRole}
				class="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-primary outline-none font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
			>
				<option value="all">Todos los roles</option>
				<option value="admin">Administradores</option>
				<option value="employee">Empleados</option>
				<option value="customer">Clientes</option>
			</select>
		</div>

		<!-- Users Table -->
		<div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-primary/5 border border-secondary/20 overflow-hidden transition-all duration-500 hover:-translate-y-1">
			<table class="w-full">
				<thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
					<tr>
						<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Usuario</th>
						<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Contacto</th>
						<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Rol</th>
						<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Fecha Alta</th>
						<th class="px-8 py-6"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50 dark:divide-gray-700">
					{#each filteredUsers as user}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-500">
							<td class="px-8 py-6">
								<div class="flex items-center gap-4">
									<img 
										src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}`} 
										alt={user.name}
										class="w-12 h-12 rounded-full"
									/>
									<div>
										<p class="font-black text-gray-900 dark:text-white">{user.name || 'Sin nombre'}</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
									</div>
								</div>
							</td>
							<td class="px-8 py-6">
								<p class="font-medium text-gray-900 dark:text-white">{user.phone || '--'}</p>
							</td>
							<td class="px-8 py-6">
								<div class="relative role-dropdown">
									<button 
										onclick={() => toggleRoleDropdown(user.id)}
										disabled={actionLoading === user.id}
										class="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border {getRoleColor(user.role)} hover:opacity-80 transition-opacity duration-500 disabled:opacity-50"
									>
										{#if actionLoading === user.id}
											<Loader2 size={14} class="animate-spin" />
										{/if}
										{getRoleLabel(user.role)}
										<ChevronDown size={14} />
									</button>
									
									{#if openRoleDropdown === user.id}
										<div class="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-40">
											<button 
												onclick={() => updateUserRole(user.id, 'admin')}
												class="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 {user.role === 'admin' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}"
											>
												Administrador
											</button>
											<button 
												onclick={() => updateUserRole(user.id, 'employee')}
												class="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 {user.role === 'employee' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}"
											>
												Empleado
											</button>
											<button 
												onclick={() => updateUserRole(user.id, 'customer')}
												class="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 {user.role === 'customer' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}"
											>
												Cliente
											</button>
										</div>
									{/if}
								</div>
							</td>
							<td class="px-8 py-6">
								<p class="text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</p>
							</td>
							<td class="px-8 py-6">
								<div class="flex items-center gap-2">
									<button class="p-3 text-gray-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-colors duration-500" title="Ver">
										<Eye size={18} />
									</button>
									<button class="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors duration-500" title="Editar">
										<Edit size={18} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filteredUsers.length === 0}
				<div class="py-20 text-center">
					<p class="text-gray-400 dark:text-gray-500 font-medium">No se encontraron usuarios</p>
				</div>
			{/if}
		</div>
	</div>
	</Skeleton>
