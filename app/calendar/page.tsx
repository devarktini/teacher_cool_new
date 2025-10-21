"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"
import { addDays, format } from "date-fns"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Single Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-3"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                }}
              />
              {date && (
                <p className="text-sm text-muted-foreground">
                  Selected date: {format(date, "PPP")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-md border p-3"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                }}
              />
              {dateRange.from && dateRange.to && (
                <p className="text-sm text-muted-foreground">
                  Selected range: {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
