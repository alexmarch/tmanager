import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { loginUser, User } from "./api"

const initialState = {
	validationError: '',
	isLogIn: false
}

const userSlice = createSlice({
	name: 'user',
	reducers: {},
	initialState,
	extraReducers: (builder) => {
		builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
			state.validationError = action.payload.error
			if (action.payload.error === '') {
				state.isLogIn = true
				localStorage.setItem('token', action.payload.token)
			}
		})
	}
})

export default userSlice.reducer
