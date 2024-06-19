import React, { useState } from 'react'
import Modal from 'react-modal'
import { useChatContext } from 'stream-chat-react'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		borderRadius: '20px',
		transform: 'translate(-50%, -50%)',
	},
}

Modal.setAppElement('#root')

const UploadImageModal = ({ isOpen, onRequestClose }) => {
	const [selectedFile, setSelectedFile] = useState(null)
	const { client } = useChatContext()

	const handleFileChange = e => {
		setSelectedFile(e.target.files[0])
	}

	const handleSubmit = async () => {
		if (!selectedFile) return

		try {
			const response = await client.uplodImage(selectedFile)

			if (response.file) {
				await client.partialUpdateUser({
					id: client.userID,
					set: { image: response.file },
				})
				console.log('Фотография пользователя добавлен успешно')
			}
		} catch (error) {
			console.error('Ошибка при добавление фотография')
		}
		onRequestClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			style={customStyles}
			contentLabel='Загрузить изображение'
		>
			<h2>Загрузить изображение профиля</h2>
			<input
				type='file'
				style={{ display: 'none' }}
				onClick={handleFileChange}
			/>
			<label htmlFor='fileInput' className='custom-file-upload'>
				Выбрать файл
			</label>
			<button className='button-17' onClick={handleSubmit}>
				Загрузить
			</button>
			<button className='button-78' onClick={onRequestClose}>
				Выйти
			</button>
		</Modal>
	)
}

export default UploadImageModal
