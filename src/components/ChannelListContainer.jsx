import React, { useState } from 'react'
import { ChannelList, useChatContext } from 'stream-chat-react'
import Cookies from 'universal-cookie'
import HospitalIcon from '../assets/hospital.png'
import LogoutIcon from '../assets/logout.png'
import SettingsIcon from '../assets/settings.svg'
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './'
import UploadImageModal from './UploadImageModal' // импортируем модальное окно

const cookies = new Cookies()

const SideBar = ({ logout, openSettings }) => (
	<div className='channel-list__sidebar'>
		<div className='channel-list__sidebar__icon1'>
			<div className='icon1__inner'>
				<img src={HospitalIcon} alt='Hospital' width='30' />
			</div>
		</div>

		<div className='channel-list__sidebar__icon2'>
			<div className='icon1__inner' onClick={logout}>
				<img src={LogoutIcon} alt='Logout' width='30' />
			</div>
		</div>
		<div className='channel-list__sidebar__icon3'>
			<div className='icon1__inner' onClick={openSettings}>
				<img src={SettingsIcon} alt='Settings' width='40' />
			</div>
		</div>
	</div>
)

const CompanyHeader = () => (
	<div className='channel-list__header'>
		<p className='channel-list__header__text'>Мсэс чат</p>
	</div>
)

const customChannelTeamFilter = channels => {
	return channels.filter(channel => channel.type === 'team')
}

const customChannelMessagingFilter = channels => {
	return channels.filter(channel => channel.type === 'messaging')
}

const ChannelListContent = ({
	isCreating,
	setIsCreating,
	setCreateType,
	setIsEditing,
	setToggleContainer,
	openSettings, // добавляем openSettings сюда
}) => {
	const { client } = useChatContext()

	const logout = () => {
		cookies.remove('token')
		cookies.remove('userId')
		cookies.remove('username')
		cookies.remove('hashedPassword')
		cookies.remove('phoneNumber')

		window.location.reload()
	}

	const filters = { members: { $in: [client.userID] } }

	return (
		<>
			<SideBar logout={logout} openSettings={openSettings} />
			<div className='channel-list__list__wrapper'>
				<CompanyHeader />
				<ChannelSearch setToggleContainer={setToggleContainer} />
				<ChannelList
					filters={filters}
					channelRenderFilterFn={customChannelTeamFilter}
					List={listProps => (
						<TeamChannelList
							{...listProps}
							type='team'
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setCreateType={setCreateType}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={previewProps => (
						<TeamChannelPreview
							{...previewProps}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
							type='team'
						/>
					)}
				/>

				<ChannelList
					filters={filters}
					channelRenderFilterFn={customChannelMessagingFilter}
					List={listProps => (
						<TeamChannelList
							{...listProps}
							type='messaging'
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setCreateType={setCreateType}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={previewProps => (
						<TeamChannelPreview
							{...previewProps}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
							type='messaging'
						/>
					)}
				/>
			</div>
		</>
	)
}

const ChannelListContainer = ({
	setCreateType,
	setIsCreating,
	setIsEditing,
}) => {
	const [toggleContainer, setToggleContainer] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false) // состояние для модального окна

	return (
		<>
			<div className='channel-list__container'>
				<ChannelListContent
					isCreating={false}
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
					setToggleContainer={setToggleContainer}
					openSettings={() => setIsSettingsOpen(true)} // передаем функцию открытия модального окна
				/>
			</div>

			<div
				className='channel-list__container-responsive'
				style={{
					left: toggleContainer ? '0%' : '-89%',
					backgroundColor: '#005fff',
				}}
			>
				<div
					className='channel-list__container-toggle'
					onClick={() =>
						setToggleContainer(prevToggleContainer => !prevToggleContainer)
					}
				></div>
				<ChannelListContent
					isCreating={false}
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
					setToggleContainer={setToggleContainer}
					openSettings={() => setIsSettingsOpen(true)} // передаем функцию открытия модального окна
				/>
			</div>

			<UploadImageModal
				isOpen={isSettingsOpen}
				onRequestClose={() => setIsSettingsOpen(false)}
			/>
		</>
	)
}

export default ChannelListContainer
