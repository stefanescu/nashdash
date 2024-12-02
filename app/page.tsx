'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Sun, Moon, ShoppingCart, Utensils, Beer, X, Plus, Minus, ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

interface MenuItem {
  id: number
  name: { en: string; es: string }
  price: number
  image: string
  timeOfDay: 'morning' | 'night' | 'all'
  ingredients?: string[]
  type: 'food' | 'drink'
}

const menuItems: MenuItem[] = [
  { id: 1, name: { en: 'Breakfast Burrito', es: 'Burrito de Desayuno' }, price: 8.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'morning', ingredients: ['Eggs', 'Cheese', 'Bacon', 'Potatoes', 'Salsa'], type: 'food' },
  { id: 2, name: { en: 'Avocado Toast', es: 'Tostada de Aguacate' }, price: 7.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'morning', ingredients: ['Avocado', 'Bread', 'Tomatoes', 'Feta Cheese', 'Olive Oil'], type: 'food' },
  { id: 3, name: { en: 'Pancakes', es: 'Panqueques' }, price: 6.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'morning', ingredients: ['Flour', 'Milk', 'Eggs', 'Butter', 'Maple Syrup'], type: 'food' },
  { id: 4, name: { en: 'Nashville Hot Chicken', es: 'Pollo Picante de Nashville' }, price: 12.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', ingredients: ['Chicken', 'Spices', 'Bread', 'Pickles', 'Coleslaw'], type: 'food' },
  { id: 5, name: { en: 'BBQ Pulled Pork Sandwich', es: 'Sándwich de Cerdo Desmenuzado BBQ' }, price: 10.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', ingredients: ['Pork', 'BBQ Sauce', 'Bun', 'Onions', 'Pickles'], type: 'food' },
  { id: 6, name: { en: 'Grilled Salmon', es: 'Salmón a la Parrilla' }, price: 14.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', ingredients: ['Salmon', 'Lemon', 'Herbs', 'Asparagus', 'Rice'], type: 'food' },
  { id: 7, name: { en: 'Coca-Cola', es: 'Coca-Cola' }, price: 2.49, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 8, name: { en: 'Iced Tea', es: 'Té Helado' }, price: 1.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 9, name: { en: 'Lemonade', es: 'Limonada' }, price: 2.29, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 10, name: { en: 'Bottled Water', es: 'Agua Embotellada' }, price: 1.49, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 11, name: { en: 'Espresso', es: 'Café Espresso' }, price: 2.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 12, name: { en: 'Cappuccino', es: 'Capuchino' }, price: 3.49, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
  { id: 13, name: { en: 'Craft Beer', es: 'Cerveza Artesanal' }, price: 5.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', type: 'drink' },
  { id: 14, name: { en: 'Margarita', es: 'Margarita' }, price: 7.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', type: 'drink' },
  { id: 15, name: { en: 'Mojito', es: 'Mojito' }, price: 6.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'night', type: 'drink' },
  { id: 16, name: { en: 'Orange Juice', es: 'Jugo de Naranja' }, price: 2.99, image: '/placeholder.svg?height=80&width=80', timeOfDay: 'all', type: 'drink' },
]

const styleOptions = [
  { name: 'Default', splash: 'bg-gradient-to-br from-purple-600 to-indigo-800', menu: 'bg-gray-100' },
  { name: 'Sunset', splash: 'bg-gradient-to-br from-orange-400 to-pink-600', menu: 'bg-amber-50' },
  { name: 'Ocean', splash: 'bg-gradient-to-br from-blue-400 to-teal-500', menu: 'bg-blue-50' },
  { name: 'Forest', splash: 'bg-gradient-to-br from-green-500 to-emerald-700', menu: 'bg-green-50' },
  { name: 'Midnight', splash: 'bg-gradient-to-br from-gray-900 to-blue-900', menu: 'bg-gray-900' },
]

type IngredientState = 'regular' | 'remove' | 'extra'

export default function Menu() {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [showSplash, setShowSplash] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('hasVisited') === 'true'
      setShowSplash(!hasVisited)
    }
  }, [])

  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'night'>('morning')
  const [showDrinks, setShowDrinks] = useState(false)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [currentStyle, setCurrentStyle] = useState(0)
  const [ingredientStates, setIngredientStates] = useState<{ [key: string]: IngredientState }>({})
  const [showCheckout, setShowCheckout] = useState(false)
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const controls = useAnimation()
  const totalRef = useRef<HTMLSpanElement>(null)

  const cartItems = Object.entries(quantities).filter(([_, quantity]) => quantity > 0)
  const totalItems = cartItems.reduce((sum, [_, quantity]) => sum + quantity, 0)
  const totalPrice = cartItems.reduce((sum, [id, quantity]) => {
    const item = menuItems.find(item => item.id === parseInt(id))!
    return sum + item.price * quantity
  }, 0)

  const handleLanguageSelect = (selectedLanguage: 'en' | 'es') => {
    setLanguage(selectedLanguage)
    setShowSplash(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasVisited', 'true')
    }
  }

  const updateQuantity = (id: number, delta: number) => {
    const item = menuItems.find(item => item.id === id)
    if (!item) return

    const currentCartTimeOfDay = Object.keys(quantities).length > 0
      ? menuItems.find(item => quantities[item.id] > 0)?.timeOfDay
      : null

    if (currentCartTimeOfDay && item.timeOfDay !== 'all' && item.timeOfDay !== currentCartTimeOfDay) {
      setErrorMessage(language === 'en'
        ? `You can't mix ${currentCartTimeOfDay} and ${item.timeOfDay} items in the same order.`
        : `No puedes mezclar artículos de ${currentCartTimeOfDay === 'morning' ? 'mañana' : 'noche'} y ${item.timeOfDay === 'morning' ? 'mañana' : 'noche'} en el mismo pedido.`
      )
      return
    }

    const foodCount = Object.entries(quantities).reduce((sum, [id, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(id))
      return item?.type === 'food' ? sum + quantity : sum
    }, 0)

    const drinkCount = Object.entries(quantities).reduce((sum, [id, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(id))
      return item?.type === 'drink' ? sum + quantity : sum
    }, 0)

    setQuantities((prev) => {
      const newQuantity = Math.max(0, Math.min((prev[id] || 0) + delta, 10))
      if (newQuantity === 0) {
        const { [id]: _, ...rest } = prev
        return Object.keys(rest).length === 0 ? {} : rest
      }
      return { ...prev, [id]: newQuantity }
    })
    setFlashColor(delta > 0 ? 'green' : 'red')
    if (totalRef.current) {
      totalRef.current.classList.add('animate-pulse', 'scale-110')
      setTimeout(() => {
        if (totalRef.current) {
          totalRef.current.classList.remove('animate-pulse', 'scale-110')
        }
      }, 300)
    }
    setTimeout(() => setFlashColor(null), 2000)
  }

  const filteredItems = menuItems.filter(item => 
    (showDrinks && item.timeOfDay === 'all' || item.timeOfDay === 'night') || 
    (!showDrinks && item.timeOfDay === timeOfDay)
  )

  const handleImageClick = (image: string) => {
    setEnlargedImage(image)
  }

  const handleSwipe = (direction: number) => {
    if (direction > 0 && timeOfDay === 'morning') {
      setTimeOfDay('night')
    } else if (direction < 0 && timeOfDay === 'night') {
      setTimeOfDay('morning')
    }
  }

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x)
    }
  }

  const cycleIngredientState = (itemId: number, ingredient: string) => {
    const key = `${itemId}-${ingredient}`
    setIngredientStates((prev) => {
      const currentState = prev[key] || 'regular'
      const nextState: IngredientState = 
        currentState === 'regular' ? 'remove' :
        currentState === 'remove' ? 'extra' : 'regular'
      return { ...prev, [key]: nextState }
    })
  }

  const getIngredientState = (itemId: number, ingredient: string): IngredientState => {
    return ingredientStates[`${itemId}-${ingredient}`] || 'regular'
  }

  const handleCheckout = () => {
    if (totalItems > 0) {
      setShowCheckout(true)
    }
  }

  const submitOrder = () => {
    if (typeof window === 'undefined') return;

    const order = {
      id: Date.now().toString(),
      items: cartItems.map(([id, quantity]) => {
        const item = menuItems.find(item => item.id === parseInt(id))!
        return {
          id: parseInt(id),
          name: item.name,
          price: item.price,
          quantity,
          ingredients: Object.entries(ingredientStates)
            .filter(([key]) => key.startsWith(`${id}-`))
            .reduce((acc: { [key: string]: IngredientState }, [key, state]) => {
              const ingredient = key.split('-')[1]
              acc[ingredient] = state
              return acc
            }, {})
        }
      }),
      total: totalPrice,
      timestamp: Date.now(),
      language
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]))
      
      // Reset cart and close modal
      setQuantities({})
      setIngredientStates({})
      setShowCheckout(false)

      // Show success toast
      toast({
        title: language === 'en' ? 'Order Sent!' : '¡Pedido Enviado!',
        description: language === 'en' 
          ? 'Your order has been sent to the kitchen.'
          : 'Tu pedido ha sido enviado a la cocina.',
        duration: 3000
      })
    } catch (error) {
      console.error('Error saving order:', error)
      toast({
        variant: "destructive",
        title: language === 'en' ? 'Error' : 'Error',
        description: language === 'en'
          ? 'Failed to send order. Please try again.'
          : 'Error al enviar el pedido. Por favor, inténtalo de nuevo.',
        duration: 3000
      })
    }
  }

  const clearCart = () => {
    setQuantities({})
    setShowCheckout(false)
  }

  const LanguageButtons = () => (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        size="sm"
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
      >
        English
      </Button>
      <Button
        size="sm"
        variant={language === 'es' ? 'default' : 'outline'}
        onClick={() => setLanguage('es')}
      >
        Español
      </Button>
    </div>
  )

  if (showSplash) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${styleOptions[currentStyle].splash} text-white`}>
        <motion.div
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration:  0.5 }}
          >
            NashDash
          </motion.h1>
          <motion.p
            className="text-2xl mb-8 text-center"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Nashville's Finest Cuisine
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={() => handleLanguageSelect('en')}
              variant="secondary"
              size="lg"
              className="text-lg font-semibold px-8 py-3 bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageSelect('es')}
              variant="secondary"
              size="lg"
              className="text-lg font-semibold px-8 py-3 bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300"
            >
              Español
            </Button>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {styleOptions.map((style, index) => (
            <Button
              key={style.name}
              size="sm"
              variant="outline"
              className={`w-8 h-8 rounded-full ${style.splash.split(' ')[1]} ${style.splash.split(' ')[2]}`}
              onClick={() => setCurrentStyle(index)}
            />
          ))}
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <motion.div
        className={`min-h-screen p-4 ${styleOptions[currentStyle].menu}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setShowCheckout(false)} className="mr-2">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                {language === 'en' ? 'Checkout' : 'Pagar'}
                <LanguageButtons />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map(([id, quantity]) => {
                  const item = menuItems.find(item => item.id === parseInt(id))
                  if (!item) return null
                  return (
                    <div key={id} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <div className="flex-grow">
                          <p className="font-semibold">{item.name[language]}</p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} x {quantity} = ${(item.price * quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -quantity)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.ingredients && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold mb-1">{language === 'en' ? 'Ingredients:' : 'Ingredientes:'}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.map((ingredient) => {
                              const state = getIngredientState(item.id, ingredient)
                              return (
                                <Badge
                                  key={ingredient}
                                  variant="outline"
                                  className={`cursor-pointer ${
                                    state === 'remove' ? 'bg-red-100 text-red-800' :
                                    state === 'extra' ? 'bg-green-100 text-green-800' :
                                    ''
                                  }`}
                                  onClick={() => cycleIngredientState(item.id, ingredient)}
                                >
                                  {state === 'remove' && <Minus className="w-3 h-3 mr-1" />}
                                  {ingredient}
                                  {state === 'extra' && <Plus className="w-3 h-3 ml-1" />}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold">
                    <p>{language === 'en' ? 'Total' : 'Total'}</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full">
                <Label htmlFor="name">{language === 'en' ? 'Name' : 'Nombre'}</Label>
                <Input id="name" placeholder={language === 'en' ? "Enter your name" : "Ingrese su nombre"} />
              </div>
              <Button className="w-full" disabled={totalItems === 0}>
                {language === 'en' ? 'Place Order' : 'Realizar Pedido'}
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                {language === 'en' ? 'Clear Cart' : 'Vaciar Carrito'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key="menu"
      className={`min-h-screen p-4 transition-colors duration-500 ${styleOptions[currentStyle].menu} ${
        timeOfDay === 'night' ? 'text-white' : 'text-gray-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTimeOfDay(timeOfDay === 'morning' ? 'night' : 'morning')}
            >
              {timeOfDay === 'morning' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <span className={`text-xs ${timeOfDay === 'morning' ? 'text-yellow-500 font-bold' : ''}`}>7am-11am</span>
            <span className={`text-xs ${timeOfDay === 'night' ? 'text-blue-500 font-bold' : ''}`}>5pm-7pm</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleCheckout}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  {totalItems}
                </span>
              )}
            </Button>
            <Link href="/orders">
              <Button variant="outline" className="flex gap-2 items-center">
                <ArrowLeft className="h-5 w-5" />
                {language === 'en' ? 'Admin' : 'Admin'}
              </Button>
            </Link>
          </div>
        </div>

        <LanguageButtons />

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{language === 'en' ? 'Error' : 'Error'}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {showDrinks ? (
            <motion.div
              key="drinks"
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 rounded-lg shadow-md ${
                timeOfDay === 'night' ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col items-center p-2 rounded-lg bg-opacity-50 backdrop-blur-md"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-24 h-32 object-cover rounded-md mb-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(item.image)}
                  />
                  <h3 className="font-semibold text-center">{item.name[language]}</h3>
                  <p className={`${timeOfDay === 'night' ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={!quantities[item.id]}
                    >
                      -
                    </Button>
                    <span className="mx-2 min-w-[1.5rem] text-center">{quantities[item.id] || 0}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="food"
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`rounded-lg shadow-md p-4 ${
                    timeOfDay === 'night' ? 'bg-gray-800' : 'bg-white'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-20 h-20 object-cover rounded-md mr-4 cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleImageClick(item.image)}
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name[language]}</h3>
                      <p className={`${timeOfDay === 'night' ? 'text-gray-300' : 'text-gray-600'}`}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={!quantities[item.id]}
                      >
                        -
                      </Button>
                      <span className="mx-2 min-w-[1.5rem] text-center">{quantities[item.id] || 0}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {item.ingredients && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold mb-1">{language === 'en' ? 'Ingredients:' : 'Ingredientes:'}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ingredient) => {
                          const state = getIngredientState(item.id, ingredient)
                          return (
                            <Badge
                              key={ingredient}
                              variant="outline"
                              className={`cursor-pointer ${
                                state === 'remove' ? 'bg-red-100 text-red-800' :
                                state === 'extra' ? 'bg-green-100 text-green-800' :
                                ''
                              }`}
                              onClick={() => cycleIngredientState(item.id, ingredient)}
                            >
                              {state === 'remove' && <Minus className="w-3 h-3 mr-1" />}
                              {ingredient}
                              {state === 'extra' && <Plus className="w-3 h-3 ml-1" />}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCheckout && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                className="bg-card max-w-md w-full p-6 rounded-lg shadow-xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Review Order' : 'Revisar Pedido'}
                </h2>
                <div className="space-y-4">
                  {cartItems.map(([id, quantity]) => {
                    const item = menuItems.find(item => item.id === parseInt(id))
                    const itemTotal = item.price * quantity
                    return (
                      <div key={id} className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{quantity}x {item.name[language]}</div>
                          {item.ingredients && Object.entries(ingredientStates)
                            .filter(([key]) => key.startsWith(`${id}-`))
                            .map(([key, state]) => {
                              const ingredient = key.split('-')[1]
                              return (
                                <div key={key} className="text-sm text-muted-foreground ml-4">
                                  {state === 'remove' && '- '}
                                  {state === 'extra' && '+ '}
                                  {ingredient}
                                </div>
                              )
                            })}
                        </div>
                        <div className="font-medium">${itemTotal.toFixed(2)}</div>
                      </div>
                    )
                  })}
                  <div className="border-t pt-4 flex justify-between items-center font-bold">
                    <span>{language === 'en' ? 'Total' : 'Total'}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                  >
                    {language === 'en' ? 'Cancel' : 'Cancelar'}
                  </Button>
                  <Button
                    onClick={submitOrder}
                  >
                    {language === 'en' ? 'Place Order' : 'Realizar Pedido'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {enlargedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEnlargedImage(null)}
            >
              <motion.img
                src={enlargedImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              <Button
                className="absolute top-4 right-4"
                size="icon"
                variant="ghost"
                onClick={() => setEnlargedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-2">
          {styleOptions.map((style, index) => (
            <Button
              key={style.name}
              size="sm"
              variant="outline"
              className={`w-8 h-8 rounded-full ${style.menu.split(' ')[1]}`}
              onClick={() => setCurrentStyle(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}