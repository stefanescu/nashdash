import { MenuItem } from '../types/menu'

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: { 
      en: "Nashville Hot Chicken Sandwich",
      es: "Sándwich de Pollo Picante de Nashville"
    },
    description: { 
      en: "Crispy chicken breast with our signature hot sauce",
      es: "Pechuga de pollo crujiente con nuestra salsa picante"
    },
    price: 12.99,
    type: 'food',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'hot-sauce', name: 'Hot Sauce', extraPrice: 1.00 },
      { id: 'pickles', name: 'Pickles', extraPrice: 1.00 },
      { id: 'coleslaw', name: 'Coleslaw', extraPrice: 1.00 }
    ]
  },
  {
    id: 2,
    name: { 
      en: "Southern Breakfast Platter",
      es: "Plato de Desayuno del Sur"
    },
    description: { 
      en: "Eggs, bacon, grits, and biscuit",
      es: "Huevos, tocino, grits y bizcocho"
    },
    price: 14.99,
    type: 'food',
    timeOfDay: 'morning',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'eggs', name: 'Eggs', extraPrice: 1.00 },
      { id: 'bacon', name: 'Bacon', extraPrice: 1.00 },
      { id: 'grits', name: 'Grits', extraPrice: 1.00 },
      { id: 'biscuit', name: 'Biscuit', extraPrice: 1.00 }
    ]
  },
  {
    id: 3,
    name: { 
      en: "BBQ Pulled Pork Plate",
      es: "Plato de Cerdo Desmechado con BBQ"
    },
    description: { 
      en: "Slow-cooked pulled pork with BBQ sauce",
      es: "Cerdo desmechado cocinado a fuego lento con salsa BBQ"
    },
    price: 15.99,
    type: 'food',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'bbq-sauce', name: 'BBQ Sauce', extraPrice: 1.00 },
      { id: 'coleslaw', name: 'Coleslaw', extraPrice: 1.00 },
      { id: 'cornbread', name: 'Cornbread', extraPrice: 1.00 }
    ]
  },
  {
    id: 4,
    name: { 
      en: "Sweet Tea",
      es: "Té Dulce"
    },
    description: { 
      en: "Classic southern sweet tea",
      es: "Té dulce clásico del sur"
    },
    price: 2.99,
    type: 'drink',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'ice', name: 'Ice', extraPrice: 1.00 },
      { id: 'lemon', name: 'Lemon', extraPrice: 1.00 }
    ]
  },
  {
    id: 5,
    name: { 
      en: "Chicken and Waffles",
      es: "Pollo y Waffles"
    },
    description: { 
      en: "Crispy fried chicken on top of fluffy waffles",
      es: "Pollo frito crujiente sobre waffles esponjosos"
    },
    price: 16.99,
    type: 'food',
    timeOfDay: 'morning',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'syrup', name: 'Maple Syrup', extraPrice: 1.00 },
      { id: 'butter', name: 'Whipped Butter', extraPrice: 1.00 },
      { id: 'hot-sauce', name: 'Hot Sauce', extraPrice: 1.00 }
    ]
  },
  {
    id: 6,
    name: { 
      en: "Nashville Hot Wings",
      es: "Alitas Picantes de Nashville"
    },
    description: { 
      en: "Crispy wings tossed in our signature hot sauce",
      es: "Alitas crujientes bañadas en nuestra salsa picante"
    },
    price: 13.99,
    type: 'food',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'ranch', name: 'Ranch Dressing', extraPrice: 1.00 },
      { id: 'celery', name: 'Celery Sticks', extraPrice: 1.00 },
      { id: 'carrots', name: 'Carrot Sticks', extraPrice: 1.00 }
    ]
  },
  {
    id: 7,
    name: { 
      en: "Mac and Cheese",
      es: "Macarrones con Queso"
    },
    description: { 
      en: "Creamy three-cheese blend with crispy breadcrumbs",
      es: "Mezcla cremosa de tres quesos con pan rallado crujiente"
    },
    price: 8.99,
    type: 'food',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'bacon', name: 'Bacon Bits', extraPrice: 1.00 },
      { id: 'jalapenos', name: 'Jalapeños', extraPrice: 1.00 },
      { id: 'breadcrumbs', name: 'Extra Breadcrumbs', extraPrice: 1.00 }
    ]
  },
  {
    id: 8,
    name: { 
      en: "Fresh Lemonade",
      es: "Limonada Fresca"
    },
    description: { 
      en: "Freshly squeezed lemons with pure cane sugar",
      es: "Limones recién exprimidos con azúcar de caña pura"
    },
    price: 3.99,
    type: 'drink',
    timeOfDay: 'all',
    image: '/placeholder.svg?height=80&width=80',
    ingredients: [
      { id: 'mint', name: 'Fresh Mint', extraPrice: 1.00 },
      { id: 'strawberry', name: 'Strawberry Puree', extraPrice: 1.00 }
    ]
  }
]
