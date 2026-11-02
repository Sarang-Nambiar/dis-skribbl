package room

import (
	"dis-skribbl-backend/internal/player"
	"log"
	"math/rand"
	"sync"
	"time"
	"uuid"
)

const (
	ROOM_ID_LENGTH = 6
	MAX_PLAYERS    = 8
)

type Room struct {
	ID         string
	RoomLeader *player.Player
	Players    map[uuid.UUID]*player.Player
}

// Manager object acting as the shared database for all the rooms which are active
type Manager struct {
	lock  sync.Mutex
	rooms map[string]*Room
}

func NewManager() *Manager {
	return &Manager{rooms: make(map[string]*Room)}
}

func (m *Manager) CreateRoom() string {
	for {
		rID := randomString(ROOM_ID_LENGTH)

		if _, ok := m.rooms[rID]; !ok {
			// Found a room ID which is not already present in the list of rooms
			m.lock.Lock()
			// Create room with rID
			m.rooms[rID] = &Room{ID: rID, Players: make(map[uuid.UUID]*player.Player)}
			m.lock.Unlock()
			return rID
		}
	}
}

func (m *Manager) AddPlayer(roomID string, p *player.Player) {
	m.lock.Lock()
	defer m.lock.Unlock()

	m.rooms[roomID].Players[p.ID] = p
	log.Printf("Player %s with ID %s has been added to room: %s", p.Name, p.ID.String(), roomID)
}

func (m *Manager) CreatePlayerID(roomID string) uuid.UUID {
	for {
		id := uuid.New()

		if _, ok := m.rooms[roomID].Players[id]; !ok {
			log.Printf("Created UUID for player: %s", id.String())
			return id
		}
	}
}

// utility functions

// function to create a unique room id
func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	rand.Seed(time.Now().UnixNano())

	result := make([]byte, length)

	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}
