package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/Jewels2001/LlamaFeeders/server/agent"
	"github.com/Jewels2001/LlamaFeeders/server/platform"
)

const NumAgents = 10
const MaxPostsLen = 10

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
            posts = append(posts, eventPost)

            for _, curAgent := range(agent.Agents) {
                // log.Printf("Generating post for user: %s", curAgent.Username)
                post, err := curAgent.GeneratePost(posts)
                if err != nil {
                    log.Printf("Error generating post for user %s: %v", curAgent.Username, err)
                }

                if post.Message != "NO_RESPONSE" {
                    fmt.Println(post.String())
                    posts = append(posts, post)
                }
            }

            if len(posts) > MaxPostsLen {
                posts = posts[1:]
            }
        }
    }()

    http.HandleFunc("/api/getEventsEndpoint", getEventsEndpoint)
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func getEventsEndpoint(w http.ResponseWriter, r* http.Request) {
    data, err := json.Marshal(posts)
    if err != nil {
        log.Println("Error getting events:", err)
        w.WriteHeader(http.StatusInternalServerError)
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.WriteHeader(http.StatusOK)
    w.Write(data)
}
