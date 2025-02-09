"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/contract"

interface ConnectWalletProps {
  onConnect: (address: string) => void
  onGameInfoUpdate: (gameInfo: GameInfo) => void
}

interface GameInfo {
  gameActive: boolean
  currentPlayers: number
  maxPlayers: number
  totalPot: string
  lastWinner: string
  lastWinningNumber: number | null
  entryFee: string
  minGuess: number
  maxGuess: number
}

export function ConnectWallet({ onConnect, onGameInfoUpdate }: ConnectWalletProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [guess, setGuess] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    gameActive: false,
    currentPlayers: 0,
    maxPlayers: 10,
    totalPot: "0",
    lastWinner: "",
    lastWinningNumber: null,
    entryFee: "0.025",
    minGuess: 1,
    maxGuess: 10000,
  })

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)

          const signer = await provider.getSigner()
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
          setContract(contract)

          await updateGameInfo(contract)
        } catch (error) {
          console.error("Error loading contract:", error)
          setError("Failed to load the game contract. Please try refreshing the page.")
        }
      }
    }
    loadProvider()
  }, [])

  const updateGameInfo = async (contract: ethers.Contract) => {
    try {
      const [gameStatus, playerCount, pot, lastWin, lastWinNum] = await contract.getGameStatus()

      const updatedGameInfo: GameInfo = {
        ...gameInfo,
        gameActive: gameStatus,
        currentPlayers: Number(playerCount),
        totalPot: ethers.formatEther(pot),
        lastWinner: lastWin,
        lastWinningNumber: Number(lastWinNum),
      }

      console.log("Updated game info:", updatedGameInfo)
      setGameInfo(updatedGameInfo)
      onGameInfoUpdate(updatedGameInfo)
    } catch (error) {
      console.error("Error updating game info:", error)
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    setError("")
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
        onConnect(accounts[0])

        const provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(provider)

        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        setContract(contract)

        await updateGameInfo(contract)
      } else {
        setError("MetaMask not detected! Please install MetaMask to use this app.")
      }
    } catch (error) {
      if (error.code === 4001) {
        setError("You rejected the connection request. Please try again and approve the connection in MetaMask.")
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
      console.error("Wallet connection error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const makeGuess = async () => {
    if (!guess || isNaN(Number(guess)) || Number(guess) < gameInfo.minGuess || Number(guess) > gameInfo.maxGuess) {
      setError(`Please enter a valid number between ${gameInfo.minGuess} and ${gameInfo.maxGuess}.`)
      return
    }

    if (contract && provider) {
      setIsLoading(true)
      try {
        const tx = await contract.enterGuess(guess, { value: ethers.parseEther(gameInfo.entryFee) })
        await tx.wait()
        setGuess("")
        setError("")
        await updateGameInfo(contract)
      } catch (error) {
        console.error("Error making guess:", error)
        setError("Transaction failed. Please make sure you have enough ETH and try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Magic Number Game</CardTitle>
        <CardDescription className="text-purple-200">
          Connect your wallet to start playing the Magic Number Game!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-500 text-white border-red-700">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => setError("")} className="mt-2" variant="secondary">
              Dismiss
            </Button>
          </Alert>
        )}

        {!account ? (
          <Button
            onClick={connectWallet}
            className="w-full bg-white text-purple-700 hover:bg-purple-100"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-800 bg-opacity-50">
              <p className="text-sm font-medium text-purple-200">Connected Account:</p>
              <p className="text-xs text-purple-100 break-all">{account}</p>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder={`Enter your guess (${gameInfo.minGuess}-${gameInfo.maxGuess})`}
                className="bg-white text-purple-900 placeholder-purple-400"
                disabled={!gameInfo.gameActive || isLoading}
              />
              <Button
                onClick={makeGuess}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!gameInfo.gameActive || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Submitting..." : `Submit Guess (${gameInfo.entryFee} ETH)`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

