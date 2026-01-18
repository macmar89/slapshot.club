import React from 'react'
import Image from 'next/image'

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative h-full w-full">
          <Image
            src="/images/background/slapshot_background.png"
            alt="Slapshot Background"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">Dashboard</h1>
        {/* Dashboard content will go here */}
      </div>
    </div>
  )
}
