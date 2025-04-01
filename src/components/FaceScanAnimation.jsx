"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function FaceScanAnimation({ isScanning, onScanComplete }) {
  const containerRef = useRef(null)
  const scanLineRef = useRef(null)

  useEffect(() => {
    if (!isScanning || !containerRef.current || !scanLineRef.current) return

    const container = containerRef.current
    const scanLine = scanLineRef.current
    const containerHeight = container.offsetHeight

    // Reset scan line position
    scanLine.style.top = "0px"

    // Animate the scan line
    const duration = 2000 // 2 seconds for full scan
    const startTime = performance.now()

    const animateScanLine = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      scanLine.style.top = `${progress * containerHeight}px`

      if (progress < 1) {
        requestAnimationFrame(animateScanLine)
      } else {
        // Scan complete
        setTimeout(() => {
          if (onScanComplete) onScanComplete()
        }, 500)
      }
    }

    requestAnimationFrame(animateScanLine)
  }, [isScanning, onScanComplete])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div
          ref={containerRef}
          className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center"
        >
          {isScanning ? (
            <>
              <div
                ref={scanLineRef}
                className="absolute left-0 w-full h-1 bg-green-500 shadow-lg shadow-green-300 z-10"
                style={{ top: 0 }}
              />
              <div className="text-center z-0">
                <div className="text-lg font-semibold text-gray-700 animate-pulse">Scanning face...</div>
                <div className="text-sm text-gray-500 mt-2">Please hold still</div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">Ready to scan</div>
              <div className="text-sm text-gray-500 mt-2">Position your face in the frame</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

