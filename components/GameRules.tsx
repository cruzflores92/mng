import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GameRules() {
  return (
    <Card className="w-full bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Game Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Guess a magic number between 1 and 10,000</li>
          <li>Provably fair through Chainlink VRF random number generator</li>
          <li>Entry fee of .025 ETH is required to submit a guess</li>
          <li>The game ends when the maximum number of players is reached</li>
          <li>The player(s) with the closest guess wins the pot</li>
          <li>A small percentage (1.5%) of the pot goes to the developer as a fee</li>
          <li>If there are multiple winners, the pot is split equally</li>
        </ul>
      </CardContent>
    </Card>
  )
}

