import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { Send, User, MessageSquare, ArrowLeft, Check, Loader2, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PAGE_SIZE = 20;

// ─── Message Bubble (memoized to avoid re-renders) ────────────────────────────

const MessageBubble = memo(({ msg, isMe }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
  >
    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
      isMe
        ? "bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-200"
        : "bg-gray-100 text-gray-900 rounded-tl-none"
    }`}>
      {!isMe && (
        <p className="text-[10px] font-bold opacity-60 mb-0.5">{msg.sender_name}</p>
      )}
      <p className="text-sm leading-relaxed">{msg.text}</p>
      <div className={`flex items-center mt-1 opacity-50 text-[9px] ${isMe ? "justify-end" : "justify-start"}`}>
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        {isMe && <Check size={10} className="ml-1" />}
      </div>
    </div>
  </motion.div>
));
MessageBubble.displayName = "MessageBubble";

// ─── Main Chat Component ──────────────────────────────────────────────────────

const Chat = ({ initialRoomId, initialRecipientName }) => {
  const { token, userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeRoom, setActiveRoom] = useState(initialRoomId || null);
  const [recipientName, setRecipientName] = useState(initialRecipientName || null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollRef = useRef(null);
  const activeRoomRef = useRef(null);

  // ── Fetch conversations ─────────────────────────────────────────────────────
  const fetchConversations = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoadingConversations(true);
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { if (!silent) setLoadingConversations(false); }
  }, [token]);

  // ── Load messages (paginated) ───────────────────────────────────────────────
  const fetchMessages = useCallback(async (roomId, pageNum, prepend = false, silent = false) => {
    if (!token) return;
    if (!silent) {
      prepend ? setLoadingMore(true) : setLoadingMessages(true);
    }
    try {
      const res = await fetch(`${API_BASE}/api/messages/${roomId}?page=${pageNum}&limit=${PAGE_SIZE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasMore(data.length === PAGE_SIZE);
      if (prepend) {
        setMessages(prev => [...data, ...prev]);
        // Maintain scroll position after prepend
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight * 0.2;
          }
        }, 50);
      } else {
        setMessages(data);
        setTimeout(() => {
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 50);
      }
    } catch (err) { console.error(err); }
    finally { 
      if (!silent) {
        prepend ? setLoadingMore(false) : setLoadingMessages(false); 
      }
    }
  }, [token]);

  // ── Load more (scroll up) ───────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (!activeRoom || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMessages(activeRoom, nextPage, true);
  }, [activeRoom, loadingMore, hasMore, page, fetchMessages]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRoom) return;
    setSending(true);
    try {
      const ids = activeRoom.split("_").map(Number);
      const receiverId = ids.find(id => id !== userId);
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: receiverId,
          message_text: inputText.trim()
        })
      });
      if (res.ok) {
        setInputText("");
        await fetchMessages(activeRoom, 0);
        await fetchConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }, [inputText, activeRoom, token, userId, fetchMessages, fetchConversations]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }, [sendMessage]);

  const openRoom = useCallback((roomId, name) => {
    setActiveRoom(roomId);
    setRecipientName(name);
  }, []);

  // ── Keep activeRoom in ref so handler always has fresh value ────────────────
  useEffect(() => { activeRoomRef.current = activeRoom; }, [activeRoom]);

  // ── REST Polling setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeRoom) return;
    fetchMessages(activeRoom, 0);
    const interval = setInterval(() => {
      fetchMessages(activeRoom, 0, false, true);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRoom, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!activeRoom) return;
    setPage(0);
    setMessages([]);
    fetchMessages(activeRoom, 0);
  }, [activeRoom, fetchMessages]);

  // ── Conversation list ───────────────────────────────────────────────────────
  const renderConversationList = () => (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-600" /> Messages
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {loadingConversations ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={28} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8 text-center">
            <div className="p-4 bg-gray-50 rounded-2xl mb-4">
              <MessageSquare size={32} />
            </div>
            <p className="font-semibold text-gray-500 mb-1">No conversations yet</p>
            <p className="text-sm">Find a teammate and hit "Message" to start chatting!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversations.map((conv) => (
              <button
                key={conv.room_id}
                onClick={() => openRoom(conv.room_id, conv.other_user_name)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                  activeRoom === conv.room_id ? "bg-blue-50/60 border-l-2 border-blue-500" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-full shrink-0 flex items-center justify-center font-bold text-base">
                  {conv.other_user_name?.[0]?.toUpperCase() || <User size={16} />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{conv.other_user_name}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {conv.last_timestamp ? new Date(conv.last_timestamp).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.last_message || "Start the conversation…"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!activeRoom) {
    return renderConversationList();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[78vh]">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1 h-full">{renderConversationList()}</div>

      {/* Chat Window */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <button onClick={() => setActiveRoom(null)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            {recipientName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{recipientName || "Chat"}</h3>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> ONLINE
            </p>
          </div>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center py-2 border-b border-gray-50">
            <button onClick={loadMore} disabled={loadingMore}
              className="text-xs text-blue-600 font-semibold flex items-center gap-1 mx-auto hover:underline">
              {loadingMore ? <Loader2 size={12} className="animate-spin" /> : <ChevronUp size={12} />}
              {loadingMore ? "Loading…" : "Load older messages"}
            </button>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50/30">
          {loadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-blue-500" size={28} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={28} />
              </div>
              <p className="font-semibold text-gray-500 mb-1">Start the conversation</p>
              <p className="text-sm">Say hello to {recipientName}! 👋</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg._id || idx}
                  msg={msg}
                  isMe={msg.sender_id?.toString() === userId?.toString()}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${recipientName || "…"}`}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center shrink-0"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
