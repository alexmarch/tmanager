import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { ITask } from "./Task"
import { fetchTasksByPage, createTask, TasksResp, GetListQueryParams } from "./api"

interface DefaultState {
	taskList: Array<ITask>,
	successStatus: string|boolean
	totalCount: number,
	editTask?: ITask,
	getListQueryParams: GetListQueryParams
}

const initialState: DefaultState = {
	taskList: [],
	successStatus: '',
	totalCount: 0,
	editTask: {
		username: '',
		email: '',
		status: 0,
		text: ''
	},
	getListQueryParams: {
		sortField: "username",
		sortDirection: "asc",
		pageNum: 1
	}
}

export const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		editTask: (state, { payload }) => {
			state.editTask ={ ...state.editTask, ...payload }
		},
		changeQueryParams: (state, { payload }) => {
			state.getListQueryParams = { ...state.getListQueryParams, ...payload }
		}
	},
	extraReducers: (builder) =>  {
		builder.addCase(fetchTasksByPage.fulfilled, (state, action: PayloadAction<TasksResp>) => {
			state.taskList = action.payload.tasks
			state.totalCount = action.payload.totalCount
		})
		builder.addCase(createTask.fulfilled, (state, action: PayloadAction<string>) => {
			state.successStatus = action.payload
		})
	}
})

export const selectTaskList = (state: RootState) => state.task.taskList
export const { changeQueryParams, editTask } = taskSlice.actions
export default taskSlice.reducer
