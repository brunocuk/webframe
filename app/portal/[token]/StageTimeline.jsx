import { PROJECT_STAGES } from '@/lib/projectStages'

export default function StageTimeline({ stage }) {
  const stageIndex = Math.max(
    PROJECT_STAGES.findIndex((s) => s.value === stage),
    0
  )
  const progress = ((stageIndex + 1) / PROJECT_STAGES.length) * 100

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PROJECT_STAGES.map((stageDef, i) => (
          <div key={stageDef.value} className={i > stageIndex ? 'opacity-40' : ''}>
            <div className="flex items-center gap-1.5 mb-1">
              {i < stageIndex ? (
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <span
                  className={`w-2 h-2 rounded-full ${
                    i === stageIndex ? 'bg-primary animate-pulse' : 'bg-gray-300'
                  }`}
                />
              )}
              <span
                className={`text-sm font-semibold ${
                  i === stageIndex ? 'text-primary' : 'text-gray-900'
                }`}
              >
                {stageDef.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{stageDef.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
