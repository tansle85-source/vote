import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const papers = db.prepare('SELECT * FROM papers').all();
    return NextResponse.json(papers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, description } = body;
    
    const stmt = db.prepare('INSERT INTO papers (title, author, description) VALUES (?, ?, ?)');
    const info = stmt.run(title, author, description);
    
    return NextResponse.json({ id: info.lastInsertRowid, title, author, description }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
