'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderItem {
  id: number
  name: { en: string; es: string }
  price: number
  quantity: number
  ingredients?: { id: string; name: string; modification: 'none' | 'light' | 'regular' | 'extra'; extraPrice?: number }[]
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  timestamp: number
  pickupTime: string
  status: 'pending' | 'accepted' | 'cancelled' | 'ready' | 'completed'
  language: 'en' | 'es'
}

interface OrderHistory {
  orders: Order[]
  lastCleanup: number
}

function isValidStatus(status: string): status is Order['status'] {
  return ['pending', 'accepted', 'cancelled', 'ready', 'completed'].includes(status)
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderHistory, setOrderHistory] = useState<Order[]>([])
  const [language, setLanguage] = useState<'en' | 'es'>('en')

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orders')
      const storedHistory = localStorage.getItem('orderHistory')
      
      let parsedOrders: Order[] = []
      let parsedHistory: Order[] = []

      if (storedOrders) {
        parsedOrders = JSON.parse(storedOrders)
      }

      if (storedHistory) {
        parsedHistory = JSON.parse(storedHistory)
      }

      const now = Date.now()
      const dayInMs = 24 * 60 * 60 * 1000
      
      // Only check timestamp if there are orders in history
      if (parsedHistory.length > 0 && now - parsedHistory[0].timestamp > dayInMs) {
        const sevenDaysAgo = now - (7 * dayInMs)
        parsedHistory = parsedHistory.filter(
          order => order.timestamp > sevenDaysAgo
        )
        
        localStorage.setItem('orderHistory', JSON.stringify(parsedHistory))
      }

      setOrders(parsedOrders)
      setOrderHistory(parsedHistory)
    }

    loadOrders()

    const cleanupInterval = setInterval(loadOrders, 60 * 60 * 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  const moveToHistory = (order: Order) => {
    const newOrders = orders.filter(o => o.id !== order.id)
    
    // Ensure the order status is one of the allowed types
    const validatedOrder: Order = {
      ...order,
      status: isValidStatus(order.status) ? order.status : 'pending'
    }

    // Add the new order to the beginning of the history array, ensuring orderHistory is an array
    const currentHistory = Array.isArray(orderHistory) ? orderHistory : []
    const newHistory = [validatedOrder, ...currentHistory]

    localStorage.setItem('orders', JSON.stringify(newOrders))
    localStorage.setItem('orderHistory', JSON.stringify(newHistory))
    
    setOrders(newOrders)
    setOrderHistory(newHistory)
  }

  const handleAcceptOrder = (orderId: string) => {
    const orderToUpdate = orders.find(order => order.id === orderId)
    if (orderToUpdate) {
      const updatedOrder: Order = {
        ...orderToUpdate,
        status: 'accepted' as const
      }
      moveToHistory(updatedOrder)
    }
  }

  const handleCancelOrder = (orderId: string) => {
    const orderToUpdate = orders.find(order => order.id === orderId)
    if (orderToUpdate) {
      const updatedOrder: Order = {
        ...orderToUpdate,
        status: 'cancelled' as const
      }
      moveToHistory(updatedOrder)
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  const handleClearAllOrders = () => {
    localStorage.removeItem('orders');
    localStorage.removeItem('orderHistory');
    setOrders([]);
    setOrderHistory([]);
  }

  const formatPickupDate = (dateStr: string, lang: 'en' | 'es') => {
    try {
      const date = new Date(dateStr)
      if (isToday(date)) {
        return lang === 'en' ? 'TODAY' : 'HOY'
      }
      return format(date, 'EEEE, MMMM d', {
        locale: lang === 'es' ? es : undefined
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatPickupTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return format(date, 'h:mm a')
    } catch (error) {
      return 'Invalid Time'
    }
  }

  const getStatusBadge = (status: Order['status'], language: 'en' | 'es') => {
    const statusColors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-green-500',
      cancelled: 'bg-red-500',
      ready: 'bg-orange-500',
      completed: 'bg-green-500'
    }

    const statusText = {
      pending: language === 'en' ? 'Pending' : 'Pendiente',
      accepted: language === 'en' ? 'Accepted' : 'Aceptado',
      cancelled: language === 'en' ? 'Cancelled' : 'Cancelado',
      ready: language === 'en' ? 'Ready' : 'Listo',
      completed: language === 'en' ? 'Completed' : 'Completado'
    }

    return (
      <Badge className={`${statusColors[status]} text-white`}>
        {statusText[status]}
      </Badge>
    )
  }

  const formatIngredientModification = (modification: string) => {
    switch (modification) {
      case 'extra':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2">+Extra</Badge>
      case 'light':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-2">-Light</Badge>
      case 'none':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs px-2">-None</Badge>
      case 'regular':
        return null
      default:
        return null
    }
  }

  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <motion.div 
      className="min-h-screen transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm bg-white/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-base font-semibold md:text-lg">Back to Menu</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* <AuthButton isNightMode={isNightMode} />
            <CartButton items={[]} onClick={() => {}} isNightMode={isNightMode} /> */}
          </div>
        </div>
      </header>

      <main className="container py-4 px-4 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <button
            onClick={handleClearAllOrders}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear All Orders
          </button>
        </div>

        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Order #{order.id}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pickup at {formatPickupTime(order.pickupTime)}
                      </p>
                    </div>
                    <Badge variant="secondary" className={
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                      order.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                      order.status === 'ready' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                      'bg-green-100 text-green-800 hover:bg-green-100'
                    }>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col">
                        <div className="flex justify-between items-start">
                          <span className="text-base font-medium">
                            {item.quantity}x {item.name.en}
                          </span>
                          <span className="text-base font-medium ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="pl-4 mt-1">
                            {item.ingredients
                              .filter(ing => ing.modification !== 'regular')
                              .map((ing) => (
                                <div key={ing.id} className="flex items-center text-sm text-muted-foreground">
                                  <span>{ing.name}:</span>
                                  <Badge 
                                    variant="outline" 
                                    className="ml-2 text-xs"
                                  >
                                    {ing.modification === 'none' ? 'None' : 'Extra'}
                                    {ing.modification === 'extra' && ing.extraPrice && (
                                      <span className="ml-1">
                                        (+${ing.extraPrice.toFixed(2)})
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold text-base md:text-lg">Total</span>
                    <span className="font-bold text-lg md:text-xl">
                      ${calculateOrderTotal(order).toFixed(2)}
                    </span>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex-1 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Order
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept Order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm md:text-base">No orders yet</p>
            </div>
          )}
        </div>

        <div id="order-history" className="mt-12">
          <h2 className="text-lg font-semibold mb-4 md:text-xl">Order History</h2>
          <div className="space-y-4">
            {orderHistory.length > 0 ? (
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border bg-white/50 p-4"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Order #{order.id}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {new Date(order.timestamp).toLocaleDateString()} at {formatPickupTime(order.pickupTime)}
                        </p>
                      </div>
                      <Badge variant="secondary" className={
                        order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name.en}
                          </span>
                          <span className="text-muted-foreground ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-semibold">
                        ${calculateOrderTotal(order).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm md:text-base">No order history</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  )
}
