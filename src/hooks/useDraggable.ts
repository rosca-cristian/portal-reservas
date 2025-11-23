import { useState, useCallback, useRef } from 'react'

export interface DraggableState {
  isDragging: boolean
  position: { x: number; y: number }
  startPosition: { x: number; y: number }
}

export interface UseDraggableOptions {
  onDragEnd?: (position: { x: number; y: number }) => void
  initialPosition?: { x: number; y: number }
}

export function useDraggable({ onDragEnd, initialPosition = { x: 0, y: 0 } }: UseDraggableOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: position.x,
      elementY: position.y
    }
    e.preventDefault()
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y

    const newPosition = {
      x: dragStartRef.current.elementX + deltaX,
      y: dragStartRef.current.elementY + deltaY
    }

    setPosition(newPosition)
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onDragEnd?.(position)
    }
  }, [isDragging, position, onDragEnd])

  // Attach global mouse event listeners
  const attachListeners = useCallback(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    isDragging,
    position,
    setPosition,
    handleMouseDown,
    attachListeners
  }
}
