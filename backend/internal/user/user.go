package user

// Frontend avatar info
type AvatarInfo struct {
	colorIdx int
	eyesIdx  int
	mouthIdx int
}

type User struct {
	name       string
	score      int
	avatarInfo AvatarInfo
}
