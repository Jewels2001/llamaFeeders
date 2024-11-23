package main

import (
	"fmt"
	"log"

	"github.com/Jewels2001/LlamaFeeders/server/inference"
)

func main() {
	messages := []inference.OllamaMsg{
		{
			Role:    "user",
			Content: "Why is the sky blue?",
		},
		{
			Role:    "assistant",
			Content: "Idk bro",
		},
		{
			Role:    "user",
			Content: "Wdym you don't know?",
		},
	}

	msg, err := inference.GetChatCompletion(messages)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Message:", msg.Content)
}
