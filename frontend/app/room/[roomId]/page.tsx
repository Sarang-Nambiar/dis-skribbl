"use client"

import { Suspense, useEffect } from "react";

import RoomLobby from "@/components/RoomLobby";
import Title from "@/components/Title";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RoomPage({ params }: PageProps<"/room/[roomId]">) {

  useEffect(() => {
    const ws = new WebSocket("ws://" + BACKEND_URL + "/ws")

    ws.onopen = () => {
      console.log("Websocket connection with the backend has been initiated.")
    };

    ws.onmessage = (event) => {
      console.log(event.data);
    };

    ws.onclose = (event) => {
      console.log("Websocket connection with the backend has been closed.")
    };

    return () => {
      ws.close()
    }
  }, [])
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <Title />
      {/* `params` is runtime data under cacheComponents, so it must be read
          inside Suspense; the title above stays in the static shell. */}
      <Suspense fallback={null}>
        {params.then(({ roomId }) => (
          <RoomLobby roomId={roomId} />
        ))}
      </Suspense>
    </main>
  );
}
