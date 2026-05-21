import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { FiArrowLeft, FiMessageSquare, FiSend } from "react-icons/fi";
import { BASE_URL, getPhotoUrl } from "../utils/constants";

const SocketDot = ({ status }) => (
  <span
    title={status === "connected" ? "Live" : status === "error" ? "Offline" : "Connecting…"}
    className={`inline-block h-2 w-2 rounded-full ${
      status === "connected"
        ? "bg-emerald-500"
        : status === "error"
          ? "bg-red-400"
          : "bg-[var(--app-accent)] animate-pulse"
    }`}
  />
);

SocketDot.propTypes = {
  status: PropTypes.oneOf(["connected", "connecting", "error"]).isRequired,
};

const Chat = () => {
  const currentUser = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [unreadFrom, setUnreadFrom] = useState(new Set());

  const socketRef = useRef(null);
  const selectedUserRef = useRef(null);
  const currentUserRef = useRef(currentUser);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const connectionsRef = useRef([]);

  // Keep refs in sync so socket handlers always see latest values
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    connectionsRef.current = connections;
  }, [connections]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // Init socket connection once
  useEffect(() => {
    if (!currentUser) return;

    const token = sessionStorage.getItem("_socket_token");
    const socket = io(BASE_URL, {
      withCredentials: true,
      auth: { token: token || "" },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketStatus("connected"));
    socket.on("connect_error", () => setSocketStatus("error"));
    socket.on("disconnect", () => setSocketStatus("connecting"));

    // Only add messages FROM the other person — own messages are added optimistically on send
    socket.on("receive_message", (msg) => {
      const me = currentUserRef.current;
      if (!me) return;

      // Only handle messages where I am the receiver
      if (String(msg.receiverId) !== String(me._id)) return;

      const sel = selectedUserRef.current;

      if (sel && String(msg.senderId) === String(sel._id)) {
        // Active conversation — add message immediately
        setMessages((prev) => [...prev, msg]);
      } else {
        // Different or no conversation open — mark sender as having unread messages
        setUnreadFrom((prev) => new Set([...prev, String(msg.senderId)]));
      }
    });

    return () => socket.disconnect();
  }, [currentUser]);

  // Fetch connections list
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(BASE_URL + "/user/connections", { withCredentials: true })
      .then((res) => setConnections(res.data || []))
      .catch(() => {});
  }, [currentUser]);

  // Auto-restore last open conversation after connections load
  useEffect(() => {
    if (!connections.length) return;
    const lastId = sessionStorage.getItem("lastChatUserId");
    if (!lastId) return;
    setSelectedUser((prev) => {
      if (prev) return prev; // don't override a manually selected conversation
      return connections.find((c) => String(c._id) === lastId) ?? null;
    });
  }, [connections]);

  // Load history when conversation changes
  useEffect(() => {
    if (!selectedUser) return;
    setIsLoadingMsgs(true);
    setMessages([]);
    axios
      .get(BASE_URL + "/chat/messages/" + selectedUser._id, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch(() => {})
      .finally(() => setIsLoadingMsgs(false));
  }, [selectedUser]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !selectedUser || !currentUser) return;

    // Optimistic: render immediately so the sender always sees their message
    const optimisticMsg = {
      _id: `local_${Date.now()}`,
      senderId: String(currentUser._id),
      receiverId: String(selectedUser._id),
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }

    socketRef.current?.emit("send_message", {
      receiverId: String(selectedUser._id),
      content: text,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  if (!currentUser) return null;

  const currentUserId = String(currentUser._id);

  return (
    <section className="app-shell app-fade-up px-1">
      <div
        className="surface-card flex overflow-hidden"
        style={{
          height: "min(calc(100dvh - 10rem), 42rem)",
          background: "var(--app-surface)",
        }}
      >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`flex flex-col shrink-0 w-full sm:w-72 lg:w-80 border-r border-[var(--app-line)] bg-[var(--app-surface)] ${
          selectedUser ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[var(--app-line)] px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--app-text)]">
              Messages
            </h2>
            <p className="text-xs text-[var(--app-muted)]">
              {connections.length} connection{connections.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--app-line)] bg-[var(--app-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--app-muted)]">
            <SocketDot status={socketStatus} />
            {socketStatus === "connected" ? "Live" : socketStatus === "error" ? "Offline" : "…"}
          </span>
        </div>

        {/* Connection list */}
        <div className="flex-1 overflow-y-auto">
          {connections.length === 0 ? (
            <div className="empty-state opacity-60 py-12">
              <div className="empty-state-icon">
                <FiMessageSquare size={22} />
              </div>
              <p className="text-sm text-[var(--app-muted)]">
                No connections yet. Connect with developers to start chatting.
              </p>
            </div>
          ) : (
            connections.map((conn) => {
              const isActive = String(selectedUser?._id) === String(conn._id);
              return (
                <button
                  key={conn._id}
                  onClick={() => {
                    setSelectedUser(conn);
                    sessionStorage.setItem("lastChatUserId", String(conn._id));
                    setUnreadFrom((prev) => {
                      const next = new Set(prev);
                      next.delete(String(conn._id));
                      return next;
                    });
                  }}
                  className={`flex w-full items-center gap-3 border-b border-[var(--app-line)]/50 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "border-r-2 border-r-[var(--app-accent)] bg-[var(--app-accent-soft)]"
                      : "hover:bg-[var(--app-surface-muted)]"
                  }`}
                >
                  <img
                    src={getPhotoUrl(conn.photoUrl)}
                    alt={conn.firstName}
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-[var(--app-line)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`flex items-center gap-1.5 truncate text-sm font-semibold ${
                        isActive ? "text-[var(--app-accent-strong)]" : "text-[var(--app-text)]"
                      }`}
                    >
                      {conn.firstName} {conn.lastName}
                      {unreadFrom.has(String(conn._id)) && (
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--app-accent)]" />
                      )}
                    </p>
                    <p className="truncate text-xs text-[var(--app-muted)]">
                      {conn.about || "Developer"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Conversation panel ───────────────────────────────────── */}
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          selectedUser ? "flex" : "hidden sm:flex"
        }`}
        style={{ background: "var(--app-surface-muted)" }}
      >
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-[var(--app-line)] bg-[var(--app-surface)] px-4 py-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  sessionStorage.removeItem("lastChatUserId");
                }}
                className="sm:hidden rounded-full p-1.5 text-[var(--app-muted)] hover:bg-[var(--app-accent-soft)]"
              >
                <FiArrowLeft size={18} />
              </button>
              <img
                src={getPhotoUrl(selectedUser.photoUrl)}
                alt={selectedUser.firstName}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[var(--app-line)]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--app-text)]">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--app-muted)]">
                  <SocketDot status={socketStatus} />
                  {socketStatus === "connected" ? "Connected" : "Connecting…"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
              {isLoadingMsgs && (
                <div className="flex justify-center py-12">
                  <span className="loading loading-spinner loading-md text-[var(--app-accent)]" />
                </div>
              )}

              {!isLoadingMsgs && messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="empty-state-icon opacity-60">
                    <FiMessageSquare size={22} />
                  </div>
                  <p className="text-sm text-[var(--app-muted)] opacity-70">
                    No messages yet — say hi to {selectedUser.firstName}!
                  </p>
                </div>
              )}

              {messages.map((msg) => {
                const isMine = String(msg.senderId) === currentUserId;
                return (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {!isMine && (
                      <img
                        src={getPhotoUrl(selectedUser.photoUrl)}
                        alt={selectedUser.firstName}
                        className="h-6 w-6 shrink-0 self-end rounded-full object-cover"
                      />
                    )}

                    <div
                      className={`flex max-w-[70%] flex-col gap-0.5 ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isMine
                            ? "rounded-br-sm bg-[var(--app-accent)] text-white"
                            : "rounded-bl-sm border border-[var(--app-line)] bg-[var(--app-surface)] text-[var(--app-text)]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <time
                        className={`px-1 text-[10px] text-[var(--app-muted)] opacity-70 ${
                          isMine ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    {isMine && (
                      <img
                        src={getPhotoUrl(currentUser.photoUrl)}
                        alt={currentUser.firstName}
                        className="h-6 w-6 shrink-0 self-end rounded-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-[var(--app-line)] bg-[var(--app-surface)] px-4 py-3">
              {socketStatus === "error" && (
                <p className="mb-2 text-center text-xs text-red-500">
                  Connection lost — messages may not be delivered to the other person.
                </p>
              )}
              <div className="flex items-end gap-2 rounded-2xl border border-[var(--app-line)] bg-[var(--app-surface-muted)] px-4 py-2.5 focus-within:border-[rgba(234,88,12,0.35)] focus-within:shadow-[0_0_0_3px_rgba(234,88,12,0.10)] transition-all">
                <textarea
                  ref={inputRef}
                  rows={1}
                  placeholder={`Message ${selectedUser.firstName}…`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResize(e);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none bg-transparent text-sm text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus:outline-none"
                  style={{ maxHeight: "120px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-accent)] text-white transition hover:bg-[var(--app-accent-strong)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FiSend size={14} />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-[var(--app-muted)]">
                Enter to send · Shift + Enter for new line
              </p>
            </div>
          </>
        ) : (
          /* Empty state — no conversation selected */
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="empty-state-icon opacity-50">
              <FiMessageSquare size={24} />
            </div>
            <div className="text-center opacity-50">
              <p className="font-medium text-[var(--app-text)]">No conversation open</p>
              <p className="mt-1 text-sm text-[var(--app-muted)]">
                Pick a connection from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default Chat;
