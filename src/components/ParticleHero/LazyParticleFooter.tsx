'use client';

import dynamic from 'next/dynamic';

const ParticleFooter = dynamic(() => import('./ParticleFooter'), { ssr: false });

export default function LazyParticleFooter() {
  return <ParticleFooter />;
}
