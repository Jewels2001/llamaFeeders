package agent

import (
	"encoding/json"

	"github.com/Jewels2001/LlamaFeeders/server/inference"
)

type agentPersonality struct {
	Oe float64 `json:"oe"`
	Co float64 `json:"co"`
	Ex float64 `json:"ex"`
	Ag float64 `json:"ag"`
	Ne float64 `json:"ne"`
}

type Agent struct {
	Username      string           `json:"username"`
	Personality   agentPersonality `json:"personality"`
	Age           int              `json:"age"`
	Occupation    string           `json:"occupation"`
	Education     string           `json:"education"`
	Interests     []string         `json:"interests"`
	LikelihoodGen float64          `json:"likelihood_gen"`
	LikelihoodBot float64          `json:"likelihood_bot"`
	LikelihoodTop float64          `json:"lokelihood_top"`
}

func CreateAgent() (newAgent Agent, err error) {
	data, err := inference.GetCompletion(inference.PROMPT_AGENT_CREATION, "json")
	if err != nil {
		return
	}

	err = json.Unmarshal([]byte(data), &newAgent)
	return
}
