import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { on } from "@/services/websocket/socket";
import useGameStore from "@/store/gameStore";

export default function ChatBox() {
  const room = useGameStore((state) => state.room);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const loadMessages = async () => {

        try {

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/game/messages/`,
                {
                    params: {
                        room_code: room.room_code,
                    },
                }
            );

            setMessages(res.data);

        } catch (err) {
            console.error(err);
        }

    };

    if (room?.room_code) {
        loadMessages();
    }

}, [room]);


  const messagesEndRef = useRef(null);

  const playerName = localStorage.getItem("playerName") || "";

  useEffect(() => {
    on("chat_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/game/send-message/`,
        {
          room_code: room.room_code,
          sender: playerName,
          message,
        }
      );

      setMessage("");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-3 md:mt-8 md:p-4">

      <h2 className="mb-3 text-lg font-bold md:mb-4 md:text-xl">
        💬 Chat
      </h2>

      <div className="h-48 overflow-y-auto space-y-3 md:h-60">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === playerName
                ? "text-right"
                : "text-left"
            }
          >

            <div
              className={
                msg.sender === playerName
                  ? "inline-block bg-blue-600 px-3 py-2 rounded-xl"
                  : "inline-block bg-slate-600 px-3 py-2 rounded-xl"
              }
            >
              <p className="text-xs opacity-70">
                {msg.sender}
              </p>

              <p>{msg.message}</p>

            </div>

          </div>
        ))}

        <div ref={messagesEndRef} />

      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="w-full rounded-lg bg-slate-700 p-3 sm:flex-1"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 hover:bg-blue-700 sm:w-auto"
        >
          Send
        </button>

      </div>

    </div>
  );
}