import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils'
import hockey1 from '@/assets/images/loader/hockey1.png'
import hockey2 from '@/assets/images/loader/hockey2.png'
import hockey3 from '@/assets/images/loader/hockey3.png'
import hockey4 from '@/assets/images/loader/hockey4.png'

interface HockeyLoaderProps {
  className?: string
  text?: string
}

const IMAGES = [
  hockey1,
  hockey2,
  hockey3,
  hockey4,
]

export function HockeyLoader({ className, text }: HockeyLoaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center", className)}>
      {/* Cinematic Background Images */}
      {IMAGES.map((src, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentImageIndex ? "opacity-40 scale-105" : "opacity-0 scale-100"
          )}
          style={{ 
            transition: 'opacity 1s ease-in-out, transform 8s linear'
          }}
        >
          <Image
            src={src}
            alt="Hockey Loader Background"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Cinematic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

      {/* Glassmorphism Content Card */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-12 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(234,179,8,0.2)] max-w-md w-full mx-4">
        <div className="relative">
          {/* Animated Glow Rings */}
          <div className="absolute inset-[-20px] rounded-full border border-[#eab308]/20 animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-[-10px] rounded-full border border-[#eab308]/10 animate-[pulse_2s_linear_infinite]" />
          
          {/* Central Logo/Symbol Representation */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#eab308]/20 to-transparent border border-[#eab308]/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(234,179,8,0.2)]">
            <div className="w-16 h-16 rounded-full bg-black border border-white/5 flex items-center justify-center shadow-2xl">
               <div className="w-3 h-3 bg-[#eab308] rounded-full shadow-[0_0_15px_#eab308]" />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter">
                Slapshot <span className="text-[#eab308]">Club</span>
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent" />
            <p className="text-[#eab308]/80 text-xs font-black uppercase tracking-[0.4em] animate-pulse mt-2">
                {text || 'Pripravujem šatňu...'}
            </p>
        </div>
      </div>

      {/* Subtle Progress Bar at bottom */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#eab308] to-transparent w-full opacity-30 blur-sm" />
    </div>
  )
}
