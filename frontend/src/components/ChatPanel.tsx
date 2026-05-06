import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Source {
  _id: string;
  title: string;
  type: string;
  link: string;
  score: number;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I am your Second Brain AI. Ask me anything about your saved content — notes, documents, videos, or links.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: userMessage.content });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={onClose}
      />

      {/* panel */}
      <div className="fixed z-50 flex flex-col bg-white shadow-2xl border border-gray-200 inset-x-0 bottom-0 top-16 rounded-t-2xl md:inset-auto md:bottom-6 md:right-6 md:top-auto md:w-96 md:h-[600px] md:rounded-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-purple-600 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg
                className="size-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Brain AI</p>
              <p className="text-xs text-white/70">
                Powered by your saved content
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              {/* label */}
              <p className="text-xs text-gray-400 px-1">
                {msg.role === "user" ? "You" : "Brain AI"}
              </p>

              {/* bubble */}
              <div
                className={`
                  max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200"
                  }
                `}
              >
                {msg.content}
              </div>

              {/* sources */}
              {msg.role === "assistant" &&
                msg.sources &&
                msg.sources.length > 0 && (
                  <div className="max-w-[85%] flex flex-col gap-1">
                    <p className="text-xs text-gray-400 px-1">Sources:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.slice(0, 3).map((source) => (
                        <div
                          key={source._id}
                          className="flex items-center gap-1 bg-purple-300 text-purple-600 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          <span>{typeIcon(source.type)}</span>
                          <span className="max-w-[100px] truncate">
                            {source.title}
                          </span>
                          <span className="opacity-60">
                            {Math.round(source.score * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}

          {/* loading dots */}
          {loading && (
            <div className="flex items-start">
              <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  <span
                    className="size-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* suggested questions — only show when just welcome message */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
            {[
              "Summarize my notes",
              "What do I know about AI?",
              "Show my recent saves",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-purple-300 text-purple-600 bg-purple-300 hover:bg-purple-400 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <div className="px-4 py-3 border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your saved content..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0 size-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1.5">
            Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
};

function typeIcon(type: string): string {
  switch (type) {
    case "youtube":
      return "▶";
    case "tweet":
      return "𝕏";
    case "document":
      return "📄";
    case "link":
      return "🔗";
    case "post":
      return "📝";
    default:
      return "📌";
  }
}

export default ChatPanel;
