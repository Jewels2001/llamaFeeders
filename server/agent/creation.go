package agent

import (
        "encoding/json"
        "fmt"
        "log"

        "github.com/Jewels2001/LlamaFeeders/server/inference"
)

var Agents map[string]Agent

const FailTolerance = 20

func init() {
    Agents = make(map[string]Agent)
}

func GenerateAgents(numAgents int) error {
    num_created := 0
    num_failed := 0
    for num_created < numAgents {
        newAgent, err := CreateAgent()
        if err != nil {
            log.Printf("Error generating agent#%d: %v (failure #%d)", num_created, err, num_failed+1)
            num_failed++
            if num_failed == FailTolerance {
                return fmt.Errorf("too many failed agents")
            }
            continue
        }
        if _, ok := Agents[newAgent.Username]; ok {
            log.Println("Duplicate.")
            continue
        }
        newAgent.generateSystemPrompt()

        Agents[newAgent.Username] = newAgent
        num_failed = 0
        num_created++
    }

    return nil
}

func CreateAgent() (newAgent Agent, err error) {
        data, err := inference.GetCompletion(inference.PROMPT_AGENT_CREATION, "json")
        if err != nil {
                return
        }

        err = json.Unmarshal([]byte(data), &newAgent)
        return
}
