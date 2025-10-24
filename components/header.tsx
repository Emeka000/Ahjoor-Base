"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X, UserCircle2 } from "lucide-react"
import { useState } from "react"
import { useConnect, useAccount, type Connector, useDisconnect } from "@starknet-react/core"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const { connectors, connectAsync } = useConnect()

  const { account, isConnected } = useAccount()

  const handleConnect = async (connector: Connector) => {
    await connectAsync({ connector })
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 z-10 left-64 right-0 border-b border-white/10 bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-end">
        {isConnected && account ? (
          <ProfileBar address={account.address} />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2.5 border border-white rounded-lg font-medium text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            Connect Wallet
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

            <div className="space-y-3">
              {connectors.map((connector) => (
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
