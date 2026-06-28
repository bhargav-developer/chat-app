'use client'
import Avatar from '@/Components/Avatar'
import EmojiPickerComponent from '@/Components/EmojiPicker'
import FileUpload from '@/Components/FileUpload'
import { fileTransferStore } from '@/lib/fileTransferStore'
import { useSocketStore } from '@/lib/socketStore'
import { useUsersStore } from '@/lib/usersStore'
import { useUserStore } from '@/lib/userStore'
import axios from 'axios'
import { ArrowLeftCircleIcon, DeleteIcon, Link2Icon, SendHorizontalIcon, SmileIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import toast from 'react-hot-toast'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function page({ params }) {
  const { id } = React.use(params)
  const { user } = useUserStore();
  const [User, setUser] = React.useState(null)
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState([])
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const messagesEndRef = React.useRef(null);
  const [showPicker, setShowPicker] = React.useState(false);;
  const { upload, setUpload } = fileTransferStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const { statusMap, setStatus } = useUsersStore();
  const { setRoomId } = fileTransferStore();
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;


  const handleDeleteClick = () => setIsOpen(true);
  const handleConfirmDelete = async () => {
    const res = await axios.delete(`${socketUrl}/messages/deleteChat`, {
      params: { from: user.id }
    })
    if (res.data) {
      setIsOpen(false);
      setMessages([])
    }

  };

  const formatDateGroup = (timestamp) => {
    if (!timestamp) return
    console.log(timestamp)
    const now = new Date();
    const input = new Date(timestamp);

    // Set all to midnight for
    //  comparison
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDay = new Date(input.setHours(0, 0, 0, 0));

    if (inputDay.getTime() === today.getTime()) {
      return "Today";
    } else if (inputDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return input.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
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

  // React.useEffect(() => {
  //   console.log(statusMap)
  // }, [statusMap])
  // Socket listener
  React.useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };



    socket.on("update_users", (data) => {
      Object.entries(data).forEach(([userId, statusData]) => {
        setStatus(userId, statusData);
      });
    });



    socket.on("file-transfer-start", (roomId) => {
      if (upload) return
      setUpload(true)
      setRoomId(roomId.roomId)
    })

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

  const handleFileSender = async () => {
    try {
      const checkReciverIsOnline = statusMap.get(User._id)?.online
      if (!checkReciverIsOnline) {
        toast.error(User ? `${User.firstName} ${User.lastName} is not online` : "User is not online")
        return
      }
      const res = socket.emit("sender-file-transfer-req", {
        senderId: user.id,
        receiverId: User._id,
        name: user.name
      })
      toast.success(User ? `sent file request to ${User.firstName} ${User.lastName}` : "sent file request")
    } catch (err) {
      console.log(err)
    }
  }



  function formatAMPM(data) {
    const date = new Date(data)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert from 24-hour to 12-hour
    hours = hours % 12;
    hours = hours ? hours : 12;

    // Pad minutes
    minutes = String(minutes).padStart(2, '0');

    return `${hours}:${minutes} ${ampm}`;
  }


  const getMessages = async () => {
    try {
      const res = await axios.get(`${socketUrl}/messages/getMessage`, {
        params: {
          from: user.id,
          to: User._id,
        },
      });
      console.log("socketUrl: ", socketUrl)
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
      {/* Header */}
      <div className="flex p-2 sm:p-4 border-b border-gray-200 justify-between items-center">
        <div className="flex gap-2 sm:gap-3 items-center min-w-0">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer justify-center items-center"
          >
            <ArrowLeftCircleIcon className="text-indigo-500 w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <div className="relative">
            <Avatar avatarUrl={User.avatar} className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="truncate">
            <h1 className="font-semibold text-sm sm:text-base truncate">
              {`${User.firstName} ${User.lastName}`}
            </h1>

            {statusMap.get(User._id)?.online ? (
              <span className="text-green-500 text-xs sm:text-sm mt-1">● Online</span>
            ) : (
              <span className="text-gray-500 text-xs sm:text-sm mt-1">
                lastSeen: {formatDateGroup(statusMap.get(User._id)?.lastSeen)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Trash2Icon
            className="hover:text-indigo-500 cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
            onClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 overflow-auto pt-2 flex-1 gap-3 text-white px-2 sm:px-4 flex flex-col">
        {messages.map((msg, index) => (
          <div key={index}>
            <div
              className={`flex ${msg.from === user.id ? "justify-end" : "justify-start"
                }`}
            >
              {msg.from !== user.id && (
                <img
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                  src={User.avatar}
                  alt=""
                />
              )}

              <div
                className={`p-2 sm:p-3 ${msg.from === user.id
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-md"
                  : "border border-gray-400 text-black rounded-2xl rounded-tl-md"
                  } max-w-[80%] sm:max-w-xs break-words`}
              >
                {msg.content || msg}
              </div>
            </div>

            <p
              className={`text-gray-500 text-[10px] sm:text-xs ${msg.from === user.id
                ? "text-right"
                : "text-left ml-10"
                }`}
            >
              {formatAMPM(msg.timeStamp)}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="border-transparent cursor-pointer bg-white p-2 sm:p-3 gap-2 flex items-center w-full">
          <HoverCard>
            <HoverCardTrigger>    <Link2Icon className="" onClick={handleFileSender} /></HoverCardTrigger>
            <HoverCardContent>
              Share Files in real time with {User && User.firstName}
            </HoverCardContent>
          </HoverCard>


        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-400 flex-1 sm:w-[100%] p-2 rounded-xl text-sm"
          placeholder="Type your message..."
        />

        <button className="cursor-pointer hidden sm:block p-2" onClick={() => setShowPicker(!showPicker)}>
          <SmileIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          className="bg-indigo-600 p-2 sm:p-3 rounded-xl cursor-pointer"
          onClick={sendMessage}
        >
          <SendHorizontalIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {upload && <FileUpload onClose={() => { setUpload(false) }} reciverId={User._id} />}

      {/* Emoji Picker */}
      <div
        className="absolute bottom-14 right-2 sm:bottom-16 sm:right-4 z-50"
        onMouseLeave={() => setShowPicker(false)}
      >
        {showPicker && (
          <EmojiPickerComponent
            onEmojiClick={(emoji) => setMessage((prev) => prev + emoji)}
          />
        )}
      </div>
    </div>
  );

}

export default page;
