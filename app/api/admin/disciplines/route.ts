import { NextRequest, NextResponse } from 'next/server';
import { 
  getDisciplines, 
  addDiscipline, 
  updateDiscipline, 
  deleteDiscipline,
  type Discipline 
} from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const disciplines = await getDisciplines();
    return NextResponse.json({ list: disciplines });
  } catch (error) {
    console.error('Failed to fetch disciplines:', error);
    return NextResponse.json({ list: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body: Omit<Discipline, 'Id'> = await request.json();
    const newDiscipline = await addDiscipline(body);
    return NextResponse.json(newDiscipline, { status: 201 });
  } catch (error) {
    console.error('Failed to create discipline:', error);
    return NextResponse.json({ message: 'Failed to create discipline' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body: Partial<Discipline> & { Id: number } = await request.json();
    const { Id, ...updateData } = body;
    const updated = await updateDiscipline(Id, updateData);
    if (!updated) {
      return NextResponse.json({ message: 'Discipline not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update discipline:', error);
    return NextResponse.json({ message: 'Failed to update discipline' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }
    const deleted = await deleteDiscipline(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Discipline not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete discipline:', error);
    return NextResponse.json({ message: 'Failed to delete discipline' }, { status: 500 });
  }
}

