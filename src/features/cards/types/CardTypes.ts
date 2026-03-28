import { Currency } from '../../accounts/types/AccountTypes'

export { Currency }

export enum CardCategory {
  Credit = 'Credit',
  Debit = 'Debit',
}

export enum CardType {
  Visa = 'Visa',
  Mastercard = 'Mastercard',
  AmericanExpress = 'AmericanExpress',
  Discover = 'Discover',
}

export interface Card {
  id: string
  name: string
  cardCategory: CardCategory
  cardType: CardType
  last4Digits: string
  expiryDate: string
  currency: Currency
  color: string
  creditLimit: number | null
  linkedAccountId: string | null
  isArchived: boolean
  createdAt: string
}

export interface CreateCardRequest {
  name: string
  cardCategory: CardCategory
  cardType: CardType
  last4Digits: string
  expiryDate: string
  currency: Currency
  color: string
  creditLimit?: number | null
  linkedAccountId?: string | null
}

export interface UpdateCardRequest {
  name: string
  cardType: CardType
  last4Digits: string
  expiryDate: string
  currency: Currency
  color: string
  creditLimit?: number | null
  linkedAccountId?: string | null
}

export const CARD_CATEGORY_LABELS: Record<CardCategory, string> = {
  [CardCategory.Credit]: 'Credit',
  [CardCategory.Debit]: 'Debit',
}

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  [CardType.Visa]: 'Visa',
  [CardType.Mastercard]: 'Mastercard',
  [CardType.AmericanExpress]: 'Amex',
  [CardType.Discover]: 'Discover',
}

export const CARD_COLORS = [
  '#1a1a2e',
  '#16213e',
  '#0f3460',
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#dc2626',
  '#ea580c',
  '#0891b2',
  '#374151',
]
