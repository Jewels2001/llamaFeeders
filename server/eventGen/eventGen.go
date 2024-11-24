package eventGen


import (
	"fmt"
	"log"

	"github.com/Jewels2001/LlamaFeeders/server/inference"
)

const EVENT_PROMPT = `
You are LLAMANEWS, an all-seeing reporter on news. 
You have no biases and report fictional yet realistic events as if they were true. 
The category is not important. 
You are reporting on these events in real-time to a social media feed. 
You are a native speaker of the English language and will report on events in English. 


- DO NOT mention LLAMANEWS in your post
- DO NOT describe your task in the generated texts.
- DO NOT provide a perspective in the content.
- All generated texts MUST be short (up to 200 characters).
`

const PROMPT = `
Describe a new event OR give an update on an existing event.
`


func EventGen() (string, error) {
	messages := []inference.OllamaMsg{
		{
			Role:    "system",
			Content: EVENT_PROMPT,
		},
		{
			Role:    "user",
			Content: PROMPT + "## END TEXT",
		},
	}

	msg, err := inference.GetChatCompletion(messages)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Message:", msg.Content)
	return msg.Content, nil
}