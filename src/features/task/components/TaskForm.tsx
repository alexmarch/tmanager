import React, { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"

import { RootState, store } from "../../../app/store"
import { createTask, editTask } from "../api"
import { ITask, Task } from "../Task"

const defaultState = {
	username: '',
	email: '',
	text: '',
	emailValid: false,
	usernameValid: false,
	textValid: false,
	validationError: ""
}
function getStatus(task: ITask, status: number): boolean {
	return task.status === status ? true : false
}

function TaskForm({ ...props }) {
	let navigator = useNavigate()
	const [task, setValue] = useState({ ...defaultState, ...props.editTask })

	const validateField = (name: string, value: string) => {
		let validationError: string = ''
		switch (name) {
			case "email":
				if (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
					setValue({ ...task, emailValid: true, validationError })
				} else {
					validationError = 'Ошибка: email не валидный'
					setValue({ ...task, emailValid: false, validationError })
				}
				break;
			case "username":
				if (value.trim() !== '' && value.length >= 4) {
					setValue({ ...task, usernameValid: true, validationError })
				} else {
					validationError = 'Ошибка: поле "имя пользователя" обязатело для заполнения'
					setValue({ ...task, usernameValid: false, validationError })
				}
				break
			case "text": {
				if (value.trim() !== '') {
					setValue({ ...task, textValid: true, validationError })
				} else {
					validationError = 'Ошибка: поле "Текст задачи" обязатело для заполнения'
					setValue({ ...task, textValid: false, validationError })
				}
				break
			}
		}
	}

	const submitForm = async (e: FormEvent) => {
		e.preventDefault()

		const isFormValid = task.emailValid && task.usernameValid && task.textValid

		if (!isFormValid) {
			return;
		}

		if (task.id) {
			await store.dispatch(editTask(task))
			console.log(task)
			navigator('/');
			return
		}

		await store.dispatch(createTask(task))
		navigator('/');
	}
	return (<div className="form-container">
		<form onSubmit={(e) => submitForm(e)} className="create-task-form">
			<h1>Новая задача</h1>
			<p className="error-message">{task.validationError}</p>
			<div className="form-control">
				<input type="text" value={task.username} onBlur={(e) => validateField(e.target.name, e.target.value)} onChange={(e) => setValue({ ...task, username: e.target.value })} name="username" placeholder="Имя пользователя" />
				<div className="form-control">
					<input type="email" value={task.email} onBlur={(e) => validateField(e.target.name, e.target.value)} onChange={(e) => setValue({ ...task, email: e.target.value })} name="email" placeholder="E-mail" />
				</div>
				<div className="form-control">
					<textarea rows={10} value={task.text} onBlur={(e) => validateField(e.target.name, e.target.value)} onChange={(e) => setValue({ ...task, text: e.target.value })} name="text" placeholder="Текст задачи" />
				</div>
				<div className="form-control">
					<select onChange={(e) => setValue({ ...task, status: e.target.value })} >
						<option value="0" selected={getStatus(task, 0)}>Задача не выполнена</option>
						<option value="1" selected={getStatus(task, 1)}>Задача не выполнена, отредактирована админом</option>
						<option value="10" selected={getStatus(task, 10)}>Задача выполнена</option>
						<option value="11" selected={getStatus(task, 11)}>Задача отредактирована админом и выполнена</option>
					</select>
				</div>
				<div className="form-control">
					<button type="submit" className="submit">Сохранить</button>
				</div>
			</div>
		</form>
	</div>)
}

export default connect((state: RootState) => ({
	editTask: state.task.editTask
}))(TaskForm)
