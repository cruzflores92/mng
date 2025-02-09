"use client"

import { useState } from "react"
import { ConnectWallet } from "@/components/connect-wallet"
import { Chat } from "@/components/Chat"
import { RadioPlayer } from "@/components/RadioPlayer"
import { GameRules } from "@/components/GameRules"
import { GameInfo } from "@/components/GameInfo"

interface GameInfoState {
  gameActive: boolean
  currentPlayers: number
  maxPlayers: number
  totalPot: string
  lastWinner: string
  lastWinningNumber: number | null
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [gameInfo, setGameInfo] = useState<GameInfoState>({
    gameActive: false,
    currentPlayers: 0,
    maxPlayers: 0,
    totalPot: "0",
    lastWinner: "",
    lastWinningNumber: null,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Magic Number Game</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ConnectWallet onConnect={(address) => setWalletAddress(address)} onGameInfoUpdate={setGameInfo} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GameInfo {...gameInfo} />
              <GameRules />
            </div>
          </div>
          <div className="space-y-8">
            <Chat walletAddress={walletAddress || "Guest"} />
            <RadioPlayer />
          </div>
        </div>
      </div>
    </div>
  )
}

