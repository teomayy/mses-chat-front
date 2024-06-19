import React from 'react'

import { AddChannel } from '../assets'

const TeamChannelList = ({
	children,
	error = false,
	loading,
	type,
	isCreating,
	setIsCreating,
	setCreateType,
	setIsEditing,
	setToggleContainer,
}) => {
	if (error) {
		return type === 'team' ? (
			<div className='team-channel-list'>
				<p className='team-channel-list__message'>
					Ошибка соединения, подождите немного и повторите попытку.
				</p>
			</div>
		) : null
	}

	if (loading) {
		return (
			<div className='team-channel-list'>
				<p className='team-channel-list__message loading'>
					{type === 'team' ? 'Каналы' : 'Сообщения'} загрузка...
				</p>
			</div>
		)
	}

	return (
		<div className='team-channel-list'>
			<div className='team-channel-list__header'>
				<p className='team-channel-list__header__title'>
					{type === 'team' ? 'Каналы' : 'Личное сообщение'}
				</p>
				{/* Button - add channel*/}
				<AddChannel
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
					setToggleContainer={setToggleContainer}
					type={type === 'team' ? 'team' : 'messaging'}
				/>
			</div>
			{children}
		</div>
	)
}

export default TeamChannelList
