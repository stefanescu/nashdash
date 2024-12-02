'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, ArrowLeft } from 'lucide-react'
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
  status: 'pending' | 'ready' | 'completed'
  language: 'en' | 'es'
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [language, setLanguage] = useState<'en' | 'es'>('en')

  useEffect(() => {
    // Load orders from localStorage and filter out expired ones
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
      const currentTime = Date.now()
      const validOrders = storedOrders.filter(order => {
        const orderAge = currentTime - order.timestamp
        return orderAge < 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      })
      
      if (validOrders.length !== storedOrders.length) {
        localStorage.setItem('orders', JSON.stringify(validOrders))
      }
      
      setOrders(validOrders)
    }

    loadOrders()
    // Check for expired orders every minute
    const interval = setInterval(loadOrders, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const handleAcceptOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
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
      ready: 'bg-orange-500',
      completed: 'bg-green-500'
    }

    const statusText = {
      pending: language === 'en' ? 'Pending' : 'Pendiente',
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

  return (
    <motion.div 
      className="min-h-screen p-4 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Menu
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center p-6">
            <p className="text-muted-foreground">No orders yet</p>
            <Link href="/" className="text-primary hover:underline mt-2 block">
              Place your first order
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="relative">
                <CardHeader>
                  <CardTitle>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {formatPickupDate(order.pickupTime, language)}
                        </div>
                        <div className="text-lg text-primary">
                          {formatPickupTime(order.pickupTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Total</div>
                        <div className="text-xl font-bold">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={`${order.id}-${itemIndex}`} className="flex flex-col border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-lg">
                            {item.quantity}x {item.name[language]}
                          </div>
                          <div className="font-medium ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="space-y-1.5 pl-4">
                            {item.ingredients
                              .filter(ing => ing.modification !== 'regular')
                              .map((ing, index) => (
                                <div key={`${order.id}-${itemIndex}-${index}`} 
                                     className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="min-w-[120px]">{ing.name}</span>
                                  {formatIngredientModification(ing.modification)}
                                  {ing.extraPrice && ing.modification === 'extra' && (
                                    <span className="text-xs text-muted-foreground">
                                      (+${(ing.extraPrice * item.quantity).toFixed(2)})
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4">
                  <div>
                    {getStatusBadge(order.status, language)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={order.status !== 'pending'}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
