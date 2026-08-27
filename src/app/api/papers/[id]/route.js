import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    // Delete marks first due to foreign key
    db.prepare('DELETE FROM marks WHERE paper_id = ?').run(id);
    db.prepare('DELETE FROM papers WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
