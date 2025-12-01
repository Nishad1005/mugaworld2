"use client";

import { useState } from "react";

type ChatMessage = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 0,
  sender: "bot",
  text: "Namaskar! I'm Muga Rhino 🦏✨ How may I assist you today?",
};

export default function MugaMascotAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    // 🔁 TEMP: fake reply. Later we’ll replace with real AI API.
    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: `You said: "${text}". Soon I’ll be a fully smart assistant for Muga World 🚀`,
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, 800);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating mascot */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 cursor-pointer outline-none"
      >
        <img
          src="/muga-mascot-mirrored.png"
          alt="Muga Rhino Assistant"
          className="h-40 w-auto drop-shadow-xl transition-transform duration-300 hover:scale-110 animate-muga-float"
        />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/95">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-orange-600 px-3 py-2 text-white dark:border-slate-700">
            <img
              src="/muga-mascot.png"
              alt="Muga Rhino"
              className="h-8 w-8 rounded-full border border-white/40"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Muga Rhino</span>
              <span className="text-[11px] text-orange-100">
                Online · Your brand assistant
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto text-xs text-orange-100 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="max-h-80 space-y-2 overflow-y-auto px-3 py-3 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-snug ${
                    m.sender === "user"
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                Muga Rhino is thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Muga World..."
              className="h-8 flex-1 rounded-full border border-slate-200 px-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900"
            />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                className="h-8 rounded-full bg-orange-600 px-3 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                Send
              </button>
          </div>
        </div>
      )}
    </>
  );
}
