import React from 'react'
import { Message, useMessageContext } from 'stream-chat-react'

const TeamMessage = () => {
	const { message } = useMessageContext
	return <Message message={{ ...message, user: {} }} />
}

export default TeamMessage
