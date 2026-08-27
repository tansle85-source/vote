import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const judges = db.prepare('SELECT * FROM judges').all();
    return NextResponse.json(judges);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
