import { z } from 'zod';
import { baseUrl } from './base';
import axios from 'axios';

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: 'Password must be longer than 8 characters' }).max(100)
});

export type LoginInputSchema = typeof loginFormSchema;

const base = `${baseUrl}/auth`;

export const login = async (input: z.infer<LoginInputSchema>) => {
	const data = await axios.post(`${base}/login`, input);
	return data.data;
};
