"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface AuthFormProps {
  onAuthenticated: (token: string, user: any) => void
}

export default function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post("/api/auth/send-otp", { phoneNumber })
      
      toast({
        title: "OTP Sent",\
        description: "Please check  { phoneNumber })
      
      toast({ 
        title: "OTP Sent",
        description: "Please check your phone for the verification code."
      })
      
      setStep("otp")
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to send OTP. Please try again.")
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send OTP. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post("/api/auth/verify-otp", { phoneNumber, otp, name })

      toast({
        title: "Verification Successful",
        description: "You have been successfully authenticated.",
      })

      onAuthenticated(response.data.token, response.data.user)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to verify OTP. Please try again.")
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary-800">
          {step === "phone" ? "Verify Your Phone Number" : "Enter Verification Code"}
        </CardTitle>
        <CardDescription>
          {step === "phone"
            ? "We'll send a one-time code to verify your phone number. Each phone number can only use the skin analyzer once."
            : `We've sent a verification code to ${phoneNumber}. Please enter it below.`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please enter your phone number in international format (e.g., +1234567890)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                pattern="\d{6}"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-sm text-primary-600 hover:underline"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

