package http

import (
	"dis-skribbl-backend/internal/player"
	"dis-skribbl-backend/internal/room"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

type Server struct {
	rooms *room.Manager
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	msg := "Server is healthy!"
	log.Println(msg)
	fmt.Fprintln(w, msg)
}

func serverWelcome(w http.ResponseWriter, r *http.Request) {
	msg := "Hello World!"
	log.Println(msg)
	fmt.Fprintln(w, msg)
}

func (s *Server) handlePlay(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement room checking logic to see if one exists and they were already a part of it?

	roomID := s.rooms.CreateRoom()

	log.Printf("Room ID Created: %s", roomID)

	// Creating unique token for player
	playerID := s.rooms.CreatePlayerID(roomID)
	newPlayer, err := player.CreatePlayer(playerID, r.Body)

	if err != nil {
		log.Printf("Something went wrong when decoding the JSON payload: %v, error: %v", r.Body, err)
		http.Error(w, fmt.Sprintf("Something went wrong when decoding the JSON payload: %v", err), http.StatusBadRequest)
		return
	}

	// Add new player to the rooms
	s.rooms.AddPlayer(roomID, newPlayer)

	log.Println("The games have begun!")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(PlayerToken{ID: playerID}); err != nil {
		log.Printf("failed to encode response: %v", err)
	}
}

// TODO: Implement websocket logic here
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
}

func (s *Server) serveWs(w http.ResponseWriter, r *http.Request) {

	// Upgrade the connection from http to websocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}
	defer conn.Close()

	log.Printf("Client connected: %s", conn.RemoteAddr())

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err,
				websocket.CloseGoingAway,
				websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected close error: %v", err)
			}
			break
		}

		if messageType != websocket.TextMessage {
			continue // ignore binary data
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Bad message from %s: %v", conn.RemoteAddr(), err)
			conn.WriteJSON(map[string]string{"error": "invalid message"})
			continue
		}

		switch msg.Type {
		case "Join":
			//TODO: Replace below code with correct join code.
			// Currently testing if it works
			var playerToken PlayerToken
			if err := json.Unmarshal(msg.Payload, &playerToken); err != nil {
				log.Printf("Bad Payload from %s: %v", conn.RemoteAddr(), err)
				conn.WriteJSON(map[string]string{"error": "invalid payload"})
				continue
			}
			log.Printf("Player ID %s has been received from the frontend", playerToken.ID.String())
		default:
			log.Printf("Invalid message type sent: %s", msg.Type)
		}

		if err := conn.WriteMessage(messageType, message); err != nil {
			log.Printf("Write error: %v", err)
			break
		}
	}

	log.Printf("Client disconnected: %s", conn.RemoteAddr())
}

func CreateRouter() (http.Handler, error) {
	router := mux.NewRouter()
	s := &Server{rooms: room.NewManager()}

	router.Use(loggingMiddleware)

	router.HandleFunc("/", serverWelcome)
	router.HandleFunc("/health", healthCheck).Methods("GET")
	router.HandleFunc("/play", s.handlePlay).Methods("POST")
	router.HandleFunc("/ws", s.serveWs)

	return CORSMiddleware(router), nil
}

func CORSMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if err := godotenv.Load(); err != nil {
			log.Printf("Could not load .env file: %v", err)
			return
		}

		frontend_addr := os.Getenv("FRONTEND_URL")
		if frontend_addr == "" {
			fmt.Printf("Frontend URL was not fetched from the .env file.\n")
			return
		}

		// fmt.Printf("Frontend url fetched: %s\n", frontend_addr)
		fmt.Println("Inside the CORS middleware.")

		w.Header().Set("Access-Control-Allow-Origin", frontend_addr)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			// Handling preflight requests
			w.WriteHeader(http.StatusNoContent)
			return
		}

		handler.ServeHTTP(w, r)
	})
}

// Helps log the requests coming into the server
func loggingMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL.Path)
		handler.ServeHTTP(w, r)
	})
}
