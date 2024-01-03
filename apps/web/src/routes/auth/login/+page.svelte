<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'formsnap';
	import { loginFormSchema, type LoginInputSchema } from '$lib/api/auth';
	import { redirect } from '@sveltejs/kit';
	import { page } from '$app/stores';

	const redirectTo = $page.url.searchParams.get('redirectTo') || '/';
	export let data;
	let form: SuperValidated<LoginInputSchema>;
</script>

<div class="flex min-h-screen items-center justify-center">
	<Form.Root
		method="POST"
		{form}
		schema={loginFormSchema}
		let:config
		action="?&redirectTo={redirectTo}"
	>
		<Card.Root class="w-[400px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Login</Card.Title>
				<Card.Description>Enter your email below to login your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label for="email">Email</Form.Label>
						<Form.Input id="email" type="email" placeholder="ahmed@mail.com" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label for="password">Password</Form.Label>
						<Form.Input id="password" type="password" placeholder="********" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" formaction="?&redirectTo={redirectTo}">Login</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
