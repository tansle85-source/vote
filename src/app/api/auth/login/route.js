import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, username, password, judge_id } = body;

    if (role === 'admin') {
      const admin = db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?').get(username, password);
      if (admin) {
        return NextResponse.json({ success: true, role: 'admin' });
      }
      return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 });
    } else if (role === 'judge') {
      const judge = db.prepare('SELECT * FROM judges WHERE id = ? AND password = ?').get(judge_id, password);
      if (judge) {
        return NextResponse.json({ success: true, role: 'judge', judgeId: judge.id, name: judge.name });
      }
      return NextResponse.json({ success: false, message: 'Invalid judge password' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
