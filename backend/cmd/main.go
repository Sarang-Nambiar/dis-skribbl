package main

import (
	apphttp "dis-skribbl-backend/internal/transport/http"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Printf("Could not load .env file: %v", err)
		return
	}

	serverIP := os.Getenv("SERVER_ADDR")
	if serverIP == "" {
		log.Print("The server address is not set! Check if the environment file (.env) has it defined.")
		return
	}

	log.Printf("Server starting at %s \n", serverIP)

	h, err := apphttp.CreateRouter()

	if err != nil {
		log.Printf("Something went wrong when initializing the server: %v", err)
		return
	}

	srv := http.Server{
		Addr:    serverIP,
		Handler: h,
	}

	err = srv.ListenAndServe()
	if err != nil {
		log.Printf("Server failed to start: %v", err)
	}
}
