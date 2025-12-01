"use client";

import { useState } from "react";

type ChatMessage = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export default function MugaMascotAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: "bot",
      text: "Namaskar! 🦏 I'm Muga Rhino — ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [mood, setMood] = useState<"idle" | "hover" | "thinking" | "happy">(
    "idle"
  );

  // Toggle open/close
  const toggleChat = () => {
    setOpen((o) => !o);
    setMood("happy");
    setTimeout(() => setMood("idle"), 800);
  };

  // Send message
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text },
    ]);
    setInput("");
    setThinking(true);
    setMood("thinking");

    // TEMP fake reply — later replaced with real AI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `You said: "${text}". I’m learning to respond intelligently!`,
        },
      ]);

      setThinking(false);
      setMood("happy");

      setTimeout(() => setMood("idle"), 1000);
    }, 900);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") handleSend();
  };

  // Mascot animation logic
  const mascotClass =
    mood === "thinking"
      ? "animate-wiggle"
      : mood === "happy"
      ? "scale-110"
      : "animate-mascotFloat";

  return (
    <>
      {/* Floating Mascot */}
      <div
        className="fixed bottom-5 right-5 z-50 cursor-pointer group"
        onClick={toggleChat}
        onMouseEnter={() => setMood("hover")}
        onMouseLeave={() => setMood("idle")}
      >
        {/* Hi Bubble */}
        <div
          className="absolute bottom-40 right-0 opacity-0 group-hover:opacity-100
                     bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow-lg
                     transition-opacity duration-300"
        >
          👋 Hi there!
        </div>

        <img
          src="/muga-mascot.png"
          alt="Muga Rhino Assistant"
          className={`
            h-40 drop-shadow-xl transition-all duration-300 
            hover:scale-110 hover:-rotate-3 active:scale-95
            transform -scale-x-100
            ${mascotClass}
          `}
        />
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 rounded-2xl overflow-hidden
                        bg-white/95 shadow-2xl border border-slate-200
                        backdrop-blur-lg dark:bg-slate-900/95 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white">
            <img src="/muga-mascot.png" className="h-7 w-7 rounded-full" />
            <span className="font-semibold">Muga Rhino</span>
            <button className="ml-auto text-sm" onClick={toggleChat}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 max-w-[70%] rounded-xl ${
                    m.sender === "user"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 dark:text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Thinking animation */}
            {thinking && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="h-2 w-2 bg-orange-600 rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-orange-600 rounded-full animate-bounce delay-100"></span>
                <span className="h-2 w-2 bg-orange-600 rounded-full animate-bounce delay-200"></span>
                Thinking…
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex border-t border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 text-sm outline-none dark:bg-slate-900"
            />
            <button
              onClick={handleSend}
              className="px-4 bg-orange-600 text-white text-sm font-semibold active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
