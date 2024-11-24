package main

import (
	"fmt"
	"log"

	"github.com/Jewels2001/LlamaFeeders/server/agent"
	"github.com/Jewels2001/LlamaFeeders/server/platform"
)

const NumAgents = 10

func main() {
    log.Println("Generating Agents...")
    // God 1
    agent.GenerateAgents(NumAgents)
    log.Println("Done.")

    var posts []platform.Post
    for _, agent := range(agent.Agents) {
        log.Printf("Generating post for user: %s", agent.Username)
        post, err := agent.GeneratePost(posts)
        if err != nil {
            log.Printf("Error generating post for user %s: %v", agent.Username, err)
        }

        fmt.Println(post)

        if post.Message != "NO_RESPONSE" {
            posts = append(posts, post)
        }
    }
}
