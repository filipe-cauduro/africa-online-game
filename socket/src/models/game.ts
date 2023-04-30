import { User } from "./user"

type Team = "A" | "B"

type Player = User & {
  team: Team
}

type Round = {
  team: Team
  leaderPlayer: Player
  score: number
  wordsScored: Word[]
  currentWord: Word
  startedAt: Date
  endsAt: Date
}

type Step = {
  stepNumber: 1 | 2 | 3
  currentTeam: Team
  rounds: Round[]
  availableWords: Word[]
}

type Word = {
  text: string
  createdBy: User
}

export type Game = {
  id: string
  players: Player[]
  steps: Step[]
  words: Word[]
}
