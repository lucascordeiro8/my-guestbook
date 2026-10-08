"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";

// Connect to Supabase using the values in .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Message = { id: number; name: string | null; body: string; created_at: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  // Read all messages, newest first
  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) alert(error.message);
    else setMessages(data);
  }

  // Save a new message, then reload the list
  async function postMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;
    const { error } = await supabase
      .from("messages")
      .insert({ name: name.trim() || "Anonymous", body: body.trim() });
    if (error) return alert(error.message);
    setBody("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Lucas' Guestbook</h1>

      <form onSubmit={postMessage} className="mb-8 flex flex-col gap-3">
        <input
          className="rounded border p-2"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="rounded border p-2"
          placeholder="Say hi!"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="rounded bg-black p-2 text-white" type="submit">
          Post
        </button>
      </form>

      <ul className="flex flex-col gap-4">
        {messages.map((m) => (
          <li key={m.id} className="rounded border p-4">
            <p>{m.body}</p>
            <p className="mt-2 text-sm text-gray-500">
              {m.name} · {new Date(m.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}