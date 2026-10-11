package http

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Two api endpoints
// one for creating a new user when the user logs in from the site
// one for getting the commands from the scribble board, what to update on the rest of the user's screens.

func healthCheck(w http.ResponseWriter, r *http.Request) {
	log.Println("Server is healthy!")
}

func serverWelcome(w http.ResponseWriter, r *http.Request) {
	log.Println("Hello World!")
}

func CreateRouter() (*mux.Router, error) {
	router := mux.NewRouter()

	router.Use(loggingMiddleware)

	router.HandleFunc("/", serverWelcome).Methods("GET")
	router.HandleFunc("/health", healthCheck).Methods("GET")

	return router, nil
}

// Helps log the requests coming into the server
func loggingMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL.Path)
		handler.ServeHTTP(w, r)
	})
}
