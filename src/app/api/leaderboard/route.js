import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const papers = db.prepare('SELECT * FROM papers').all();
    const marksData = db.prepare('SELECT * FROM marks').all();
    
    // Aggregate scores per paper
    const leaderboard = papers.map(paper => {
      const paperMarks = marksData.filter(m => m.paper_id === paper.id);
      const totalScore = paperMarks.reduce((sum, m) => sum + m.score, 0);
      
      // Calculate breakdown by judge
      const judgeBreakdown = {};
      paperMarks.forEach(m => {
        if (!judgeBreakdown[m.judge_id]) judgeBreakdown[m.judge_id] = 0;
        judgeBreakdown[m.judge_id] += m.score;
      });

      return {
        ...paper,
        totalScore,
        judgeBreakdown
      };
    });

    // Sort by total score descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
