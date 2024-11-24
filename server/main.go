package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/Jewels2001/LlamaFeeders/server/agent"
	"github.com/Jewels2001/LlamaFeeders/server/platform"
)

const NumAgents = 10
const MaxPostsLen = 10

var mu sync.Mutex
var posts []platform.Post

func main() {
    log.Println("Generating Agents...")
    // God 1
    agent.GenerateAgents(NumAgents)
    log.Println("Done.")

    go func() {
        for {
            // log.Println("Generating new platform event...")
            eventPost, err := platform.GenerateEventPost()
            if err != nil {
                log.Printf("Error generating event post: %v", err)
            }
            log.Println(eventPost.String())
            mu.Lock()
            posts = append(posts, eventPost)
            mu.Unlock()

            for _, curAgent := range(agent.Agents) {
                // log.Printf("Generating post for user: %s", curAgent.Username)
                post, err := curAgent.GeneratePost(posts)
                if err != nil {
                    log.Printf("Error generating post for user %s: %v", curAgent.Username, err)
                }

                if post.Message != "NO_RESPONSE" {
                    fmt.Println(post.String())
                    mu.Lock()
                    posts = append(posts, post)
                    mu.Unlock()
                }
            }

            if len(posts) > MaxPostsLen {
                mu.Lock()
                posts = posts[len(posts)-MaxPostsLen:]
                mu.Unlock()
            }
        }
    }()

    http.HandleFunc("/api/getEvents", getEventsEndpoint)
    http.HandleFunc("/api/createNewEvent", createNewEvent)
    http.HandleFunc("/api/getUserData", getUserData)
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func setHeaders(w* http.ResponseWriter) {
    (*w).Header().Set("Content-Type", "application/json")
    (*w).Header().Set("Access-Control-Allow-Origin", "*")
    (*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func getEventsEndpoint(w http.ResponseWriter, r* http.Request) {
    setHeaders(&w)
    data, err := json.Marshal(posts)
    if err != nil {
        log.Println("Error getting events:", err)
        w.WriteHeader(http.StatusInternalServerError)
    }
    w.WriteHeader(http.StatusOK)
    w.Write(data)
}

func createNewEvent(w http.ResponseWriter, r* http.Request) {
    setHeaders(&w)

    type Event struct{
        Text string `json:"eventText"`
    }
    var newEvent Event

    if err := json.NewDecoder(r.Body).Decode(&newEvent); err != nil {
        log.Println("Error creating new event:", err)
        w.WriteHeader(http.StatusInternalServerError)
    }

    post := platform.NewPost("LLAMANEWS", newEvent.Text)
    mu.Lock()
    posts = append(posts, post)
    mu.Unlock()
    log.Println(post.String())

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Event sucesfully created"))
}

func getUserData(w http.ResponseWriter, r* http.Request) {
    setHeaders(&w)

    username := r.URL.Query().Get("Author")
    if username == "" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    agent, ok := agent.Agents[username]
    if !ok {
        w.WriteHeader(http.StatusNoContent)
        w.Write([]byte("User not found"))
    }
    
    data, err := json.Marshal(agent)
    if err != nil {
        log.Println("Error getting events:", err)
        w.WriteHeader(http.StatusInternalServerError)
    }
    w.WriteHeader(http.StatusOK)
    w.Write(data)
}
