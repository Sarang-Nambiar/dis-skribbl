"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
// Empty on the server so server and first client render match, then the real
// origin fills in.
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export default function InviteLink({ roomId }: { roomId: string }) {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const [copied, setCopied] = useState(false);

  const link = `${origin}/room/${roomId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context / denied) — the field is
      // still selectable, so the user can copy by hand.
    }
  }

  return (
    <div>
      <label
        htmlFor="invite-link"
        className="text-sm font-bold uppercase tracking-wide text-black/60"
      >
        Invite your friends
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="invite-link"
          readOnly
          value={link}
          onFocus={(event) => event.target.select()}
          className="min-w-0 flex-1 rounded-lg border-2 border-black/15 bg-black/[0.03] px-3 py-2 text-sm outline-none focus:border-black/40"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="w-24 shrink-0 rounded-lg bg-blue-500 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-blue-600"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
