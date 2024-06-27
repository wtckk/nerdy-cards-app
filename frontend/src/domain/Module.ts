import { Profile } from './User'

type ModulesType = 'My' | 'New'

interface Module {
  id: string
  title: string
  description: string
  profile: Profile
  createdAt: Date
  updatedAt: Date
  isPublic: Boolean
  cardCount: number

  cards?: Card[]
}

interface Card {
  id: string
  term: string
  definition: string
  position: number
  isLearned?: boolean
}

interface progressCard {
  cardId: string
  isLearned: boolean
}

export { Module, Card, progressCard, ModulesType }
