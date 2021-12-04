import { createAsyncThunk } from "@reduxjs/toolkit"

import { ITask } from './Task'
import { isLogin } from '../user/api'

export type SortFieldType = "id" | "username" | "email" | "status"

export type SortDirectionType = "asc" | "desc"

export function getStatus(status: number): string {
	switch (status) {
		case 0:
			return 'Задача не выполнена'
		case 1:
			return 'Задача не выполнена, отредактирована админом'
		case 10:
			return 'Задача выполнена'
		case 11:
			return 'Задача отредактирована админом и выполнена'
	}
	return ''
}

export interface GetListQueryParams {
	sortField?: SortFieldType,
	sortDirection?: SortDirectionType,
	pageNum?: number
}

export type TasksResp = {
	tasks: Array<ITask>,
	totalCount: number
}

export const fetchTasksByPage = createAsyncThunk(
	'task/getList',
	async (params: GetListQueryParams) => {
		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}?developer=${process.env.REACT_APP_DEVELOPER}&sort_field=${params.sortField}&sort_direction=${params.sortDirection}&page=${params.pageNum}`
		)
		const data = await resp.json()
		return {
			tasks: data.message.tasks as Array<ITask>,
			totalCount: Number(data.message.total_task_count)
		} as TasksResp
	}
)

export const createTask = createAsyncThunk(
	'task/add',
	async (task: ITask) => {
		const form = new FormData()
		form.append('username', task.username)
		form.append('email', task.email)
		form.append('text', task.text)

		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}create?developer=${process.env.REACT_APP_DEVELOPER}`,
			{
				method: "POST",
				body: form
			})

		const data = await resp.json()
		if (data.status === 'ok') {
			return `Задача (${data.message.text} успешно добавлена`
		} else {
			return false
		}
	})

export const editTask = createAsyncThunk(
	'task/edit',
	async (task: ITask) => {
		const form = new FormData()
		form.append('text', task.text)
		form.append('status', task.status.toString())
		form.append('token', isLogin())

		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}edit/${task.id}/?developer=${process.env.REACT_APP_DEVELOPER}`,
			{
				method: "POST",
				body: form
			})

		const data = await resp.json()
		if (data.status === 'ok') {
			return `Задача (${data.message.text} успешно отредактирована`
		} else {
			return false
		}
	}
)
