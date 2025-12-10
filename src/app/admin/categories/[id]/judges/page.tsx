"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function InviteJudgesPage() {
  const router = useRouter();
  const params = useParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitedJudges, setInvitedJudges] = useState<Array<{ email: string; link: string }>>([]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/judges/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          categoryId: params.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInvitedJudges([...invitedJudges, { email, link: data.inviteLink }]);
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error("Failed to invite judge:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/admin/categories/${params.id}`}
          className="text-white/60 hover:text-white text-sm mb-2 inline-block"
        >
          ← Back to Category
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Invite Judges</h1>
        <p className="text-white/60">Add judges to evaluate submissions for this category</p>
      </div>

      <form onSubmit={handleInvite} className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Judge Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="judge@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Judge Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-finder-500/50 focus:ring-2 focus:ring-finder-500/20 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full px-6 py-3 bg-finder-500 hover:bg-finder-600 disabled:bg-white/10 text-white rounded-xl font-medium transition-all duration-200"
        >
          {isSubmitting ? "Inviting..." : "Send Invitation"}
        </button>
      </form>

      {invitedJudges.length > 0 && (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h2 className="font-semibold mb-4">Invited Judges</h2>
          <div className="space-y-4">
            {invitedJudges.map((judge, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl">
                <p className="font-medium mb-2">{judge.email}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={judge.link}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70"
                  />
                  <button
                    onClick={() => copyToClipboard(judge.link)}
                    className="px-4 py-2 bg-finder-500 hover:bg-finder-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

