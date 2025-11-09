import { NextResponse } from 'next/server';
import { getDisciplines } from '@/lib/data';

// Публичный API для получения дисциплин
export async function GET() {
  try {
    const disciplines = await getDisciplines();
    return NextResponse.json({ list: disciplines });
  } catch (error) {
    console.error('Failed to fetch disciplines:', error);
    return NextResponse.json({ list: [] }, { status: 200 });
  }
}

