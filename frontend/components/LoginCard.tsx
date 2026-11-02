"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Avatar from "@/components/Avatar";
import axios from "axios";
import { createPrivateRoom } from "@/lib/api";

const MAX_NAME_LENGTH = 16;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginCard() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [avatarIdx, setAvatarIdx] = useState(0);
	const [mouthIdx, setMouthIdx] = useState(0);
	const [eyesIdx, setEyesIdx] = useState(0);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const canPlay = name.trim().length > 0;

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		axios
			.post(`http://${BACKEND_URL}` + "/play", {
				name,
				score: 0,
				avatar: { colorIdx: avatarIdx, eyesIdx, mouthIdx },
			})
			.then((response) => {
				console.log(response.data);

				//handle websocket connection
				const ws = new WebSocket(`ws://${BACKEND_URL}/ws`);
				ws.onopen = () => {
					ws.send("Hellow server!");
				};
				ws.onmessage = (event) => {
					console.log("Received a message from the server: " + event.data);
				};
				ws.onclose = () => console.log("Disconnected");

				return () => ws.close(); // Cleanup on unmount
			})
			.catch((err) => {
				if (err.response) {
					console.log(err.response.status); // e.g., 404, 500
					console.log(err.response.data); // Server error payload
				} else if (err.request) {
					console.log("No response received"); // Network error
				}
				console.error(err);
			});
	}

	async function handleCreatePrivateRoom() {
		setCreating(true);
		setError(null);
		try {
			const { roomId } = await createPrivateRoom({ name: name.trim() });
			router.push(`/room/${roomId}`);
		} catch {
			setError("Couldn't create a room. Please try again.");
			setCreating(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="w-full max-w-sm rounded-xl border-2 border-black/10 bg-white p-6 shadow-xl">
				<p className="text-center text-lg font-semibold">Welcome!</p>
				<p className="mt-1 text-center text-sm text-black/60">
					Pick a name and a look, then jump in.
				</p>

				<div className="mt-5 flex justify-center">
					<Avatar
						avatarIdx={avatarIdx}
						mouthIdx={mouthIdx}
						eyesIdx={eyesIdx}
						setAvatarIdx={setAvatarIdx}
						setEyesIdx={setEyesIdx}
						setMouthIdx={setMouthIdx}
					/>
				</div>

				<input
					type="text"
					name="playerName"
					value={name}
					onChange={(event) => setName(event.target.value)}
					maxLength={MAX_NAME_LENGTH}
					placeholder="Enter your name"
					aria-label="Player name"
					className="mt-5 w-full rounded-lg border-2 border-black/15 px-3 py-2 text-center outline-none focus:border-black/40"
				/>

				<button
					type="submit"
					disabled={!canPlay}
					className="mt-6 w-full rounded-lg bg-green-500 py-2.5 text-lg font-bold text-white shadow transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500/40 disabled:shadow-none"
				>
					Play!
				</button>

				<button
					type="button"
					onClick={handleCreatePrivateRoom}
					disabled={!canPlay || creating}
					className="mt-3 w-full rounded-lg bg-blue-500 py-2.5 text-lg font-bold text-white shadow transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-500/40 disabled:shadow-none"
				>
					{creating ? "Creating…" : "Create Private Room"}
				</button>

				{error && (
					<p role="alert" className="mt-3 text-center text-sm text-red-600">
						{error}
					</p>
				)}
			</div>
		</form>
	);
}
