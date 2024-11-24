package platform

import "fmt"

type Post struct {
    Author string
    Message string
}

func (p* Post) String() string {
    return fmt.Sprintf("Author: %s\n%s", p.Author, p.Message)
}
