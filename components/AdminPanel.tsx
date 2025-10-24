"use client"

import { useState } from "react"
import { useContract, useSendTransaction, useAccount } from "@starknet-react/core"
import { ROSCA_ABI } from "@/constants/abi"
import { CONTRACT_ADDRESS, USDC_TOKEN_ADDRESS, STRK_TOKEN_ADDRESS } from "@/constants"

export default function AdminPanel() {
  const { account, address } = useAccount()
  const [isRegistering, setIsRegistering] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [newOwner, setNewOwner] = useState<string>("")
  const { sendAsync } = useSendTransaction({ calls: [] })
  
  const { contract } = useContract({
    abi: ROSCA_ABI,
    address: CONTRACT_ADDRESS,
  })

  const registerToken = async (tokenAddress: string, tokenName: string) => {
    if (!contract || !account) {
      alert("Please connect your wallet first")
      return
    }

    try {
      setIsRegistering(true)
      setStatus(`Registering ${tokenName}...`)

      // Check if you're the owner (with better address normalization)
      const ownerAddress = await contract.owner()
      const normalizeAddress = (addr: any): string => {
        let addrStr = addr.toString()
        // If it's a decimal number (very long), convert to hex
        if (!addrStr.startsWith('0x') && addrStr.length > 40) {
          addrStr = '0x' + BigInt(addrStr).toString(16).padStart(64, '0')
        }
        return addrStr.toLowerCase()
      }
      
      const normalizedOwner = normalizeAddress(ownerAddress)
      const normalizedConnected = normalizeAddress(address)
      
      console.log("Owner address:", normalizedOwner)
      console.log("Connected address:", normalizedConnected)
      console.log("Are they equal?", normalizedOwner === normalizedConnected)
      
      if (normalizedOwner !== normalizedConnected) {
        alert(`⚠️ Wrong Wallet Connected!\n\nContract Owner: ${normalizedOwner}\nYou are: ${normalizedConnected}\n\nPlease switch to the owner wallet in your browser, or use the "Transfer Ownership" section to transfer ownership to your current wallet.`)
        setStatus(`❌ Wrong wallet! Owner is ${normalizedOwner}\nYou are ${normalizedConnected}`)
        setIsRegistering(false)
        return
      }

      // Skip client-side check - let the contract handle it
      // The contract will revert with "Ownable: caller not owner" if not authorized
      setStatus(`Owner: ${normalizedOwner}\nYou: ${normalizedConnected}\nProceeding with registration...`)

      // Check if already registered
      const isSupported = await contract.is_token_supported(tokenAddress)
      if (isSupported) {
        alert(`${tokenName} is already registered!`)
        setStatus(`${tokenName} already supported`)
        return
      }

      // Register the token
      const call = (contract as any).populate("register_token", [tokenAddress])
      
      if (call) {
        const tx = await sendAsync([call])
        setStatus(`Transaction sent! Hash: ${tx?.transaction_hash}`)
        
        // Wait a bit and verify
        setTimeout(async () => {
          const nowSupported = await contract.is_token_supported(tokenAddress)
          if (nowSupported) {
            setStatus(`✅ ${tokenName} registered successfully!`)
            alert(`${tokenName} is now supported!`)
          }
        }, 5000)
      }
    } catch (error: any) {
      console.error("Error registering token:", error)
      
      // Extract more detailed error info
      let errorMsg = error.message || "Failed to register token"
      if (error.toString().includes("Ownable: caller not owner")) {
        errorMsg = "You are not the contract owner. Please switch to the owner wallet."
      } else if (error.toString().includes("Already registered") || error.toString().includes("already supported")) {
        errorMsg = "This token is already registered!"
      }
      
      setStatus(`❌ Error: ${errorMsg}\n\nFull error: ${error}`)
      alert(`Failed to register ${tokenName}:\n\n${errorMsg}\n\nCheck console for details.`)
    } finally {
      setIsRegistering(false)
    }
  }

  const transferOwnership = async () => {
    if (!contract || !account) {
      alert("Please connect your wallet first")
      return
    }

    if (!newOwner || !newOwner.startsWith("0x")) {
      alert("Please enter a valid address")
      return
    }

    try {
      setIsRegistering(true)
      setStatus("Transferring ownership...")

      const call = (contract as any).populate("transfer_ownership", [newOwner])
      
      if (call) {
        const tx = await sendAsync([call])
        setStatus(`✅ Ownership transferred to ${newOwner}\nTx: ${tx?.transaction_hash}`)
        alert(`Ownership transferred successfully!`)
        setNewOwner("")
      }
    } catch (error: any) {
      console.error("Error transferring ownership:", error)
      setStatus(`❌ Error: ${error.message}`)
      alert(`Failed to transfer ownership: ${error.message}`)
    } finally {
      setIsRegistering(false)
    }
  }

  const checkTokenSupport = async () => {
    if (!contract) return

    try {
      setStatus("Checking contract status...")
      
      const owner = await contract.owner()
      const usdcSupported = await contract.is_token_supported(USDC_TOKEN_ADDRESS)
      const strkSupported = await contract.is_token_supported(STRK_TOKEN_ADDRESS)

      const normalizeAddress = (addr: any): string => {
        let addrStr = addr.toString()
        // If it's a decimal number (very long), convert to hex
        if (!addrStr.startsWith('0x') && addrStr.length > 40) {
          addrStr = '0x' + BigInt(addrStr).toString(16).padStart(64, '0')
        }
        return addrStr.toLowerCase()
      }

      const normalizedOwner = normalizeAddress(owner)
      const normalizedConnected = normalizeAddress(address)
      const isOwner = normalizedOwner === normalizedConnected

      setStatus(`
📋 Contract Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏦 Contract: ${CONTRACT_ADDRESS}

👤 Ownership:
   Owner: ${normalizedOwner}
   You:   ${normalizedConnected}
   Status: ${isOwner ? "✅ YOU ARE THE OWNER" : "❌ YOU ARE NOT THE OWNER"}

💰 Token Support:
   STRK: ${strkSupported ? "✅ Registered" : "❌ Not Registered"}
   USDC: ${usdcSupported ? "✅ Registered" : "❌ Not Registered"}

${!isOwner ? "\n⚠️  You need to switch to the owner wallet or transfer ownership first!" : ""}
${usdcSupported ? "\n✅  USDC is already registered! No action needed." : "\n📝  USDC needs to be registered."}
      `.trim())
    } catch (error) {
      console.error("Error checking support:", error)
      setStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">Admin Panel</h2>
        
        {/* Owner Info */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">Connected as:</p>
          <p className="text-white font-mono text-sm break-all">{address || "Not connected"}</p>
        </div>

        {/* Status Display */}
        {status && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <pre className="text-blue-400 text-sm whitespace-pre-wrap">{status}</pre>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => checkTokenSupport()}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Check Token Support Status
          </button>

          <button
            onClick={() => registerToken(USDC_TOKEN_ADDRESS, "USDC")}
            disabled={isRegistering}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isRegistering ? "Registering..." : "Register USDC Token"}
          </button>

          {/* Transfer Ownership Section */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-3">⚠️ Transfer Ownership</h3>
            <p className="text-sm text-gray-400 mb-3">
              Transfer contract ownership to a new address. This action is irreversible!
            </p>
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="0x... (new owner address)"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white mb-3 font-mono text-sm"
            />
            <button
              onClick={transferOwnership}
              disabled={isRegistering || !newOwner}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isRegistering ? "Transferring..." : "Transfer Ownership"}
            </button>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Note:</strong> Only the contract owner can register new tokens. 
              Make sure you're connected with the owner wallet.
            </p>
          </div>

          {/* Token Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Token Addresses</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Contract:</span>
                <p className="text-white font-mono break-all">{CONTRACT_ADDRESS}</p>
              </div>
              <div>
                <span className="text-gray-400">STRK:</span>
                <p className="text-white font-mono break-all">{STRK_TOKEN_ADDRESS}</p>
              </div>
              <div>
                <span className="text-gray-400">USDC:</span>
                <p className="text-white font-mono break-all">{USDC_TOKEN_ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
