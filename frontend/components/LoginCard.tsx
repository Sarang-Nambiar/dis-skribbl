"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import Avatar from "@/components/Avatar";
import { createPrivateRoom, joinRoom } from "@/lib/api";
import {
	DEFAULT_AVATAR,
	parseProfile,
	readRawProfile,
	saveProfile,
	type Profile,
} from "@/lib/profile";

const MAX_NAME_LENGTH = 16;

const noopSubscribe = () => () => {};

/**
 * Waits for hydration, then mounts the form seeded from the saved profile.
 * `undefined` is the server snapshot; on the client it becomes the raw saved
 * string (or null if nothing is saved), so the form never renders with
 * server-guessed values that would mismatch or overwrite the stored profile.
 */
export default function LoginCard() {
	const rawProfile = useSyncExternalStore(
		noopSubscribe,
		readRawProfile,
		() => undefined,
	);
	if (rawProfile === undefined) return null;
	return <LoginForm initial={parseProfile(rawProfile)} />;
}

function LoginForm({ initial }: { initial: Profile | null }) {
	const router = useRouter();
	const [name, setName] = useState(
		() => initial?.name.slice(0, MAX_NAME_LENGTH) ?? "",
	);
	const [avatarIdx, setAvatarIdx] = useState(
		() => initial?.avatar.colorIdx ?? DEFAULT_AVATAR.colorIdx,
	);
	const [mouthIdx, setMouthIdx] = useState(
		() => initial?.avatar.mouthIdx ?? DEFAULT_AVATAR.mouthIdx,
	);
	const [eyesIdx, setEyesIdx] = useState(
		() => initial?.avatar.eyesIdx ?? DEFAULT_AVATAR.eyesIdx,
	);
	const [creating, setCreating] = useState(false);
	const [joinOpen, setJoinOpen] = useState(false);
	const [roomCode, setRoomCode] = useState("");
	const [joining, setJoining] = useState(false);
	const roomCodeRef = useRef<HTMLInputElement>(null);

	// The input is always mounted (so the card never reflows); focus it once it
	// has been enabled by opening.
	useEffect(() => {
		if (joinOpen) roomCodeRef.current?.focus();
	}, [joinOpen]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		saveProfile({
			name,
			avatar: { colorIdx: avatarIdx, eyesIdx, mouthIdx },
		});
	}, [name, avatarIdx, eyesIdx, mouthIdx]);

	const canPlay = name.trim().length > 0;
	const canJoin = canPlay && roomCode.trim().length > 0 && !joining;

	// Form submit = the arrow button (or Enter) in the room-code row.
	async function handleJoinRoom(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!joinOpen || !canJoin) return;

		setJoining(true);
		setError(null);
		try {
			await joinRoom({
				roomCode: roomCode.trim(),
				name: name.trim(),
				avatar: { colorIdx: avatarIdx, eyesIdx, mouthIdx },
			});
			// TODO(backend): navigate to the lobby / game screen once joining works,
			// e.g. router.push(`/room/${roomCode.trim()}`).
		} catch {
			setError("Couldn't join that room. Check the code and try again.");
		} finally {
			setJoining(false);
		}
	}

	async function handleCreatePrivateRoom() {
		setCreating(true);
		setError(null);
		try {
			const { roomId } = await createPrivateRoom({
				name: name.trim(),
				avatar: { colorIdx: avatarIdx, eyesIdx, mouthIdx },
			});
			router.push(`/room/${roomId}`);
		} catch {
			setError("Couldn't create a room. Please try again.");
			setCreating(false);
		}
	}

	return (
		<form onSubmit={handleJoinRoom}>
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

				{/*
				  Fixed height so swapping Play -> room code never moves the card. The
				  input grows from 0 to 4 parts while the button shrinks to 1 part
				  (80 / 20), so Play visibly morphs into the arrow button.
				*/}
				<div className="mt-6 flex h-12">
					<input
						ref={roomCodeRef}
						type="text"
						name="roomCode"
						value={roomCode}
						onChange={(event) => setRoomCode(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Escape") setJoinOpen(false);
						}}
						disabled={!joinOpen}
						placeholder="Enter room code"
						aria-label="Room code"
						autoComplete="off"
						style={{ flexGrow: joinOpen ? 4 : 0 }}
						className={`min-w-0 basis-0 overflow-hidden rounded-lg border-black/15 text-center text-lg outline-none transition-all duration-300 ease-out focus:border-black/40 motion-reduce:transition-none ${
							joinOpen
								? "mr-2 border-2 px-3 opacity-100"
								: "mr-0 border-0 px-0 opacity-0"
						}`}
					/>
					<button
						type={joinOpen ? "submit" : "button"}
						onClick={(event) => {
							// Don't let the type flip above turn this same click into a submit.
							if (!joinOpen) {
								event.preventDefault();
								setJoinOpen(true);
							}
						}}
						disabled={joinOpen ? !canJoin : !canPlay}
						aria-label={joinOpen ? "Join room" : undefined}
						style={{ flexGrow: 1 }}
						className="grid min-w-0 basis-0 place-items-center overflow-hidden rounded-lg bg-green-500 text-lg font-bold text-white shadow transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500/40 disabled:shadow-none"
					>
						<span
							className={`col-start-1 row-start-1 transition-all duration-200 motion-reduce:transition-none ${
								joinOpen ? "scale-75 opacity-0" : "scale-100 opacity-100"
							}`}
						>
							Play!
						</span>
						<svg
							aria-hidden
							viewBox="0 0 24 24"
							className={`col-start-1 row-start-1 size-6 transition-all duration-300 motion-reduce:transition-none ${
								joinOpen
									? "translate-x-0 opacity-100"
									: "-translate-x-3 opacity-0"
							}`}
							fill="none"
							stroke="currentColor"
							strokeWidth={3}
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14M13 6l6 6-6 6" />
						</svg>
					</button>
				</div>

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
