"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, Calendar } from "lucide-react"
import { useState } from "react"

interface LockedFund {
  id: string
  name: string
  amount: string
  currency: string
  lockedUntil: string
}

const lockedFundsData: LockedFund[] = [
  {
    id: "1",
    name: "Annual Savings",
    amount: "2000",
    currency: "USDT",
    lockedUntil: "25 January, 2026",
  },
  {
    id: "2",
    name: "Just For Fun",
    amount: "500",
    currency: "USDC",
    lockedUntil: "25 January, 2026",
  },
  {
    id: "3",
    name: "Summer Savings",
    amount: "500",
    currency: "STRK",
    lockedUntil: "25 January, 2026",
  },
]

export default function LockedFundsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USDT")
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
  const [savingsGoal, setSavingsGoal] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleCommit = () => {
    console.log("[v0] Committing:", { savingsGoal, amount, dueDate, currency: selectedCurrency })
    // Add your commit logic here
    setIsCommitModalOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-8">My Locked Funds</h1>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={() => setIsCommitModalOpen(true)}
            >
              Commit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700">
                  {selectedCurrency}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setSelectedCurrency("USDT")} className="text-white hover:bg-zinc-700">
                  USDT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCurrency("USDC")} className="text-white hover:bg-zinc-700">
                  USDC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCurrency("STRK")} className="text-white hover:bg-zinc-700">
                  STRK
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedFundsData.map((fund) => (
            <Card key={fund.id} className="bg-zinc-800 border-zinc-700 p-6 flex flex-col">
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">{fund.name}</p>
                <h2 className="text-white text-3xl font-bold">
                  {fund.amount} {fund.currency}
                </h2>
              </div>

              <p className="text-gray-400 text-sm mb-6">Locked until: {fund.lockedUntil}</p>

              <Button
                variant="secondary"
                className="bg-cyan-900/40 text-cyan-400 hover:bg-cyan-900/60 border-cyan-800/50 mt-auto"
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>

        <Dialog open={isCommitModalOpen} onOpenChange={setIsCommitModalOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold border-b border-zinc-700 pb-4">
                Commit {selectedCurrency}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="savings-goal" className="text-white text-base">
                  Savings Goal
                </Label>
                <Input
                  id="savings-goal"
                  placeholder="Enter your savings title"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white text-base">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date" className="text-white text-base">
                  Enter Due Date
                </Label>
                <div className="relative">
                  <Input
                    id="due-date"
                    type="date"
                    placeholder="Set due date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <Button onClick={handleCommit} className="w-full bg-zinc-800 text-white hover:bg-zinc-700 mt-4">
                Commit {selectedCurrency}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
