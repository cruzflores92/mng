"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Message = {
  sender: string
  content: string
  timestamp: number
}

type ChatProps = {
  walletAddress: string
}

export function Chat({ walletAddress }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const message: Message = {
        sender: walletAddress,
        content: newMessage,
        timestamp: Date.now(),
      }
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage("")
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef]) //Corrected dependency

  return (
    <Card className="w-full bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[400px] flex flex-col">
        <ScrollArea className="flex-grow mb-4 pr-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="text-xs text-gray-400">
                {msg.sender === "Guest" ? "Guest" : `${msg.sender.slice(0, 6)}...${msg.sender.slice(-4)}`}:{" "}
              </span>
              <span className="text-sm text-gray-200">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="flex mt-auto">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow mr-2 bg-white/20 border-0 text-white placeholder-gray-400"
          />
          <Button onClick={sendMessage} variant="secondary">
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

