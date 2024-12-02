'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, addDays, isFriday, startOfToday } from 'date-fns'

interface TimePickerProps {
  isNightMenu: boolean
  selectedTime: string
  onChange: (time: string) => void
}

export function TimePicker({ isNightMenu, selectedTime, onChange }: TimePickerProps) {
  const [availableDays, setAvailableDays] = useState<Date[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  // Generate available days (today + next 5 business days, excluding weekends)
  useEffect(() => {
    const days: Date[] = []
    let currentDate = startOfToday()
    let daysToAdd = 0

    while (days.length < 5) { // Show next 5 business days
      const nextDate = addDays(currentDate, daysToAdd)
      const dayOfWeek = nextDate.getDay()
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(nextDate)
      }
      
      daysToAdd++
    }

    setAvailableDays(days)
    // Select first available day by default
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0])
    }
  }, [])

  // Generate available times for selected day
  useEffect(() => {
    if (!selectedDay) return

    const times: string[] = []
    const isFridaySchedule = isFriday(selectedDay)

    // Morning schedule: 8 AM to 12:45 PM (11:30 AM on Fridays)
    // Evening schedule: 5 PM to 7:30 PM (not available on Fridays)
    const scheduleStart = isNightMenu ? 17 : 8 // 5 PM or 8 AM
    const scheduleEnd = isNightMenu ? 19 : (isFridaySchedule ? 11 : 12) // 7 PM or 11/12 PM
    const scheduleEndMinutes = isNightMenu ? 30 : (isFridaySchedule ? 30 : 45) // :30 or :45

    // Don't show night menu times on Friday
    if (isFridaySchedule && isNightMenu) {
      setAvailableTimes([])
      return
    }

    // Generate times in 15-minute intervals
    for (let hour = scheduleStart; hour <= scheduleEnd; hour++) {
      const minuteEnd = hour === scheduleEnd ? scheduleEndMinutes : 59
      
      for (let minute = 0; minute <= minuteEnd; minute += 15) {
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        const displayMinute = minute.toString().padStart(2, '0')
        times.push(`${displayHour}:${displayMinute} ${ampm}`)
      }
    }

    setAvailableTimes(times)
  }, [selectedDay, isNightMenu])

  if (availableDays.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No available pickup days
      </div>
    )
  }

  const handleDaySelect = (dateStr: string) => {
    const selectedDate = availableDays.find(
      d => format(d, 'yyyy-MM-dd') === dateStr
    )
    setSelectedDay(selectedDate || null)
    onChange('') // Reset time when day changes
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Select Day:</label>
        <Select 
          value={selectedDay ? format(selectedDay, 'yyyy-MM-dd') : ''}
          onValueChange={handleDaySelect}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {availableDays.map((day) => (
              <SelectItem 
                key={format(day, 'yyyy-MM-dd')} 
                value={format(day, 'yyyy-MM-dd')}
              >
                {format(day, 'EEEE, MMM d')}
                {format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && ' (Today)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDay && (
        <div>
          <label className="text-sm font-medium mb-2 block">Select Time:</label>
          {availableTimes.length > 0 ? (
            <Select value={selectedTime} onValueChange={onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select pickup time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground">
              {isFriday(selectedDay) 
                ? "Friday pickup is available from 8:00 AM to 11:30 AM only"
                : isNightMenu 
                  ? "Dinner pickup is available from 5:00 PM to 7:30 PM"
                  : "Breakfast pickup is available from 8:00 AM to 12:45 PM"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
