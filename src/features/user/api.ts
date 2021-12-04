import { createAsyncThunk } from "@reduxjs/toolkit"
export type LoginQueryParams = {
	user: {
		username: string,
		password: string
	}
}

export interface User {
	token: '',
	error: ''
}

export const logout = () => {
	localStorage.removeItem('token')
}

export const isLogin = (): string => {
	return localStorage.getItem('token') || ''
}

export const loginUser = createAsyncThunk(
	'user/login',
	async (params: LoginQueryParams, thunkApi) => {
		const form = new FormData()
		form.append('username', params.user.username)
		form.append('password', params.user.password)

		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}login?developer=${process.env.REACT_APP_DEVELOPER}`,
			{
				method: "POST",
				body: form
			})

		const data = await resp.json()
		if (data.status === 'error') {
			return {
				error: data.message.password || data.message.username,
				token: ''
			} as User
		}
		return {
			error: '',
			token: data.message.token
		} as User
	}
)
