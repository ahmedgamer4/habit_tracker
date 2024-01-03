import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

const publicUrls = ['/auth/login', '/auth/register'];

export const load = async ({ cookies, url }: RequestEvent) => {
	for (const pubUrl of publicUrls) if (url.pathname === pubUrl) return;

	if (!cookies.get('token')) {
		console.log('Access Denied');
		throw redirect(307, `/auth/login?redirectTo=${url.pathname}`);
	}
};
