"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

type TabType = "account" | "savings" | "crypto" | "security" | "app-preference"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("account")
  const [email, setEmail] = useState("avcdefg@gmail.com")
  const [connectedAddress] = useState("0x234fs4tr4DEWF2e32refaa")
  const [preferredStablecoin, setPreferredStablecoin] = useState("usdc")
  const [defaultContribution, setDefaultContribution] = useState("5 USDC")
  const [payoutNotification, setPayoutNotification] = useState("via Email")
  const [autoDeposit, setAutoDeposit] = useState(false)
  const [language, setLanguage] = useState("en")

  const tabs = [
    { id: "account" as TabType, label: "Account" },
    { id: "savings" as TabType, label: "Savings Preference" },
    { id: "crypto" as TabType, label: "Crypto and Wallets" },
    { id: "security" as TabType, label: "Security" },
    { id: "app-preference" as TabType, label: "App Preference" },
  ]

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Connected address</Label>
                <Input value={connectedAddress} readOnly className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <Button
                variant="outline"
                className="border-dashed border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
              >
                Enable 2 Factor Authentication
              </Button>
              <Button
                variant="outline"
                className="border-dashed border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
              >
                Change Password
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Language Preference</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-fit bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Savings Preference Tab */}
        {activeTab === "savings" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-white">Default Contribution Amount</Label>
                <div className="flex items-center gap-4">
                  <span className="text-white">{defaultContribution}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashed border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
                  >
                    Change
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Payout Notifications</Label>
                <div className="flex items-center gap-4">
                  <span className="text-white">{payoutNotification}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashed border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between max-w-md">
              <Label className="text-white">Auto-Deposit</Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={autoDeposit}
                  onCheckedChange={setAutoDeposit}
                  className="data-[state=checked]:bg-cyan-500"
                />
                <span className="text-sm text-gray-400">{autoDeposit ? "ON" : "OFF"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Crypto and Wallets Tab */}
        {activeTab === "crypto" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-white">Connected address</Label>
              <Input value={connectedAddress} readOnly className="bg-gray-800/50 border-gray-700 text-white max-w-md" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Preferred Stablecoin</Label>
              <Select value={preferredStablecoin} onValueChange={setPreferredStablecoin}>
                <SelectTrigger className="w-fit bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC (multichain)</SelectItem>
                  <SelectItem value="usdt">USDT (multichain)</SelectItem>
                  <SelectItem value="dai">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800/50 bg-transparent">
              Switch Wallet
            </Button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8 max-w-3xl">
              <Button
                variant="outline"
                className="border-dashed border-gray-600 text-white hover:bg-gray-800/50 bg-transparent"
              >
                View Transaction History
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-white">Emergency Withdrawal</span>
                <Button className="bg-red-500 hover:bg-red-600 text-white">Withdraw USDC</Button>
              </div>
            </div>
          </div>
        )}

        {/* App Preference Tab */}
        {activeTab === "app-preference" && (
          <div className="space-y-8">
            <p className="text-gray-400">App preference settings coming soon...</p>
          </div>
        )}

        {/* Save Changes Button */}
        <div className="flex justify-end mt-12">
          <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8">Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
