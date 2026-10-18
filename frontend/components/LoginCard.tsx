"use client";

import { useState } from "react";

import Avatar from "@/components/Avatar";
import axios from "axios";

const MAX_NAME_LENGTH = 16;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginCard() {
  const [name, setName] = useState("");

  const canPlay = name.trim().length > 0;

  function handlePlay() {
    // TODO: hand the player off to the game — needs the backend first.
    axios.post(BACKEND_URL + "/play", {})
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.status); // e.g., 404, 500
          console.log(err.response.data);   // Server error payload
        } else if (err.request) {
          console.log('No response received'); // Network error
        }
        console.error(err);
      })
  }

  return (
    <div className="w-full max-w-sm rounded-xl border-2 border-black/10 bg-white p-6 shadow-xl">
      <p className="text-center text-lg font-semibold">Welcome!</p>
      <p className="mt-1 text-center text-sm text-black/60">
        Pick a name and a look, then jump in.
      </p>

      <div className="mt-5 flex justify-center">
        <Avatar />
      </div>

      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={MAX_NAME_LENGTH}
        placeholder="Enter your name"
        aria-label="Player name"
        className="mt-5 w-full rounded-lg border-2 border-black/15 px-3 py-2 text-center outline-none focus:border-black/40"
      />

      <button
        type="button"
        onClick={handlePlay}
        disabled={!canPlay}
        className="mt-6 w-full rounded-lg bg-green-500 py-2.5 text-lg font-bold text-white shadow transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500/40 disabled:shadow-none"
      >
        Play!
      </button>
    </div>
  );
}
