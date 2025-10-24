"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X, UserCircle2 } from "lucide-react"
import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { connectors, connect } = useConnect()
  const { address, isConnected } = useAccount()

  const handleConnect = async (connector: any) => {
    try {
      connect({ connector })
      setIsOpen(false)
      // Navigate to dashboard after successful connection
      router.push("/dashboard")
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Ahjoor Logo" className="h-16 w-auto" />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-white hover:text-gray-300 transition-colors font-medium">
            Home
          </a>
          <a href="#how-it-works" className="text-white hover:text-gray-300 transition-colors font-medium">
            How It Works
          </a>
          <a href="#features" className="text-white hover:text-gray-300 transition-colors font-medium">
            Features
          </a>
          <a href="#faqs" className="text-white hover:text-gray-300 transition-colors font-medium">
            FAQs
          </a>
        </div>

        {isConnected && address ? (
          <ProfileBar address={address} />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2.5 border border-white rounded-lg font-medium text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            Get Started
          </button>
        )}
      </div>

      <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-zinc-900 p-6 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold text-white">Connect Wallet</Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <X />
                </button>
              </Dialog.Close>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Choose a wallet to continue to your decentralized savings circle.
            </p>

            <div className="space-y-3 flex flex-col">
              {connectors.map((connector: any) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  {connector.name}
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  )
}

function ProfileBar({ address }: { address: string }) {
  const { disconnect } = useDisconnect()

  return (
    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-white/20 bg-white/5">
      <UserCircle2 className="w-5 h-5 text-white" />
      <span className="text-sm text-white font-medium">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
      >
        Disconnect
      </button>
    </div>
  )
}