package http

import (
	"dis-skribbl-backend/internal/user"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

// Two api endpoints
// one for creating a new user when the user logs in from the site
// one for getting the commands from the scribble board, what to update on the rest of the user's screens.

func healthCheck(w http.ResponseWriter, r *http.Request) {
	log.Println("Server is healthy!")
}

func serverWelcome(w http.ResponseWriter, r *http.Request) {
	msg := "Hello World!"
	log.Println(msg)
	fmt.Fprintln(w, msg)
}

func handlePlay(w http.ResponseWriter, r *http.Request) {
	var u user.User
	err := json.NewDecoder(r.Body).Decode(&u)

	if err != nil {
		log.Printf("Something went wrong when decoding the JSON payload: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Printf("This is the User %v", u)
	log.Println("The games have begun!")
}

func CreateRouter() (http.Handler, error) {
	router := mux.NewRouter()

	router.Use(loggingMiddleware)

	router.HandleFunc("/", serverWelcome)
	router.HandleFunc("/health", healthCheck).Methods("GET")
	router.HandleFunc("/play", handlePlay).Methods("POST")

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
