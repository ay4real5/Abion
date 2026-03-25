import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasValidEnv(value: string | undefined): value is string {
	return (
		!!value &&
		!value.startsWith('your_') &&
		!value.includes('your_supabase_')
	);
}

// Server-side client using the service role key (bypasses Row Level Security)
// Only use this in server-side code (API routes, Server Components)
export function getSupabaseAdminClient() {
	if (!hasValidEnv(supabaseUrl) || !hasValidEnv(supabaseServiceRoleKey)) {
		return null;
	}

	try {
		return createClient(supabaseUrl, supabaseServiceRoleKey);
	} catch (error) {
		console.error('Supabase client initialization failed:', error);
		return null;
	}
}
