export interface MenuItem {
  id: number
  name: { en: string; es: string }
  price: number
  image: string
  timeOfDay: 'morning' | 'night' | 'all'
  ingredients?: string[]
  type: 'food' | 'drink'
}

export type IngredientModification = 'regular' | 'removed' | 'extra'

export interface CartItemIngredient {
  name: string
  modification: IngredientModification
}

export interface CartItem extends Omit<MenuItem, 'ingredients'> {
  quantity: number
  ingredients?: CartItemIngredient[]
  originalItemId: number // Reference to the original menu item
}

export interface CartGroup {
  baseItem: MenuItem
  modifications: CartItemIngredient[]
  quantity: number
}
