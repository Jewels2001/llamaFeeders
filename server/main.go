package main

import (
        "encoding/json"
        "fmt"
        "log"
        "net/http"
        "strings"
        "sync"
        "time"

        "github.com/Jewels2001/LlamaFeeders/server/agent"
        "github.com/Jewels2001/LlamaFeeders/server/platform"
)

const NumAgents = 100
const MaxPostsLen = 100
const MaxEventsLen = 50

var eventsMu, postsMu sync.Mutex
var events []platform.Post
var posts []platform.Post

const GodEventTimeInterval = 5 * time.Second
const PostEventTimeInterval = 2 * time.Second

func God(quit chan struct{}) {
        ticker := time.NewTicker(GodEventTimeInterval)
        for {
                select {
                case <-ticker.C:
                        eventPost, err := platform.GenerateEventPost()
                        if err != nil {
                                log.Printf("Error generating event post: %v", err)
                        }
                        log.Println(eventPost.String())
                        eventsMu.Lock()
                        events = append(events, eventPost)
                        eventsMu.Unlock()

                        if len(events) > MaxEventsLen {
                                eventsMu.Lock()
                                events = events[len(events)-MaxEventsLen:]
                                eventsMu.Unlock()
                        }

                case <-quit:
                        ticker.Stop()
                        return
                }
        }
}

func UserPosts(quit chan struct{}) {
        ticker := time.NewTicker(PostEventTimeInterval)
        for {
                select {
                case <-ticker.C:
                        for _, curAgent := range agent.Agents {
                                post, err := curAgent.GeneratePost(events[max(0, len(events)-10):], posts[max(0, len(posts)-20):])
                                if err != nil {
                                        log.Printf("Error generating post for user %s: %v", curAgent.Username, err)
                                }

                                if !strings.Contains(post.Message, "NO_RESPONSE") && post.Message != "" && len(post.Message) < 280 {
                                        fmt.Println(post.String())
                                        postsMu.Lock()
                                        posts = append(posts, post)
                                        postsMu.Unlock()
                                }
                        }

                        if len(posts) > MaxPostsLen {
                                postsMu.Lock()
                                posts = posts[len(posts)-MaxPostsLen:]
                                postsMu.Unlock()
                        }
                case <-quit:
                        ticker.Stop()
                        return
                }
        }
}

func main() {
        log.Println("Generating Agents...")
        agent.GenerateAgents(NumAgents)
        log.Println("Done.")

        quit := make(chan struct{})
        go God(quit)
        go UserPosts(quit)

        http.HandleFunc("/api/getEvents", getEventsEndpoint)
        http.HandleFunc("/api/createNewEvent", createNewEvent)
        http.HandleFunc("/api/getUserData", getUserData)
        log.Fatal(http.ListenAndServe(":8081", nil))
        close(quit)
}

func setHeaders(w *http.ResponseWriter) {
        (*w).Header().Set("Content-Type", "application/json")
        (*w).Header().Set("Access-Control-Allow-Origin", "*")
        (*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func getEventsEndpoint(w http.ResponseWriter, r *http.Request) {
        setHeaders(&w)
        type Resp struct {
                Events []platform.Post `json:"events"`
                Posts  []platform.Post `json:"posts"`
        }
        resp := Resp{events, posts}
        data, err := json.Marshal(resp)
        if err != nil {
                log.Println("Error getting events:", err)
                w.WriteHeader(http.StatusInternalServerError)
        }
        w.WriteHeader(http.StatusOK)
        w.Write(data)
}

func createNewEvent(w http.ResponseWriter, r *http.Request) {
        setHeaders(&w)

        type Event struct {
                Text string `json:"eventText"`
        }
        var newEvent Event

        if err := json.NewDecoder(r.Body).Decode(&newEvent); err != nil {
                log.Println("Error creating new event:", err)
                w.WriteHeader(http.StatusInternalServerError)
        return
        }

    if newEvent.Text == "" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

        post := platform.NewPost("LLAMANEWS", newEvent.Text)
        eventsMu.Lock()
        events = append(events, post)
        eventsMu.Unlock()
        log.Println(post.String())

        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Event sucesfully created"))
}

func getUserData(w http.ResponseWriter, r *http.Request) {
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
