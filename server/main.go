package main

import (
	"fmt"
	"log"
  
  "github.com/Jewels2001/LlamaFeeders/server/agent"
	// "github.com/Jewels2001/LlamaFeeders/server/inference"
	"github.com/Jewels2001/LlamaFeeders/server/eventGen"
)

func main() {
	// event_msg, err = eventGen.EventGen()
    newAgent, err := agent.CreateAgent()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Agent:", newAgent)
}