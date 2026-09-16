import React from 'react';
import { Metadata } from 'next';
import { exerciseService } from '@/services/exerciseService';
import { ExerciseDetailClient } from '@/components/exercises/player/ExerciseDetailClient';

interface ExercisePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ExercisePageProps): Promise<Metadata> {
  const exercise = await exerciseService.getExerciseById(params.id);

  if (!exercise) {
    return {
      title: 'Exercice introuvable | Sunubiblio',
      description: 'L’exercice demandé est introuvable sur la plateforme Sunubiblio.',
    };
  }

  return {
    title: `${exercise.title} — ${exercise.subject} | Sunubiblio`,
    description: `${exercise.description} Entraînez-vous avec des QCM et corrigés pédagogiques sur Sunubiblio.`,
    openGraph: {
      title: `${exercise.title} | Sunubiblio`,
      description: exercise.description,
    },
  };
}

export default async function ExerciseDetailPage({ params }: ExercisePageProps) {
  const exercise = await exerciseService.getExerciseById(params.id);

  return <ExerciseDetailClient exercise={exercise} />;
}
