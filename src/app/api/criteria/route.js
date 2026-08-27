import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const criteria = db.prepare('SELECT * FROM criteria').all();
    return NextResponse.json(criteria);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
