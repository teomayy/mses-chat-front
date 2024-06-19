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
	const [otp, setOtp] = useState('')
	const [isOtpSent, setIsOtpSent] = useState(false)
	const [isVerified, setIsVerified] = useState(false)

	const switchMode = () => {
		setIsSignup(prevIsSignup => !prevIsSignup)
		setIsOtpSent(false)
		setIsVerified(false)
		setForm(initialState)
	}

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const { username, password, phoneNumber } = form

		const URL = 'http://localhost:5000/auth'

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
			console.error('Error during authentication', error)
		}
	}

	const handleSendOtp = async () => {
		try {
			const res = await axios.post('http://localhost:5000/auth/send-otp', {
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

	const handleVerifyOtp = async () => {
		try {
			const response = await axios.post(
				'http://localhost:5000/auth/verify-otp',
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

	return (
		<div className='auth__form-container'>
			<div className='auth__form-container_fields'>
				<div className='auth__form-container_fields-content'>
					<p>{isSignup ? 'Регистрация' : 'Войти'}</p>
					<form onSubmit={handleSubmit}>
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
							</>
						)}
					</form>
					<div className='auth__form-container_fields-account'>
						<p>
							{isSignup ? 'Уже есть аккаунт?' : 'У вас нет учетной записи?'}
							<span onClick={switchMode}>
								{isSignup ? 'Войти' : 'Регистрация'}
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className='auth__form-container_image'>
				<img src={signinImage} alt='sign in' />
			</div>
		</div>
	)
}

export default Auth
