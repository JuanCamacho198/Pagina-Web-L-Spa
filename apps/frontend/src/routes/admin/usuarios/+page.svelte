<script lang="ts">
	import { Search, Plus, MoreVertical, Mail, Phone, Calendar, ShieldCheck, Edit, Trash2, Eye } from 'lucide-svelte';

	// Mock users data - en producción vendría de la API
	let users = [
		{ 
			id: '1', 
			name: 'María González', 
			email: 'maria.gonzalez@email.com',
			phone: '+57 300 123 4567',
			role: 'cliente',
			createdAt: '15 Ene 2024',
			bookings: 12,
			status: 'active'
		},
		{ 
			id: '2', 
			name: 'Carlos Ruiz', 
			email: 'carlos.ruiz@email.com',
			phone: '+57 301 234 5678',
			role: 'cliente',
			createdAt: '20 Feb 2024',
			bookings: 8,
			status: 'active'
		},
		{ 
			id: '3', 
			name: 'Ana Martínez', 
			email: 'ana.martinez@email.com',
			phone: '+57 302 345 6789',
			role: 'empleado',
			createdAt: '10 Mar 2024',
			bookings: 0,
			status: 'active'
		},
		{ 
			id: '4', 
			name: 'Luis Fernando', 
			email: 'luis.fernando@email.com',
			phone: '+57 303 456 7890',
			role: 'admin',
			createdAt: '01 Ene 2024',
			bookings: 0,
			status: 'active'
		},
		{ 
			id: '5', 
			name: 'Sofia Pérez', 
			email: 'sofia.perez@email.com',
			phone: '+57 304 567 8901',
			role: 'cliente',
			createdAt: '05 Abr 2024',
			bookings: 3,
			status: 'inactive'
		},
	];

	let searchQuery = '';
	let selectedRole = 'all';

	$: filteredUsers = users.filter(user => {
		const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							  user.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = selectedRole === 'all' || user.role === selectedRole;
		return matchesSearch && matchesRole;
	});

	function getRoleColor(role: string) {
		switch(role) {
			case 'admin': return 'bg-purple-50 text-purple-600';
			case 'empleado': return 'bg-blue-50 text-blue-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}

	function getStatusColor(status: string) {
		return status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500';
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Usuarios</h1>
			<p class="text-gray-500 font-medium mt-1">Gestiona los usuarios del sistema</p>
		</div>
		<button class="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
			<Plus size={18} />
			Nuevo Usuario
		</button>
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-4">
		<div class="flex-1 relative">
			<Search size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
			<input 
				type="text" 
				placeholder="Buscar usuarios..." 
				bind:value={searchQuery}
				class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
			/>
		</div>
		<select 
			bind:value={selectedRole}
			class="px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary outline-none font-medium bg-white"
		>
			<option value="all">Todos los roles</option>
			<option value="admin">Administradores</option>
			<option value="empleado">Empleados</option>
			<option value="cliente">Clientes</option>
		</select>
	</div>

	<!-- Users Table -->
	<div class="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50 border-b border-gray-100">
				<tr>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Usuario</th>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contacto</th>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Rol</th>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reservas</th>
					<th class="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha Alta</th>
					<th class="px-8 py-6"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-50">
				{#each filteredUsers as user}
					<tr class="hover:bg-gray-50 transition-colors">
						<td class="px-8 py-6">
							<div class="flex items-center gap-4">
								<img 
									src={`https://ui-avatars.com/api/?name=${user.name}`} 
									alt={user.name}
									class="w-12 h-12 rounded-full"
								/>
								<div>
									<p class="font-black text-gray-900">{user.name}</p>
									<p class="text-sm text-gray-500">{user.email}</p>
								</div>
							</div>
						</td>
						<td class="px-8 py-6">
							<p class="font-medium text-gray-900">{user.phone}</p>
						</td>
						<td class="px-8 py-6">
							<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getRoleColor(user.role)}">
								{user.role}
							</span>
						</td>
						<td class="px-8 py-6">
							<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getStatusColor(user.status)}">
								{user.status === 'active' ? 'Activo' : 'Inactivo'}
							</span>
						</td>
						<td class="px-8 py-6">
							<p class="font-black text-gray-900">{user.bookings}</p>
						</td>
						<td class="px-8 py-6">
							<p class="text-gray-500">{user.createdAt}</p>
						</td>
						<td class="px-8 py-6">
							<div class="flex items-center gap-2">
								<button class="p-3 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors" title="Ver">
									<Eye size={18} />
								</button>
								<button class="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Editar">
									<Edit size={18} />
								</button>
								<button class="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Eliminar">
									<Trash2 size={18} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if filteredUsers.length === 0}
			<div class="py-20 text-center">
				<p class="text-gray-400 font-medium">No se encontraron usuarios</p>
			</div>
		{/if}
	</div>
</div>
