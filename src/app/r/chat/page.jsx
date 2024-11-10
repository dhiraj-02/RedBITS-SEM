'use client'

import React, { useEffect, useRef, useState } from 'react'
import SearchUserBar from '../../../components/chat/SearchUserBar'
import axios from 'axios'
import { formatTimeToNow } from '@/lib/utils'


const page = () => {
  
  const [list, setList] = useState([])
  const [selectChat,setSelectChat] = useState('')
  const [msgList, setMsgList] = useState([])
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(true)
  const [selectUser, setSelectUser] = useState({})
  const [curUser, setCurUser] = useState({})
  

  const selectChatRef = useRef(selectChat);

  const handleChatChange = (chat) => {
    setSelectChat(chat.id)
    selectChatRef.current = chat.id;
  }

  const fetchChatList = async () => {
    try{
      const chatList = await axios.get(`api/chat`);
      console.log(chatList.data)
      setList(chatList.data.chatList)
      setCurUser(chatList.data.myDetails)
    } catch (err){
      console.log(err)
    }
    
  }

  const fetchMessages = async () => {
    try{
      const currentChatId = selectChatRef.current;
      console.log(currentChatId)
      if(currentChatId !== ''){
        console.log('polling mid')
        const msgList = await axios.get(`api/chat/messages?id=`+currentChatId);
        setMsgList(msgList.data.messages)
        setSelectUser(msgList.data.userDetails)
      }
    } catch (err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchChatList()
  }, [selectChat])

  useEffect(() => {
    setMsgList([])
    if(selectChat != '')
      fetchMessages()
  }, [selectChat, sent])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await fetchMessages();
      console.log('polling1');
    }, 5000);
  
    return () => clearInterval(intervalId);
  }, []); 

  const handleSendMessage = async () =>{
    if(!selectChat) {
      console.log('select chat')
    }
    else{
      console.log(curUser)
      if(msg.length > 0){
        const newMsg = await axios.post('/api/chat/messages', {message: msg, chatId: selectChat, userSentId: curUser.id})
        setMsg('')
        setSent(!sent)
      }
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
  
  <div className="fixed top-20 left-0 p-4 border-b border-gray-200 bg-slate-50 w-1/5 h-20 z-10">
  <SearchUserBar chatChange={handleChatChange} />
</div>

  <div className="flex flex-1 overflow-hidden">
    <span className='top-9 left-10 font-medium text-bold'>&nbsp;&nbsp;&nbsp;&nbsp;My chats</span>
    <div className="w-80 bg-slate-50 border-r border-gray-200 flex flex-col">
      {list.length > 0 ? (
        <ul className="flex-1 overflow-y-auto">
          {list.map((chat) => (
            <li
              className={`flex items-center space-x-3 p-4 hover:bg-black hover:text-white cursor-pointer border-b border-gray-100 transition-colors space-y-2 h-14 mt-6 ${
                selectChat === chat.id ? 'bg-black rounded-lg text-white' : ''
              }`}
              key={chat.id}
              onClick={() => {
                handleChatChange(chat);
                setSelectUser(chat.userDetails);
              }}
            >
              <img
                src={chat.userDetails.image}
                alt={chat.userDetails.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              
              <span className="font-medium text-gray-800">&nbsp;{chat.userDetails.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 p-4">Search people to connect...</p>
      )}
    </div>

    {/* Messages Area */}
    
    <div className="flex-1 flex flex-col w-3/5 border-black bg-gray-300 text-black font-large rounded-lg">
      {selectChat.length > 0 ? (
        <>
          {/* Message List (Scrollable Area) */}
          <div className='items-center flex w-full mt-2 ml-40'>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <img
            src={selectUser.image}
            alt="user"
            className="w-8 h-8 rounded-full object-cover"
          /> &nbsp;
          <span>{selectUser.username}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <ul className="space-y-4">
              {msgList.map((msg) => (
                <React.Fragment key={msg.id}>
                {msg.userSentId === curUser.id ? (
                  <>
                  <li className="flex mr-4 items-end justify-end space-x-2 space-y-2 mt-2">
                    <span> &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</span>
                    <span className='max-h-40 mt-1 text-xs text-gray-500'>{formatTimeToNow(new Date(msg.timeStamp))}</span>
                  </li>
                  <li className="flex mr-4 items-end justify-end space-x-2">
                    <span> &nbsp;&nbsp;   &nbsp;&nbsp; &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;   &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</span>
                    <span className="bg-black text-white rounded-lg py-2 px-4 max-w-md break-words">
                      {msg.text}
                    </span>
                  </li>
                  </>
                ) : (
                  <>
                  <li className="flex ml-4 items-end justify-start space-x-2 space-y-2 mt-2">
                  <span>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</span>
                    <span className='max-h-40 mt-1 text-xs text-gray-500'>{formatTimeToNow(new Date(msg.timeStamp))}</span>
                  </li>
                  <li className="flex ml-4 items-end justify-start space-x-2 ">
                    <span>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</span>
                    <span className="bg-black text-white rounded-lg py-2 px-4 max-w-md break-words">
                    {msg.text} 
                    </span>
                  </li>
                  
                  </>
                )}
                </React.Fragment>
              ))}
            </ul>
          </div>

          
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white">
          Select a chat to message
        </div>
      )}
      <div className="fixed w-full bottom-0 p-4 bg-transparent border-t border-gray-200 items-end flex flex-row">
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  
            <div className="flex space-x-2 ml-10 right-0">
              <input
                type="text"
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
                placeholder="Type your message"
                className="flex-1 px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-black"
              />
              <button
                onClick={handleSendMessage}
                className="right-0 px-6 py-2 bg-black text-white rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
    </div>
  </div>
  
  </div>


  )
}

export default page