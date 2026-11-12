'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IAExpliquerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ia');
  }, [router]);

  return null;
}
