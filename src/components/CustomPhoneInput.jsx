import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import uzbekistanFlag from '../assets/uzb_flag.png' // Ensure you have an image of the Uzbekistan flag in your assets

const CustomPhoneInput = ({ value, onChange }) => {
	return (
		<div className='phone-input-container'>
			<PhoneInput
				country={'uz'}
				value={value}
				onChange={onChange}
				inputStyle={{ width: '100%', paddingLeft: '50px' }}
				buttonStyle={{ display: 'none' }}
				containerStyle={{ display: 'flex', alignItems: 'center' }}
				dropdownStyle={{ height: '0' }}
				disableDropdown={true}
			/>
			<img
				src={uzbekistanFlag}
				alt='Uzbekistan Flag'
				className='uzbekistan-flag'
			/>
		</div>
	)
}

export default CustomPhoneInput
