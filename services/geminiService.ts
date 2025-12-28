
// Note: removed usage of @google/genai SDK from client bundle to avoid
// bundling server-only SDK into the browser. This returns a local
// randomized study tip. Replace with a server-side call if you need real AI.
const TIPS = [
  'Divida as questões em blocos curtos e revise a cada ciclo.',
  'Priorize os erros: refaça questões que você errou recentemente.',
  'Use técnica Pomodoro: foco intenso e pausas programadas.',
  'Explique a solução em voz alta; ensinar é aprender.',
  'Comece pelas questões mais desafiadoras quando estiver fresco.'
];

export const getStudyTip = async (_taskDescription?: string): Promise<string> => {
  const idx = Math.floor(Math.random() * TIPS.length);
  return TIPS[idx];
};
