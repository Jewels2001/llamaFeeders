package inference

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type OllamaMsg struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ollamaResp struct {
	Model     string    `json:"model"`
	CreatedAt string    `json:"created_at"`
	Message   OllamaMsg `json:"message"`
	// Done bool `json:"done"`
}

type ollamaReq struct {
	Model    string      `json:"model"`
	Messages []OllamaMsg `json:"messages"`
	Stream   bool        `json:"stream"`
}

const ollamaURL = "http://195.242.13.195:8080/api/chat"

func GetChatCompletion(messages []OllamaMsg) (*OllamaMsg, error) {
	newReq := ollamaReq{
		Model:    "llama3.2",
		Messages: messages,
		Stream:   false,
	}
	body, err := json.Marshal(newReq)
	if err != nil {
		return nil, err
	}
	fmt.Println("Req Body:", string(body))

	r, err := http.NewRequest("POST", ollamaURL, bytes.NewBuffer(body))
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
	fmt.Println("Request:", res.Status)

	var resp ollamaResp
	if err = json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return nil, err
	}
	fmt.Println("resp:", resp)

	return &resp.Message, nil
}
