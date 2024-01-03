import { superValidate } from 'sveltekit-superforms/client';
import { login, loginFormSchema } from '$lib/api/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const load = () => {
	return {
		form: superValidate(loginFormSchema)
	};
};

export const actions = {
	default: async (e: RequestEvent) => {
		const form = await superValidate(e, loginFormSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const loginData = await login({ email: 'ahmed@mail.com', password: 'ahmed123456' });
		console.log(loginData);
		e.cookies.set('token', loginData.data.token, { path: '/' });
		e.cookies.set('user', JSON.stringify(loginData.data.user), { path: '/' });

		// return { form };
		throw redirect(303, e.url.searchParams.get('redirectTo')!);
	}
};
