import { useSocket } from '@/context/socketContext'
import { useAppStore } from '@/store'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'

const MessageBar = () => {
    const emojiRef = useRef()
    const socket = useSocket()
    const [message, setMessage] = useState("")
    const [emojiPickerOpen, setemojiPickerOpen] = useState(false)
    const { selectedChatType, selectedChatData, userInfo } = useAppStore()

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setemojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = () => {
        if (!socket) {
            console.error("Socket is not initialized");
            return;
        }

        if (selectedChatType === "contact") {
            console.log("Sending message...", socket);
            socket.emit("sentMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        }
    }

    return (
        <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 '>
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input type='text' placeholder='Enter message' className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' value={message} onChange={e => setMessage(e.target.value)} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '  >
                    <GrAttachment className='text-2xl' />
                </button>
                <div className="relative">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
                        onClick={() => setemojiPickerOpen(true)}>
                        <RiEmojiStickerLine className='text-2xl' />
                    </button>
                    <div className='absolute bottom-16 right-0' ref={emojiRef} >
                        <EmojiPicker theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all '
                onClick={handleSendMessage}>
                <IoSend className='text-2xl' />
            </button>
        </div>
    )
}

export default MessageBar