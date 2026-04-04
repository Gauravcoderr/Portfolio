"use client";

import { useState, useEffect } from "react";
import { getAdminMessages, markMessageRead, deleteMessage } from "@/lib/api";
import { ContactMessage } from "@/types";
import { Trash2, Mail, MailOpen } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getAdminMessages();
      setMessages(data);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markMessageRead(id);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, is_read: true } : msg
        )
      );
    } catch {
      setError("Failed to mark as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      setConfirmDeleteId(null);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch {
      setError("Failed to delete message");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Messages
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)]">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-[var(--bg-card)] rounded-xl p-6 transition-colors ${
                msg.is_read
                  ? "border border-[var(--border)]"
                  : "border-2 border-[var(--accent)]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {msg.name}
                      </h3>
                      {!msg.is_read && (
                        <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full font-medium">
                          Unread
                        </span>
                      )}
                      {msg.is_read && (
                        <span className="text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                          Read
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-[var(--accent)] hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <MailOpen size={16} />
                    </button>
                  )}
                  {msg.is_read && (
                    <div
                      className="p-2 text-[var(--text-secondary)]"
                      title="Read"
                    >
                      <Mail size={16} />
                    </div>
                  )}
                  {confirmDeleteId === msg._id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-[var(--text-secondary)] px-2 py-1.5 hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(msg._id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>

              <p className="text-xs text-[var(--text-secondary)] mt-3">
                {formatDate(msg.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
