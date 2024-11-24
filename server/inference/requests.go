package inference

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

type OllamaMsg struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ollamaChatReq struct {
	Model    string      `json:"model"`
	Messages []OllamaMsg `json:"messages"`
	Stream   bool        `json:"stream"`
}

type ollamaChatResp struct {
	Model     string    `json:"model"`
	CreatedAt string    `json:"created_at"`
	Message   OllamaMsg `json:"message"`
}

type ollamaGenReq struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type ollamaGenResp struct {
	Model     string `json:"model"`
	CreatedAt string `json:"created_at"`
	Response  string `json:"response"`
}

const ollamaURL = "http://195.242.13.195:8080/api/"

func GetChatCompletion(messages []OllamaMsg) (*OllamaMsg, error) {
	newReq := ollamaChatReq{
		Model:    "llama3.2",
		Messages: messages,
		Stream:   false,
	}
	body, err := json.Marshal(newReq)
	if err != nil {
		return nil, err
	}
    // log.Println("MESSAGES:", string(body))

	r, err := http.NewRequest("POST", ollamaURL+"chat/", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	r.Header.Add("Content-Type", "application/json")

	client := http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	log.Println("Inference request:", res.Status)

	var resp ollamaChatResp
	if err = json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return nil, err
	}

	return &resp.Message, nil
}

func GetCompletion(prompt string, format string) (string, error) {
	newReq := ollamaGenReq{
		Model:  "llama3.2",
		Prompt: prompt,
		Stream: false,
	}
	body, err := json.Marshal(newReq)
	if err != nil {
		return "", err
	}
    // log.Println("PROMPT:", prompt)

	r, err := http.NewRequest("POST", ollamaURL+"generate/", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}
	r.Header.Add("Content-Type", "application/json")

	client := http.Client{}
	res, err := client.Do(r)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	log.Println("Inference request:", res.Status)

	var resp ollamaGenResp
	if err = json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return "", err
	}
    // log.Println("RESP:", resp.Response)

	return resp.Response, nil
}
