'use client';

import dynamic from 'next/dynamic';

// Client-only wrapper: these global interactive widgets are lazy-loaded so they
// stay out of the initial/shared bundle and don't delay hydration or navigation.
const VoiceAssistant = dynamic(
  () => import('@/components/voice-assistant/voice-assistant').then((m) => m.VoiceAssistant),
  { ssr: false }
);

const FloatingActions = dynamic(
  () => import('@/components/layout/floating-actions').then((m) => m.FloatingActions),
  { ssr: false }
);

export function LazyGlobals() {
  return (
    <>
      <FloatingActions />
      <VoiceAssistant />
    </>
  );
}
