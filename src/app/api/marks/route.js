import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { judge_id, paper_id, marks, comment } = body;
    // marks is an object like { criteria_id: score }

    const stmtMarks = db.prepare(`
      INSERT INTO marks (paper_id, judge_id, criteria_id, score) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(paper_id, judge_id, criteria_id) 
      DO UPDATE SET score=excluded.score
    `);
    
    const stmtComment = db.prepare(`
      INSERT INTO comments (paper_id, judge_id, comment)
      VALUES (?, ?, ?)
      ON CONFLICT(paper_id, judge_id)
      DO UPDATE SET comment=excluded.comment
    `);

    const insertMany = db.transaction((marksObj, commentText) => {
      for (const [criteria_id, score] of Object.entries(marksObj)) {
        stmtMarks.run(paper_id, judge_id, criteria_id, score);
      }
      if (commentText !== undefined) {
        stmtComment.run(paper_id, judge_id, commentText);
      }
    });

    insertMany(marks, comment);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
