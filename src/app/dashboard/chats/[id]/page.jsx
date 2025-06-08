'use client'
import Avatar from '@/Components/Avatar'
import EmojiPickerComponent from '@/Components/EmojiPicker'
import { useSocketStore } from '@/lib/socketStore'
import { useUserStore } from '@/lib/userStore'
import axios from 'axios'
import { ArrowLeftCircleIcon, DeleteIcon, Link2Icon, SendHorizontalIcon, SmileIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

function page({ params }) {
  const { id } = React.use(params)
  const { user } = useUserStore();
  const [User, setUser] = React.useState(null)
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState([])
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const messagesEndRef = React.useRef(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const [file, setFile] = React.useState(null);
    const fileInputRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDeleteClick = () => setIsOpen(true);
  const handleConfirmDelete = async () => {
    const res = await axios.delete("http://localhost:4000/messages/deleteChat", {
      params: { from: user.id }
    })
    if (res.data) {
      setIsOpen(false);
      setMessages([])
    }

  };
  const handleCancel = () => setIsOpen(false);

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);

    }
  };

  const openFileDialog = () => {
fileInputRef.current.click();
  };

  // Scroll effect
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get messages when both users are defined
  React.useEffect(() => {
    if (user?.id && User?._id) {
      getMessages();
    }
  }, [User, user]);

  // Socket listener
  React.useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleMessage);
    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket]);

  // Fetch other user's profile
  const getUserInfo = async () => {
    try {
      const res = await axios.post("/api/profile/getSingleProfile", { userId: id });
      if (res.status === 200) {
        setUser(res.data.Users);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  React.useEffect(() => {
    getUserInfo();
  }, []);

  const getMessages = async () => {
    try {
      const res = await axios.get("http://localhost:4000/messages/getMessage", {
        params: {
          from: user.id,
          to: User._id,
        },
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (socket && message.trim()) {
      socket.emit("send-message", {
        content: message,
        from: user.id,
        to: User._id,
      });
      setMessage("");
    }
  };


  if (!user?.id || !User?._id) {
    return <div className="p-4">Loading chat...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex p-4 border-b border-gray-100 justify-between">
        <div className="flex gap-3">
          <div
            onClick={() => router.back()}
            className="flex cursor-pointer justify-center items-center"
          >
            <ArrowLeftCircleIcon className="text-indigo-500" />
          </div>
          <div className="relative">
            <Avatar avatarUrl={User.avatar} />

          </div>
          <div>
            <h1>{`${User.firstName} ${User.lastName}`}</h1>
            <p className="text-gray-600">online</p>
          </div>
        </div>
        <div className="flex gap-2 justify-between items-centers">
          <Trash2Icon className='hover:text-indigo-500 cursor-pointer' onClick={handleDeleteClick} />
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 overflow-auto pt-2 flex-1 gap-3 text-white px-4 flex-col flex">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === user.id ? "justify-end" : "justify-start"}`}
          >
            {msg.from !== user.id && (
              <img className="h-8 w-8" src={User.avatar} alt="" />
            )}
            <div
              className={`p-3 ${msg.from === user.id
                  ? "bg-blue-600 rounded-2xl rounded-tr-md"
                  : "border border-gray-200 rounded-2xl rounded-tl-md text-black"
                } max-w-xs`}
            >
              {msg.content || msg}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      

      {/* Input */}
      <div className="border-t relative p-3 gap-3 mb-2 flex border-gray-100 items-center w-full">
          <button
      type="button"
      className="cursor-pointer p-2"
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Link2Icon />
    </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-400 flex-1 p-2 rounded-xl"
          placeholder="Type Your Message"
        />
        <button className='cursor-pointer' onClick={() => setShowPicker(!showPicker)}>
          <SmileIcon />
        </button>
        <button
          className="bg-indigo-600 p-3 cursor-pointer rounded-2xl"
          onClick={sendMessage}
        >
          <SendHorizontalIcon className="text-white" />
        </button>
      </div>

 <div className='absolute bottom-0 right-0' onMouseLeave={() => setShowPicker(false)}>
         {showPicker && (
        <EmojiPickerComponent 
          onEmojiClick={(emoji) => setMessage((prev) => prev + emoji)}
        />
      )}
      </div>
     


      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this conversation?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>




  );
}

export default page;
