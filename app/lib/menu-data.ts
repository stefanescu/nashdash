import { MenuItem } from '../types/menu'

export const menuItems: MenuItem[] = [
  // Morning Menu Items
  { 
    id: 1, 
    name: { en: 'Breakfast Burrito', es: 'Burrito de Desayuno' }, 
    price: 8.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'morning',  // For order categorization, not availability
    ingredients: ['Eggs', 'Cheese', 'Bacon', 'Potatoes', 'Salsa'], 
    type: 'food' 
  },
  { 
    id: 2, 
    name: { en: 'Avocado Toast', es: 'Tostada de Aguacate' }, 
    price: 7.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'morning', 
    ingredients: ['Avocado', 'Bread', 'Tomatoes', 'Feta Cheese', 'Olive Oil'], 
    type: 'food' 
  },
  { 
    id: 3, 
    name: { en: 'Pancakes', es: 'Panqueques' }, 
    price: 6.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'morning', 
    ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Maple Syrup'], 
    type: 'food' 
  },
  { 
    id: 4, 
    name: { en: 'French Toast', es: 'Pan Francés' }, 
    price: 7.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'morning', 
    ingredients: ['Bread', 'Eggs', 'Milk', 'Cinnamon', 'Vanilla'], 
    type: 'food' 
  },

  // Night Menu Items
  { 
    id: 5, 
    name: { en: 'Nashville Hot Chicken', es: 'Pollo Picante de Nashville' }, 
    price: 12.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'night', 
    ingredients: ['Chicken', 'Hot Spices', 'Pickles', 'Coleslaw', 'Ranch'], 
    type: 'food' 
  },
  { 
    id: 6, 
    name: { en: 'BBQ Pulled Pork', es: 'Cerdo Desmenuzado BBQ' }, 
    price: 11.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'night', 
    ingredients: ['Pork', 'BBQ Sauce', 'Coleslaw', 'Pickles', 'Bun'], 
    type: 'food' 
  },
  { 
    id: 7, 
    name: { en: 'Southern Fried Catfish', es: 'Bagre Frito Sureño' }, 
    price: 13.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'night', 
    ingredients: ['Catfish', 'Cornmeal', 'Remoulade', 'Lemon', 'Herbs'], 
    type: 'food' 
  },

  // Drinks (Can be ordered with either menu)
  { 
    id: 8, 
    name: { en: 'Sweet Tea', es: 'Té Dulce' }, 
    price: 2.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'all',  // Drinks can be ordered with either menu
    type: 'drink' 
  },
  { 
    id: 9, 
    name: { en: 'Lemonade', es: 'Limonada' }, 
    price: 2.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'all', 
    type: 'drink' 
  },
  { 
    id: 10, 
    name: { en: 'Coffee', es: 'Café' }, 
    price: 2.49, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'all', 
    type: 'drink' 
  },
  { 
    id: 11, 
    name: { en: 'Craft Beer', es: 'Cerveza Artesanal' }, 
    price: 5.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'all',  // Changed to 'all' since it can be ordered with any food
    type: 'drink' 
  },
  { 
    id: 12, 
    name: { en: 'House Wine', es: 'Vino de la Casa' }, 
    price: 6.99, 
    image: '/placeholder.svg?height=80&width=80', 
    timeOfDay: 'all',  // Changed to 'all' since it can be ordered with any food
    type: 'drink' 
  }
]
