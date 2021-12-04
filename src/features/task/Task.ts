export interface ITask {
	id?: number
	username: string
	email: string
	text: string
	status: number
}

export class Task implements ITask {
	username: string = ''
	email: string = ''
	text: string = ''
	status: number = 0
}
