import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ContactsContainer from './contacts-container/Contacts'
import EmptyChatContainer from './empty-chat-container/EmptyChat'
import ChatContainer from './chat-container/ChatContainer'

const Chat = () => {
    const { userInfo, selectedChatType } = useAppStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup Profile to continue.")
            navigate("/profile")
        }
    }, [userInfo, navigate])

    return (
        <div className='flex h-[100vh] text-white overflow-hidden'>
            <ContactsContainer />
            {
                selectedChatType === undefined ? (
                    <EmptyChatContainer />
                ) : (
                    <ChatContainer />
                )
            }
        </div>
    )
}

export default Chat