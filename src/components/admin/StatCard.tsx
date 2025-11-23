import type { LucideProps } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<LucideProps>
  description?: string
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div
      className="p-6 rounded-3xl transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
        boxShadow: `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `
          16px 16px 32px rgba(133, 196, 219, 0.5),
          -16px -16px 32px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-bold mb-1"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {value}
          </p>
          {description && (
            <p
              className="text-xs font-semibold mt-2"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
            boxShadow: `
              6px 6px 12px rgba(139, 219, 219, 0.4),
              -6px -6px 12px rgba(255, 255, 255, 0.8),
              inset 2px 2px 4px rgba(255,255,255,0.3)
            `
          }}
        >
          <Icon
            className="w-8 h-8"
            style={{
              color: 'white',
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
            }}
          />
        </div>
      </div>
    </div>
  )
}
