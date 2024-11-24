package agent

import (
	"fmt"

	"github.com/Jewels2001/LlamaFeeders/server/inference"
	"github.com/Jewels2001/LlamaFeeders/server/platform"
)

type agentPersonality struct {
	Oe float64 `json:"oe"`
	Co float64 `json:"co"`
	Ex float64 `json:"ex"`
	Ag float64 `json:"ag"`
	Ne float64 `json:"ne"`
}

type Agent struct {
	Username         string           `json:"username"`
	Personality      agentPersonality `json:"personality"`
	Age              int              `json:"age"`
	PoliticalLeaning string           `json:"politicalLeaning"`
	Occupation       string           `json:"occupation"`
	Education        string           `json:"education"`
	Interests        []string         `json:"interests"`
	LikelihoodGen    float64          `json:"likelihood_gen"`
	LikelihoodBot    float64          `json:"likelihood_bot"`
	LikelihoodTop    float64          `json:"lokelihood_top"`
	systemPrompt     string
}

func (a *Agent) generateSystemPrompt() error {
	var listOfInterests string
	for _, interest := range a.Interests {
		listOfInterests += interest + ", "
	}
	listOfInterests = listOfInterests[:len(listOfInterests)-2]

	a.systemPrompt = fmt.Sprintf(inference.PROMPT_AGENT_SYSTEM,
		a.Username,
		a.Age,
		a.PoliticalLeaning,
		a.Occupation,
		a.Education,
		listOfInterests,
		a.Personality.Oe,
		a.Personality.Co,
		a.Personality.Ex,
		a.Personality.Ag,
		a.Personality.Ne,
		a.LikelihoodGen,
		a.LikelihoodBot,
		a.LikelihoodTop,
	)

	return nil
}

func (a *Agent) GeneratePost(postContext []platform.Post) (platform.Post, error) {
	var postsText string
	for _, post := range postContext {
		postsText += "\n" + post.String()
	}

	context := []inference.OllamaMsg{
		{Role: "system", Content: a.systemPrompt},
		{Role: "user", Content: fmt.Sprintf(inference.PROMPT_AGENT_POST_FORMAT, postsText)},
	}
    // log.Println("CONTEXT:", context)

	msg, err := inference.GetChatCompletion(context)
	if err != nil {
		return platform.Post{}, err
	}
    
	//TODO: Post chance

	return platform.Post{
		Author:  a.Username,
		Message: msg.Content,
	}, nil
}
