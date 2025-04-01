"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface BeforeAfterComparisonProps {
  beforeImage: string
  afterImage: string
  beforeDate?: string
  afterDate?: string
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeDate,
  afterDate,
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const position = (x / rect.width) * 100

    setSliderPosition(Math.min(Math.max(position, 0), 100))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const position = (x / rect.width) * 100

    setSliderPosition(Math.min(Math.max(position, 0), 100))
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-serif font-semibold text-primary-800">Before & After Comparison</h3>

      <div
        ref={containerRef}
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Before Image (Full width) */}
        <div className="absolute inset-0">
          <img src={beforeImage || "/placeholder.svg"} alt="Before" className="w-full h-full object-cover" />
          {beforeDate && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              Before: {beforeDate}
            </div>
          )}
        </div>

        {/* After Image (Clipped based on slider) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={afterImage || "/placeholder.svg"}
            alt="After"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {afterDate && (
            <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
              After: {afterDate}
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${sliderPosition}%` }}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h8M8 12h8M8 17h8M4 7h2M4 12h2M4 17h2M16 7h4M16 12h4M16 17h4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-secondary-600">
        <div>
          <span className="font-medium">Before:</span> {beforeDate || "Initial Analysis"}
        </div>
        <div>
          <span className="font-medium">After:</span> {afterDate || "Current Analysis"}
        </div>
      </div>

      <p className="text-sm text-secondary-600 mt-2">
        Drag the slider left and right to compare your before and after images. This visual comparison helps you track
        the improvements in your skin over time.
      </p>
    </div>
  )
}

