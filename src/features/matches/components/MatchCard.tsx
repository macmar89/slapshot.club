
// Helper component for the default match layout shown in the requirements
// This makes it easy to visualize the "default" state but allows passing custom children
export const DefaultMatchContent = () => (
  <>
    {/* Header: Logos & Score */}
    <div className="flex items-center justify-between w-full max-w-[80%]">
      {/* Home Team */}
      <div className="flex flex-col items-center gap-2">
        {/* Placeholder for Logo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center text-xs font-bold text-black border-2 border-white/20">
          VGK
        </div>
      </div>

      {/* Score Center */}
      <div className="flex flex-col items-center">
        {/* Main Score - Large & Bold with specific font */}
        <div className="text-5xl font-bold font-[family-name:var(--font-space)] tracking-tight drop-shadow-lg">
          2 - 0
        </div>
        <div className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase mt-1">
          Match
        </div>
      </div>

      {/* Away Team */}
      <div className="flex flex-col items-center gap-2">
        {/* Placeholder for Logo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
          EDM
        </div>
      </div>
    </div>

    {/* Footer: Stats / Players (Mock Data) */}
    <div className="w-full mt-2 pt-4 border-t border-white/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-600/50" />
        <div className="flex flex-col text-sm">
          <span className="font-semibold">M. Stone</span>
          <span className="text-xs text-white/50">1G, 1A</span>
        </div>
        <div className="ml-auto text-xs font-bold px-2 py-1 rounded bg-white/10">MVP</div>
      </div>
    </div>
  </>
)