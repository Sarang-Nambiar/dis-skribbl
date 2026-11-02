import { Suspense } from "react";

import RoomLobby from "@/components/RoomLobby";
import Title from "@/components/Title";

export default function RoomPage({ params }: PageProps<"/room/[roomId]">) {
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
