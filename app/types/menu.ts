export interface MenuItem {
  id: number
  name: { en: string; es?: string }
  description?: { en: string; es?: string }
  price: number
  image: string
  timeOfDay: 'morning' | 'night' | 'all'
  ingredients?: {
    id: string
    name: string
    extraPrice: number
  }[]
  type: 'food' | 'drink'
}

export type IngredientModification = 'regular' | 'removed' | 'extra'

export interface CartItemIngredient {
  id: string
  name: string
  modification: IngredientModification
  extraPrice?: number
}

export interface CartItem extends Omit<MenuItem, 'ingredients'> {
  quantity: number
  ingredients?: CartItemIngredient[]
  originalItemId: number
  extraPrice?: number
}

export interface CartGroup {
  baseItem: MenuItem
  modifications: CartItemIngredient[]
  quantity: number
}
