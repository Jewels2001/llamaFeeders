package platform

import "fmt"

type Post struct {
	Author  string `json:"Author"`
	Message string `json:"Message"`
	ID      int    `json:"ID"`
}

var postNum int = 0

func NewPost(author, message string) Post {
	p := Post{author, message, postNum}
	postNum++
	return p
}

func (p *Post) String() string {
	return fmt.Sprintf("Author: %s\n%s", p.Author, p.Message)
}
