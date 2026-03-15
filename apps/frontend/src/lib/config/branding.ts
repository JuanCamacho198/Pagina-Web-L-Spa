import { browser } from '$app/environment';

	/**
	 * Branding Configuration Interface
	 * Stores all customizable branding elements for the site
	 */
	export interface BrandingConfig {
		// Navbar
		navbarText: string;
		
		// Logo
		customLogo: string | null; // Base64 encoded image
		logoSize: number; // Height in pixels (24-120)
		
		// Footer
		footerText: string;
		
		// Metadata
		lastUpdated: string;
	}

	/**
	 * Default branding configuration
	 * Used when no custom configuration exists
	 */
	export const DEFAULT_BRANDING: BrandingConfig = {
		navbarText: 'L-SPA',
		customLogo: null,
		logoSize: 48,
		footerText: 'Tu refugio de bienestar y relajación. Expertos en masajes, tratamientos faciales y cuidado personal.',
		lastUpdated: new Date().toISOString()
	};

	/**
	 * Storage key for admin configuration in localStorage
	 */
	const STORAGE_KEY = 'lspa_admin_config';

	/**
	 * Validation constants
	 */
	export const MAX_LOGO_SIZE_BYTES = 500 * 1024; // 500KB
	export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
	export const MIN_LOGO_SIZE = 24;
	export const MAX_LOGO_SIZE = 120;

	/**
	 * Load branding configuration from localStorage
	 * Returns full config merged with defaults
	 */
	export function loadBrandingConfig(): BrandingConfig {
		if (!browser) return { ...DEFAULT_BRANDING };

		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				// Extract branding fields if they exist
				if (parsed.branding) {
					return { ...DEFAULT_BRANDING, ...parsed.branding };
				}
			}
		} catch (e) {
			console.error('Error loading branding config:', e);
		}
		return { ...DEFAULT_BRANDING };
	}

	/**
	 * Save branding configuration to localStorage
	 * Merges with existing config to preserve other settings
	 */
	export function saveBrandingConfig(config: Partial<BrandingConfig>): boolean {
		if (!browser) return false;

		try {
			// Load existing config
			const saved = localStorage.getItem(STORAGE_KEY);
			const existingConfig = saved ? JSON.parse(saved) : {};
			
			// Update branding section
			const newBranding: BrandingConfig = {
				...DEFAULT_BRANDING,
				...existingConfig.branding,
				...config,
				lastUpdated: new Date().toISOString()
			};
			
			// Save merged config
			existingConfig.branding = newBranding;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(existingConfig));
			
			return true;
		} catch (e) {
			console.error('Error saving branding config:', e);
			return false;
		}
	}

	/**
	 * Get branding config with all defaults applied
	 * Useful for ensuring all fields have values
	 */
	export function getBrandingWithDefaults(): BrandingConfig {
		return loadBrandingConfig();
	}

	/**
	 * Validate image file for logo upload
	 * Returns error message or null if valid
	 */
	export function validateImageFile(file: File): string | null {
		// Check file type
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			return `Tipo de archivo no válido. Usa: PNG, JPG o WebP`;
		}
		
		// Check file size
		if (file.size > MAX_LOGO_SIZE_BYTES) {
			const maxKB = MAX_LOGO_SIZE_BYTES / 1024;
			return `La imagen es muy grande. Máximo: ${maxKB}KB`;
		}
		
		return null;
	}

	/**
	 * Convert file to base64 string
	 * Returns Promise that resolves to base64 data URL
	 */
	export function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					resolve(reader.result);
				} else {
					reject(new Error('Failed to convert file to base64'));
				}
			};
			reader.onerror = () => reject(new Error('Error reading file'));
			reader.readAsDataURL(file);
		});
	}

	/**
	 * Clear custom logo from configuration
	 */
	export function clearCustomLogo(): boolean {
		return saveBrandingConfig({ customLogo: null });
	}
