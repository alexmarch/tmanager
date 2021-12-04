import React, { FormEvent, useState } from "react"
import { RootState, store } from "../../../app/store"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { loginUser, isLogin } from "../api"

function LoginForm({ ...props }) {
	let navigator = useNavigate()

	const [user, setValue] = useState({
		username: '',
		password: '',
		usernameValid: false,
		passwordValid: false,
		validationError: ""
	})
	const validateField = (name: string, value: string) => {
		let validationError: string = ''
		switch (name) {
			case "username":
				if (value.trim() !== '' && value.length >= 4) {
					setValue({ ...user, usernameValid: true, validationError })
				} else {
					validationError = 'Ошибка: поле "имя пользователя" обязатело для заполнения'
					setValue({ ...user, usernameValid: false, validationError })
				}
				break
			case "password":
				if (value.trim() !== '' && value.length >= 3) {
					setValue({ ...user, passwordValid: true, validationError })
				} else {
					validationError = 'Ошибка: поле "имя пользователя" обязатело для заполнения'
					setValue({ ...user, passwordValid: false, validationError })
				}
				break
		}
	}

	const submitForm = async (e: FormEvent) => {
		e.preventDefault()

		const isFormValid = user.usernameValid && user.passwordValid

		if (!isFormValid) {
			return;
		}

		await store.dispatch(loginUser({ user }))

		if ( props.isLogIn() ) {
			navigator('/')
		}
	}

	return <div className="form-container">
		<form onSubmit={(e) => submitForm(e)} className="create-task-form">
			<h1>Авторизация</h1>
			<p className="error-message">{ props.validationError }</p>
			<p className="error-message">{ user.validationError }</p>
			<div className="form-control">
				<input type="text"
					value={user.username}
					onBlur={(e) => validateField(e.target.name, e.target.value)}
					onChange={(e) => setValue({ ...user, username: e.target.value })}
					name="username"
					placeholder="Имя пользователя" />
				<div className="form-control">
					<input type="password"
						value={user.password}
						onBlur={(e) => validateField(e.target.name, e.target.value)}
						onChange={(e) => setValue({ ...user, password: e.target.value })}
						name="password"
						placeholder="Пароль" />
				</div>
				<div className="form-control">
					<button type="submit" className="submit">Войти</button>
				</div>
			</div>
		</form>
	</div>
}

export default connect((state: RootState) => ({
	validationError: state.user.validationError,
	isLogIn: () => isLogin()
}))(LoginForm)
