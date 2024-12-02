'use client'

import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function OrdersButton({ isNightMode }: { isNightMode?: boolean }) {
  return (
    <Link href="/orders">
      <Button 
        variant="ghost" 
        size="sm"
        className={cn(
          "text-sm font-medium gap-2",
          isNightMode ? "text-slate-100 hover:text-slate-100 hover:bg-slate-800" : ""
        )}
      >
        <ClipboardList className="h-4 w-4" />
        View Orders
      </Button>
    </Link>
  )
}
