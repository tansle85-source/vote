import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const papers = db.prepare('SELECT * FROM papers').all();
    const marksData = db.prepare('SELECT * FROM marks').all();
    const judgeCountObj = db.prepare('SELECT COUNT(*) as count FROM judges').get();
    const judgeCount = judgeCountObj.count || 4; // fallback to 4 just in case
    
    // Get the ID for Oral Presentation Skills
    const oralCriteria = db.prepare("SELECT id FROM criteria WHERE name = 'Oral Presentation Skills'").get();
    const oralCriteriaId = oralCriteria ? oralCriteria.id : 5;
    
    // Aggregate scores per paper
    const leaderboard = papers.map(paper => {
      const paperMarks = marksData.filter(m => m.paper_id === paper.id);
      
      const totalSum = paperMarks.reduce((sum, m) => sum + m.score, 0);
      const totalScore = parseFloat((totalSum / judgeCount).toFixed(2));
      
      const oralMarks = paperMarks.filter(m => m.criteria_id === oralCriteriaId);
      const oralSum = oralMarks.reduce((sum, m) => sum + m.score, 0);
      const oralScore = parseFloat((oralSum / judgeCount).toFixed(2));
      
      // Calculate breakdown by judge (also optional, good for debugging)
      const judgeBreakdown = {};
      paperMarks.forEach(m => {
        if (!judgeBreakdown[m.judge_id]) judgeBreakdown[m.judge_id] = 0;
        judgeBreakdown[m.judge_id] += m.score;
      });

      return {
        ...paper,
        totalScore,
        oralScore,
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
