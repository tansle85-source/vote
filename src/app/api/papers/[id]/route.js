import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    // Delete marks and comments first due to foreign key
    db.prepare('DELETE FROM marks WHERE paper_id = ?').run(id);
    db.prepare('DELETE FROM comments WHERE paper_id = ?').run(id);
    db.prepare('DELETE FROM papers WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, author, description } = body;
    
    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }
    
    db.prepare('UPDATE papers SET title = ?, author = ?, description = ? WHERE id = ?')
      .run(title, author, description, id);
      
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
