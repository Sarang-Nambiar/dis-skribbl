package user

// Frontend avatar info
type AvatarInfo struct {
	ColorIdx int `json:"colorIdx"`
	EyesIdx  int `json:"eyesIdx"`
	MouthIdx int `json:"mouthIdx"`
}

type User struct {
	Name   string `json:"name"`
	Score  int
	Avatar AvatarInfo `json:"avatar"`
}
