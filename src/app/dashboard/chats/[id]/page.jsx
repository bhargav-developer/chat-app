'use client'
import { useSocketStore } from '@/lib/socketStore'
import { useUserStore } from '@/lib/userStore'
import axios from 'axios'
import { ArrowLeftCircleIcon, Link2Icon, SendHorizontalIcon, SmileIcon } from 'lucide-react'
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
      const res = await axios.get("http://localhost:4000/messages", {
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

  // 🔐 Wait until both user and User are loaded
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
            <img className="h-12 w-12" src={User.avatar} alt="" />
            <div className="bg-green-500 absolute bottom-1 right-[3px] border border-white rounded-[50%] h-3 w-3"></div>
          </div>
          <div>
            <h1>{`${User.firstName} ${User.lastName}`}</h1>
            <p className="text-gray-600">online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <h1>op</h1>
          <h1>op</h1>
          <h1>op</h1>
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
              className={`p-3 ${
                msg.from === user.id
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
      <div className="border-t p-3 gap-3 mb-2 flex border-gray-100 items-center w-full">
        <button>
          <Link2Icon />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-400 flex-1 p-2 rounded-xl"
          placeholder="Type Your Message"
        />
        <button>
          <SmileIcon />
        </button>
        <button
          className="bg-indigo-600 p-3 cursor-pointer rounded-2xl"
          onClick={sendMessage}
        >
          <SendHorizontalIcon className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default page;
