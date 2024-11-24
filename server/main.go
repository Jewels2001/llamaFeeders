package main

import (
	"fmt"
	"log"

	"github.com/Jewels2001/LlamaFeeders/server/agent"
	"github.com/Jewels2001/LlamaFeeders/server/platform"
)

const NumAgents = 10
const MaxPostsLen = 50

func main() {
    log.Println("Generating Agents...")
    // God 1
    agent.GenerateAgents(NumAgents)
    log.Println("Done.")

    var posts []platform.Post
    for {
        log.Println("Generating new platform event...")
        eventPost, err := platform.GenerateEventPost()
        if err != nil {
            log.Printf("Error generating event post: %v", err)
        }
        log.Println(eventPost.String())
        posts = append(posts, eventPost)

        for _, curAgent := range(agent.Agents) {
            log.Printf("Generating post for user: %s", curAgent.Username)
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
}
