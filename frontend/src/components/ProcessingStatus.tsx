'use client';

interface ProcessingStatusProps {
  status: string;
  progress?: {
    episode: number;
    reward: number;
  };
  t: any;
  phase?: 'parsing' | 'training' | 'generating';
}

export default function ProcessingStatus({ 
  status, 
  progress, 
  t,
  phase = 'training'
}: ProcessingStatusProps) {
  // Phase-based progress: parsing=0-5%, training=5-95%, generating=95-100%
  let phaseProgress = 0;
  if (phase === 'parsing') {
    phaseProgress = 0.02;
  } else if (phase === 'generating') {
    phaseProgress = 0.98;
  } else if (progress) {
    const trainProgress = Math.min(progress.episode / 10000, 1);
    phaseProgress = 0.05 + trainProgress * 0.90;
  } else {
    phaseProgress = 0.05;
  }

  const displayPercent = Math.min(phaseProgress * 100, 100);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-lg font-semibold">{status}</p>
        
        {/* Overall Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">
              {phase === 'parsing' ? t.parsing :
               phase === 'generating' ? t.generating :
               t.trainingLabel}
            </span>
            <span className="font-semibold">
              {displayPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border border-gray-400">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${displayPercent}%`, minWidth: phase === 'parsing' ? '2%' : '0%' }}
            ></div>
          </div>
        </div>

        {/* Training Progress Detail */}
        {phase === 'training' && progress && (
          <div className="w-full text-center text-sm text-gray-600">
            <div>{t.episode}: {progress.episode}</div>
            <div>{t.reward}: {progress.reward.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
