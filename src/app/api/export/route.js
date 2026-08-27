import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const papers = db.prepare('SELECT * FROM papers').all();
    const criteria = db.prepare('SELECT * FROM criteria').all();
    const marks = db.prepare('SELECT * FROM marks').all();
    const comments = db.prepare('SELECT * FROM comments').all();
    const judges = db.prepare('SELECT * FROM judges').all();

    // Map judges for easy lookup
    const judgeMap = {};
    judges.forEach(j => judgeMap[j.id] = j.name);

    // Prepare CSV header
    let csvContent = 'Rank,Paper Title,Author,Total Score';
    
    // Add criteria and comments headers for each judge
    judges.forEach(j => {
      criteria.forEach(c => {
        csvContent += `,${j.name} - ${c.name}`;
      });
      csvContent += `,${j.name} - Comment`;
    });
    csvContent += '\n';

    // Calculate leaderboard to determine ranks
    const leaderboard = papers.map(paper => {
      const paperMarks = marks.filter(m => m.paper_id === paper.id);
      const totalSum = paperMarks.reduce((sum, m) => sum + m.score, 0);
      
      const uniqueJudges = new Set(paperMarks.map(m => m.judge_id)).size;
      const divisor = uniqueJudges > 0 ? uniqueJudges : 1;
      
      const totalScore = parseFloat((totalSum / divisor).toFixed(2));
      return { ...paper, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);

    // Fill rows
    leaderboard.forEach((paper, index) => {
      // Escape commas in strings
      const title = `"${paper.title.replace(/"/g, '""')}"`;
      const author = `"${paper.author.replace(/"/g, '""')}"`;
      
      let row = `${index + 1},${title},${author},${paper.totalScore}`;

      judges.forEach(judge => {
        criteria.forEach(criterion => {
          const mark = marks.find(m => m.paper_id === paper.id && m.judge_id === judge.id && m.criteria_id === criterion.id);
          row += `,${mark ? mark.score : 0}`;
        });

        const commentRecord = comments.find(c => c.paper_id === paper.id && c.judge_id === judge.id);
        const commentText = commentRecord && commentRecord.comment ? `"${commentRecord.comment.replace(/"/g, '""')}"` : '""';
        row += `,${commentText}`;
      });

      csvContent += row + '\n';
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="voting_results.csv"'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
