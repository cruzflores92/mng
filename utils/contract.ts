import { ethers } from "ethers"

export const CONTRACT_ADDRESS = "0xDCF88e2DE56C10281f1ea1d004b8E6F5F00666D1" // Replace with your actual contract address

export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_guess", type: "uint256" }],
    name: "enterGuess",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "winningNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ENTRY_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameStatus",
    outputs: [
      { internalType: "bool", name: "gameStatus", type: "bool" },
      { internalType: "uint256", name: "playerCount", type: "uint256" },
      { internalType: "uint256", name: "pot", type: "uint256" },
      { internalType: "address", name: "lastWin", type: "address" },
      { internalType: "uint256", name: "lastWinNum", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export const getContract = async (signer: ethers.Signer) => {
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract address not set. Please update the CONTRACT_ADDRESS in utils/contract.ts")
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

