"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateEmail = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate email");
      }

      const data = await response.json();

      setSubject(data.subject);
      setBody(data.body);
    } catch (error) {
      console.error(error);
      setError("Unable to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
            ✦ AI Powered Email Writer
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Write better emails
            <span className="block text-purple-400">
              in seconds.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Tell us what you want to say. Our AI will turn your idea
            into a professional email.
          </p>
        </header>

        {/* Topic Card */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl">

          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              What do you want to write?
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Describe the purpose of your email in your own words.
            </p>
          </div>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Ask my professor for two days leave because I have a family function..."
            className="h-36 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-[15px] leading-6 text-white placeholder:text-zinc-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />

          <div className="mt-4 flex items-center justify-between">

            <span className="text-xs text-zinc-500">
              {topic.length} characters
            </span>

            <button
              onClick={generateEmail}
              disabled={loading}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : (
                "Generate Email"
              )}
            </button>

          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

        </section>

        {/* Generated Email */}
        {(subject || body) && (
          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Generated Email
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  You can edit the email before sending it.
                </p>
              </div>

              <div className="rounded-lg border border-green-900/50 bg-green-950/30 px-3 py-1.5 text-xs font-medium text-green-400">
                AI Generated
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Subject
              </label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Body */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email Body
              </label>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[350px] w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-[15px] leading-7 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">

              <button
                onClick={generateEmail}
                disabled={loading}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                Regenerate
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Send Email
              </a>

            </div>

          </section>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-zinc-600">
          AI Email Writer • Built with Next.js + FastAPI + Groq
        </footer>

      </div>
    </main>
  );
}