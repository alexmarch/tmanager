import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "../features/task/reducer"
import userReducer from "../features/user/reducer"

export const store = configureStore({
	reducer: {
		task: taskReducer,
		user: userReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
