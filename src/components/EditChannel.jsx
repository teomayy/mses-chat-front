import React, { useEffect, useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import { UserList } from './'

import { CloseCreateChannel } from '../assets'

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
			/>
			<p>Добавить участников</p>
		</div>
	)
}
const EditChannel = ({ setIsEditing }) => {
	const { channel } = useChatContext()
	const [channelName, setChannelName] = useState(channel?.data?.name || '')
	const [selectedUsers, setSelectedUsers] = useState([])

	useEffect(() => {
		if (channel?.data?.name) {
			setChannelName(channel.data.name)
		}
	}, [channel])

	const updateChannel = async event => {
		event.preventDefault()

		const nameChanged = channelName !== (channel.data.name || channel.data.id)

		if (nameChanged) {
			await channel.update(
				{ name: channelName },
				{ text: `Название канала изменено на ${channelName}` }
			)
		}

		if (selectedUsers.length) {
			await channel.addMembers(selectedUsers)
		}

		setChannelName('')
		setIsEditing(false)
		setSelectedUsers([])
	}

	return (
		<div className='edit-channel__container'>
			<div className='edit-channel__header'>
				<p>Edit channel</p>
				<CloseCreateChannel setIsEditing={setIsEditing} />
			</div>
			<ChannelNameInput
				channelName={channelName}
				setChannelName={setChannelName}
			/>
			<UserList setSelectedUsers={setSelectedUsers} />
			<div className='edit-channel__button-wrapper'>
				<p onClick={updateChannel}>Сохранить</p>
			</div>
		</div>
	)
}

export default EditChannel
