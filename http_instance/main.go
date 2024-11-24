package main

import (
	"fmt"
	"net/http"
	"log"
	// "github.com/Jewels2001/LlamaFeeders/http_instance/headers"
)



func main() {
	http.HandleFunc("/api/", getEvents)
	// server := &http.Server{
	// 	Addr: fmt.Sprintf(":8080/api"),
	// 	Handler: handers.New(),
	// }

	log.Printf("Starting HTTP Server. Listening at 8081")
	if err := http.ListenAndServe(":8081", nil); err != http.ErrServerClosed {
		log.Printf("%v", err)
	} else {
		log.Println("Server closed!")
	}
}

// func (s *server) ServeHTTP (w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte(`{"message": "hello :)}`))
// }

func getEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Welcome to the getEvents endpoint!"}`))
	// fmt.Fprintf(w, "Welcome to the getEvents endpoint!") // w is response, string is data
	fmt.Println("Endpoint Hit: getEvents")
}


// func handleRequests() {
// 	http.HandleFunc("/api/getEvents", getEvents)
// 	log.Fatal(http.ListenAndServe())
	
// }