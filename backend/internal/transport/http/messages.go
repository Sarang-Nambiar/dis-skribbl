package http

import (
	"encoding/json"
	"uuid"
)

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type PlayerToken struct {
	ID uuid.UUID `json:"id"`
}

type RoomCreationMessage struct {
	Player_ID uuid.UUID `json:"player_id"`
	Room_ID   string    `json:"room_id"`
}
