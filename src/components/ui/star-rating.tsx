import { useState } from 'react'
import { FiStar } from 'react-icons/fi'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleStarClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  const handleStarHover = (rating: number) => {
    if (!readonly) {
      setHoveredStar(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredStar(0)
    }
  }

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredStar || value)
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            className={`
              ${sizeClasses[size]}
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              transition-all duration-150
            `}
          >
            <FiStar className="w-full h-full" fill={isActive ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}