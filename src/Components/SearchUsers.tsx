"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Avatar from "@/Components/Avatar";
import { useUsersStore } from "@/lib/usersStore";
import { useSocketStore } from "@/lib/socketStore";
import { useUserStore } from "@/lib/userStore";

import { ChevronRight } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchUsersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchUsers({ isOpen, onClose }: SearchUsersProps) {
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const { user } = useUserStore();
  const { statusMap, setStatus } = useUsersStore();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET;

  /** 🔎 Search global users */
  useEffect(() => {
    if (query.length < 2) {
      setContacts([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.post("/api/profile/search-profile", { query });
        setContacts(res.data.Users);
      } catch {
        setContacts([]);
      }
      setSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  /** 💬 Fetch recent chats */
  const getRecentChats = async () => {
    try {
      const res = await axios.get(`${socketUrl}/messages/chats`, {
        params: { userId: user?.id },
      });
      setRecentChats(res.data || []);
    } catch (e) {
      console.log("Error fetching recent chats", e);
    }
  };

  useEffect(() => {
    getRecentChats();
  }, [socket, user]);

  /** 🔁 Socket listeners */
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", getRecentChats);
    socket.on("update_users", (data) => {
      Object.entries(data).forEach(([userId, status]) =>
        setStatus(userId, status)
      );
    });

    return () => {
      socket.off("receive-message", getRecentChats);
      socket.off("update_users");
    };
  }, [socket]);

  /** ➡ Handle click */
  const handleSelectUser = (id: string) => {
    onClose();
    router.push(`/dashboard/chats/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="rounded-2xl border shadow-xl bg-white w-[450px]">
          <CommandInput
            placeholder="Search by name or email..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            {searching && (
              <div className="py-3 text-center text-sm text-gray-500">
                Loading...
              </div>
            )}

            <CommandEmpty>No results found.</CommandEmpty>

            {/* 🔥 Recent chats */}
            <CommandGroup heading="Recent chats">
              {recentChats.length === 0 && !searching && (
                <div className="px-3 py-2 text-xs text-gray-400">
                  No recent chats yet.
                </div>
              )}

              {recentChats.map((chat) => (
                <CommandItem
                  key={chat.userId}
                  onSelect={() => handleSelectUser(chat.userId)}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      avatarUrl={chat.avatar}
                      isOnline={statusMap.get(chat.userId)?.online}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{chat.firstName}</span>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {chat.lastMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* 🌍 Global contacts */}
            <CommandGroup heading="Contacts">
              {contacts.map((contact) => (
                <CommandItem
                  key={contact._id}
                  onSelect={() => handleSelectUser(contact._id)}
                  className="flex items-center gap-3"
                >
                  <Avatar
                    avatarUrl={contact.avatar}
                    isOnline={statusMap.get(contact._id)?.online}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {contact.firstName || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-500">{contact.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
