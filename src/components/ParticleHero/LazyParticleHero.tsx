'use client';

import dynamic from 'next/dynamic';

const ParticleHero = dynamic(() => import('./ParticleHero'), { ssr: false });

export default function LazyParticleHero() {
  return <ParticleHero />;
}
