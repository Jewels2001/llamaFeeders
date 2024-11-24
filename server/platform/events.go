package platform

import (
	"log"

	"github.com/Jewels2001/LlamaFeeders/server/inference"
)

func GenerateEventPost() (Post, error) {
    messages := []inference.OllamaMsg{
        {Role: "system", Content: inference.PROMPT_EVENT_GENERATION},
        {Role: "user", Content: "Generate an event like in your instructions."},
    }
    log.Println("EVENT:", messages)

    msg, err := inference.GetChatCompletion(messages)
    if err != nil {
        return Post{}, err
    }

    return NewPost("LLAMANEWS", msg.Content), nil
}
