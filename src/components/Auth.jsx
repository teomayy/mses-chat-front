import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import signinImage from '../assets/signup.jpg'
import CustomPhoneInput from './CustomPhoneInput'

const cookies = new Cookies()

const initialState = {
	username: '',
	password: '',
	phoneNumber: '',
}

const Auth = () => {
	const [form, setForm] = useState(initialState)
	const [isSignup, setIsSignup] = useState(false)
	const [isResetPassword, setIsResetPassword] = useState(false)
	const [otp, setOtp] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [isOtpSent, setIsOtpSent] = useState(false)
	const [isVerified, setIsVerified] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const switchMode = () => {
		setIsSignup(prevIsSignup => !prevIsSignup)
		setIsResetPassword(false)
		setIsOtpSent(false)
		setIsVerified(false)
		setForm(initialState)
		setErrorMessage('')
	}

	const switchToResetPassword = () => {
		setIsResetPassword(true)
		setIsSignup(false)
		setIsOtpSent(false)
		setIsVerified(false)
		setForm(initialState)
		setErrorMessage('')
	}

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const { username, password, phoneNumber } = form

		const URL = 'https://mses-chat.uz:8444:/auth'

		try {
			const response = await axios.post(
				`${URL}/${isSignup ? 'signup' : 'login'}`,
				{
					username,
					password,
					phoneNumber,
				}
			)

			const { token, userId, hashedPassword } = response.data

			cookies.set('token', token)
			cookies.set('username', username)
			cookies.set('userId', userId)

			if (isSignup) {
				cookies.set('phoneNumber', phoneNumber)
				cookies.set('hashedPassword', hashedPassword)
			}

			window.location.reload()
		} catch (error) {
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data.message)
			} else {
				console.error('Error during authentication', error)
			}
		}
	}

	const handleSendOtp = async () => {
		try {
			const res = await axios.post('https://mses-chat.uz:8444/auth/send-otp', {
				phoneNumber: form.phoneNumber,
			})

			if (res.data.success) {
				setIsOtpSent(true)
				alert('OTP sent!')
			}
		} catch (error) {
			console.error('Error sending OTP', error)
		}
	}

	const handleSendResetOtp = async () => {
		try {
			const res = await axios.post(
				'https://mses-chat.uz:8444/auth/send-reset-otp',
				{
					phoneNumber: form.phoneNumber,
				}
			)

			if (res.data.success) {
				setIsOtpSent(true)
				alert('OTP sent!')
			}
		} catch (error) {
			console.error('Error sending OTP', error)
		}
	}

	const handleVerifyOtp = async () => {
		try {
			const response = await axios.post(
				'https://mses-chat.uz:8444/auth/verify-otp',
				{
					phoneNumber: form.phoneNumber,
					otp,
				}
			)

			if (response.data.success) {
				setIsVerified(true)
			} else {
				alert('Invalid OTP')
			}
		} catch (error) {
			console.error('Error verifying OTP', error)
		}
	}

	const handleResetPassword = async () => {
		try {
			const response = await axios.post(
				'https://mses-chat.uz:8444/auth/reset-password',
				{
					phoneNumber: form.phoneNumber,
					otp,
					newPassword,
				}
			)

			if (response.data.success) {
				alert('Password reset successful')
				window.location.reload()
			} else {
				alert('Invalid OTP')
			}
		} catch (error) {
			console.error('Error resetting password', error)
		}
	}

	return (
		<div className='auth__form-container'>
			<div className='auth__form-container_fields'>
				<div className='auth__form-container_fields-content'>
					<p>
						{isSignup
							? 'Регистрация'
							: isResetPassword
							? 'Сброс пароля'
							: 'Войти'}
					</p>
					<form onSubmit={handleSubmit}>
						{errorMessage && (
							<div className='error-message'>{errorMessage}</div>
						)}
						{isSignup && !isVerified ? (
							<>
								{!isOtpSent ? (
									<div className='auth__form-container_fields-content_input'>
										<label htmlFor='phoneNumber'>Номер телефона</label>
										<CustomPhoneInput
											value={form.phoneNumber}
											onChange={phone =>
												setForm({ ...form, phoneNumber: phone })
											}
										/>
										<div className='auth__form-container_fields-content_button'>
											<button type='button' onClick={handleSendOtp}>
												Отправить код
											</button>
										</div>
									</div>
								) : (
									<div className='auth__form-container_fields-content_input'>
										<label htmlFor='otp'>Код подтверждение</label>
										<input
											type='text'
											id='otp'
											value={otp}
											onChange={e => setOtp(e.target.value)}
										/>
										<div className='auth__form-container_fields-content_button'>
											<button type='button' onClick={handleVerifyOtp}>
												Подтвердить
											</button>
										</div>
									</div>
								)}
							</>
						) : isResetPassword ? (
							<>
								{!isOtpSent ? (
									<div className='auth__form-container_fields-content_input'>
										<label htmlFor='phoneNumber'>Номер телефона</label>
										<CustomPhoneInput
											value={form.phoneNumber}
											onChange={phone =>
												setForm({ ...form, phoneNumber: phone })
											}
										/>
										<div className='auth__form-container_fields-content_button'>
											<button type='button' onClick={handleSendResetOtp}>
												Отправить код
											</button>
										</div>
									</div>
								) : (
									<>
										<div className='auth__form-container_fields-content_input'>
											<label htmlFor='otp'>Код подтверждение</label>
											<input
												type='text'
												id='otp'
												value={otp}
												onChange={e => setOtp(e.target.value)}
											/>
										</div>
										<div className='auth__form-container_fields-content_input'>
											<label htmlFor='newPassword'>Новый пароль</label>
											<input
												type='password'
												id='newPassword'
												value={newPassword}
												onChange={e => setNewPassword(e.target.value)}
											/>
										</div>
										<div className='auth__form-container_fields-content_button'>
											<button type='button' onClick={handleResetPassword}>
												Сбросить пароль
											</button>
										</div>
									</>
								)}
							</>
						) : (
							<>
								<div className='auth__form-container_fields-content_input'>
									<label htmlFor='username'>Имя пользователя</label>
									<input
										type='text'
										id='username'
										name='username'
										value={form.username}
										onChange={handleChange}
									/>
								</div>
								<div className='auth__form-container_fields-content_input'>
									<label htmlFor='password'>Пароль</label>
									<input
										type='password'
										id='password'
										name='password'
										value={form.password}
										onChange={handleChange}
									/>
								</div>
								<div className='auth__form-container_fields-content_button'>
									<button type='submit'>
										{isSignup ? 'Регистрация' : 'Войти'}
									</button>
								</div>
								<div className='auth__form-container_fields-account'>
									<p>
										{isSignup
											? 'Уже есть аккаунт?'
											: 'У вас нет учетной записи?'}
										<span onClick={switchMode}>
											{isSignup ? 'Войти' : 'Регистрация'}
										</span>
									</p>
								</div>
								<div className='forgot_password-content'>
									{!isSignup && (
										<p>
											<span
												className='forgot_password'
												onClick={switchToResetPassword}
											>
												Забыли пароль?
											</span>
										</p>
									)}
								</div>
							</>
						)}
					</form>
				</div>
			</div>
			<div className='auth__form-container_image'>
				<img src={signinImage} alt='sign in' />
			</div>
		</div>
	)
}

export default Auth
