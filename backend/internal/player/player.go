package player

import (
	"encoding/json"
	"io"
	"log"
	"uuid"
)

// Frontend avatar info
type AvatarInfo struct {
	ColorIdx int `json:"colorIdx"`
	EyesIdx  int `json:"eyesIdx"`
	MouthIdx int `json:"mouthIdx"`
}

type Player struct {
	Name   string `json:"name"`
	ID     uuid.UUID
	Score  int
	Avatar AvatarInfo `json:"avatar"`
}

func CreatePlayer(ID uuid.UUID, Data io.ReadCloser) (*Player, error) {
	var p Player
	err := json.NewDecoder(Data).Decode(&p)

	if err != nil {
		return nil, err
	}

	p.ID = ID

	log.Printf("New Player created: %v", p)

	return &p, nil
}
