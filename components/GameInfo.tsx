import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GameInfoProps {
  gameActive: boolean
  currentPlayers: number
  maxPlayers: number
  totalPot: string
  lastWinner: string
  lastWinningNumber: number | null
}

export function GameInfo({
  gameActive,
  currentPlayers,
  maxPlayers,
  totalPot,
  lastWinner,
  lastWinningNumber,
}: GameInfoProps) {
  const shortenAddress = (address: string) => {
    return address && address !== "0x0000000000000000000000000000000000000000"
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "No winner yet"
  }

  return (
    <Card className="w-full bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Magic Number Game Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="font-semibold">Game Status:</div>
          <div className={gameActive ? "text-green-300" : "text-red-300"}>{gameActive ? "Active" : "Inactive"}</div>
          <div className="font-semibold">Players:</div>
          <div>
            {currentPlayers} / {maxPlayers}
          </div>
          <div className="font-semibold">Total Pot:</div>
          <div>{totalPot} ETH</div>
          <div className="font-semibold">Last Winner:</div>
          <div className="truncate" title={lastWinner}>
            {shortenAddress(lastWinner)}
          </div>
          <div className="font-semibold">Last Winning Number:</div>
          <div>{lastWinningNumber !== null && lastWinningNumber !== 0 ? lastWinningNumber : "N/A"}</div>
        </div>
      </CardContent>
    </Card>
  )
}

