import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const judge = db.prepare('SELECT id, name, organization, email FROM judges WHERE id = ?').get(id);
    if (!judge) return NextResponse.json({ error: 'Judge not found' }, { status: 404 });
    return NextResponse.json(judge);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, organization, email, password } = body;
    
    // Admin resetting password or judge updating their own profile
    if (password && name) {
      db.prepare('UPDATE judges SET name = ?, organization = ?, email = ?, password = ? WHERE id = ?').run(name, organization, email, password, id);
    } else if (password) {
      // Admin just resetting password
      db.prepare('UPDATE judges SET password = ? WHERE id = ?').run(password, id);
    } else {
      // Updating profile without changing password
      db.prepare('UPDATE judges SET name = ?, organization = ?, email = ? WHERE id = ?').run(name, organization, email, id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
