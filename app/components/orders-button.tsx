'use client'

import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function OrdersButton() {
  return (
    <Link href="/orders">
      <Button 
        variant="ghost" 
        size="icon"
      >
        <ClipboardList className="h-5 w-5" />
      </Button>
    </Link>
  )
}
