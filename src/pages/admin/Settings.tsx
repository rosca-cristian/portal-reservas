export default function AdminSettings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-4xl font-extrabold mb-2"
          style={{
            color: '#1a1a2e',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          ⚙️ Settings
        </h1>
        <p
          className="font-semibold"
          style={{
            color: '#4A5568',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
          }}
        >
          System configuration and preferences
        </p>
      </div>

      <div
        className="p-6 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          boxShadow: `
            12px 12px 24px rgba(133, 196, 219, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255,255,255,0.5)
          `
        }}
      >
        <p
          className="font-semibold text-center"
          style={{
            color: '#4A5568',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
          }}
        >
          🚧 Admin settings will be implemented in future stories
        </p>
      </div>
    </div>
  )
}
