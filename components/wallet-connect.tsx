"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3/hooks/useWeb3Provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WEB3_CONFIG } from "@/lib/web3/config"
import { Wallet, ChevronDown, ExternalLink, Copy, Check, AlertTriangle } from "lucide-react"

export default function WalletConnect() {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    networkName,
    chainId,
    switchNetwork,
    error,
  } = useWeb3()
  const [copied, setCopied] = useState(false)

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Get network options
  const networkOptions = Object.entries(WEB3_CONFIG.networks).map(([id, network]) => ({
    id: Number.parseInt(id),
    name: network.name,
  }))

  return (
    <div className="relative">
      {error && (
        <div className="absolute -top-12 left-0 right-0 bg-red-500/90 text-white text-sm p-2 rounded-md flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          {error}
        </div>
      )}

      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 text-white flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="hidden sm:inline">{formatAddress(account!)}</span>
              <span className="sm:hidden">
                <Wallet size={16} />
              </span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-normal text-slate-400">Connected Wallet</span>
                <span className="font-mono text-xs mt-1">{formatAddress(account!)}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-normal text-slate-400">Network</span>
                <span className="text-xs mt-1">{networkName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={copyAddress}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Address"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                window.open(
                  `${WEB3_CONFIG.networks[chainId as keyof typeof WEB3_CONFIG.networks]?.blockExplorer}/address/${account}`,
                  "_blank",
                )
              }
            >
              <ExternalLink size={16} />
              View on Explorer
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            {networkOptions.map((network) => (
              <DropdownMenuItem
                key={network.id}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => switchNetwork(network.id)}
              >
                <span>{network.name}</span>
                {chainId === network.id && <Check size={16} className="text-green-400" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-red-400 cursor-pointer" onClick={disconnectWallet}>
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet size={16} className="mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  )
}
