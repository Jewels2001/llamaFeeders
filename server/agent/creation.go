package agent

import (
    "fmt"
    "log"
)

var Agents []Agent

const FailTolerance = 20

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
    
        Agents = append(Agents, newAgent)
        num_failed = 0
        num_created++
    }

    return nil
}
