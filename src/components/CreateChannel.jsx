import React, { useState } from 'react'

import { useChatContext } from 'stream-chat-react'
import { CloseCreateChannel } from '../assets/CloseCreateChannel'
import { UserList } from './'

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
	const handleChange = event => {
		event.preventDefault()

		setChannelName(event.target.value)
	}
	return (
		<div className='channel-name-input__wrapper'>
			<p>Hазвание канала</p>
			<input
				value={channelName}
				onChange={handleChange}
				placeholder='название канала'
				required
			/>
			<p>Добавить участников</p>
		</div>
	)
}

const ErrorPopup = ({ message, onClose }) => {
	return (
		<div className='error-popup'>
			<p>{message}</p>
			<button onClick={onClose}>Закрыть</button>
		</div>
	)
}

const CreateChannel = ({ createType, setIsCreating }) => {
	const { client, setActiveChannel } = useChatContext()
	const [selectedUsers, setSelectedUsers] = useState([client.userID || ''])
	const [channelName, setChannelName] = useState('')
	const [error, setError] = useState('')

	const createChannel = async e => {
		e.preventDefault()

		if (!channelName) {
			setError('Пожалуйста, введите название канала')
			return
		}

		try {
			const newChannel = await client.channel(createType, channelName, {
				name: channelName,
				members: selectedUsers,
			})

			await newChannel.watch()

			setChannelName('')
			setIsCreating(false)
			setSelectedUsers([client.userID])
			setActiveChannel(newChannel)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='create-channel___container'>
			{error && <ErrorPopup message={error} onClose={() => setError('')} />}
			<div className='create-channel__header'>
				<p>
					{createType === 'team'
						? 'Создать новый канал'
						: 'отправить личное сообщение'}
				</p>
				<CloseCreateChannel setIsCreating={setIsCreating} />
			</div>
			{createType === 'team' && (
				<ChannelNameInput
					channelName={channelName}
					setChannelName={setChannelName}
				/>
			)}
			<UserList setSelectedUsers={setSelectedUsers} />

			<div className='create-channel__button-wrapper' onClick={createChannel}>
				<p>
					{createType === 'team' ? 'Создать канал' : 'Создать группу сообщений'}
				</p>
			</div>
		</div>
	)
}

export default CreateChannel
