import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 max-w-4xl mx-auto space-y-12">
      {/* Header Section */}
      <section className="space-y-4 text-center">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
          Typography Demo
        </h1>
        <p className="font-main text-xl text-muted-foreground max-w-2xl mx-auto">
          Showcasing our new font stack: <strong className="text-foreground">Space Grotesk</strong>{' '}
          for headings and <strong className="text-foreground">Sora</strong> for body text.
        </p>
      </section>

      <hr className="border-border" />

      {/* Headings Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-sm font-mono text-muted-foreground">
            font-display (Space Grotesk)
          </span>
          <h1 className="font-display text-6xl font-bold">Heading 1</h1>
          <h2 className="font-display text-5xl font-bold">Heading 2</h2>
          <h3 className="font-display text-4xl font-bold">Heading 3</h3>
          <h4 className="font-display text-3xl font-bold">Heading 4</h4>
          <h5 className="font-display text-2xl font-bold">Heading 5</h5>
          <h6 className="font-display text-xl font-bold">Heading 6</h6>
        </div>
      </section>

      <hr className="border-border" />

      {/* Body Text Section */}
      <section className="space-y-8">
        <div className="space-y-4">
          <span className="text-sm font-mono text-muted-foreground">font-main (Sora)</span>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-main text-base leading-relaxed">
                <strong>Regular Paragraph:</strong> Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Domination of the puck is essential in Slapshot. Every pass counts,
                every shot matters. Build your team, strategize your plays, and climb the
                leaderboards.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-main text-sm text-muted-foreground leading-relaxed">
                <strong>Small Muted Text:</strong> Ideal for captions, secondary information, or
                footer details. Keep your eye on the puck and your stick on the ice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Card Component Demo */}
      <section className="space-y-4">
        <span className="text-sm font-mono text-muted-foreground">Component Example</span>

        <div className="border border-border rounded-xl p-6 bg-card text-card-foreground shadow-sm max-w-md">
          <h3 className="font-display text-2xl font-bold mb-2">Player Stats</h3>
          <div className="space-y-4 font-main">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Goals</span>
              <span className="font-bold">24</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Assists</span>
              <span className="font-bold">18</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Games Played</span>
              <span className="font-bold">42</span>
            </div>
          </div>
          <button className="mt-6 w-full bg-primary text-primary-foreground font-main font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
            View Full Profile
          </button>
        </div>
      </section>
    </div>
  )
}
