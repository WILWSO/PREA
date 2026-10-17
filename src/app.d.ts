import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { ColorMode } from './lib/theme';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient | null;
			user: User | null;
			colorMode: ColorMode;
		}
	}
}

export {};
