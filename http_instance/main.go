package main

import (
	"fmt"
	"net/http"
	"log"
	// "github.com/Jewels2001/LlamaFeeders/http_instance/headers"
)



func main() {
	http.HandleFunc("/api/createNewEvent", postUserEvent)
	http.HandleFunc("/api/getEvents", getEvents)
	http.HandleFunc("/api/getUserData", getUserData)
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

dataFeed = `{[
        {
                "username": "Bookworm95",
                "comments" : "Nice post",
                "commentId" :  123
        },
        {
                "username": "Bookworm96",
                "comments" : "Nice post!!!!!",
                "commentId" :  124
        },
        ]}`

dataUser = `
{
    "username" : "BookWorm96",
    "age": 25,
    "occupation": "Software Engineer",
    "interests": ["reading", "coding", "gaming"],
    "personality": {
        "oe": 0.8,
        "co": 0.3,
        "ex": 0.5,
        "ag": 0.7,
        "ne": 0.6
    },
    "education": "Bachelors in Computer Science",
    "profilePicture": ""
}
`

func getEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(dataFeed))
	// fmt.Fprintf(w, "Welcome to the getEvents endpoint!") // w is response, string is data
	fmt.Println("Endpoint Hit: getEvents")
}

func getUserData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(dataUser))
	fmt.Println("Endpoint Hit: getUserData")
}


func postUserEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message": "post called"}`))
	fmt.Println("Endpoint Hit: postUserEvent")

}


// func handleRequests() {
// 	http.HandleFunc("/api/getEvents", getEvents)
// 	log.Fatal(http.ListenAndServe())
	
// }