import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const papers = db.prepare('SELECT * FROM papers').all();
    const marksData = db.prepare('SELECT * FROM marks').all();
    const commentsData = db.prepare('SELECT * FROM comments').all();
    const judges = db.prepare('SELECT * FROM judges').all();
    const criteria = db.prepare('SELECT * FROM criteria').all();
    
    // Get the ID for Oral Presentation Skills
    const oralCriteria = db.prepare("SELECT id FROM criteria WHERE name = 'Oral Presentation Skills'").get();
    const oralCriteriaId = oralCriteria ? oralCriteria.id : 5;
    
    // Aggregate scores per paper
    const leaderboard = papers.map(paper => {
      const paperMarks = marksData.filter(m => m.paper_id === paper.id);
      const paperComments = commentsData.filter(c => c.paper_id === paper.id);
      
      const totalSum = paperMarks.reduce((sum, m) => sum + m.score, 0);
      
      const uniqueJudges = new Set(paperMarks.map(m => m.judge_id)).size;
      const divisor = uniqueJudges > 0 ? uniqueJudges : 1;
      
      const totalScore = parseFloat((totalSum / divisor).toFixed(2));
      
      const oralMarks = paperMarks.filter(m => m.criteria_id === oralCriteriaId);
      const oralSum = oralMarks.reduce((sum, m) => sum + m.score, 0);
      const oralScore = parseFloat((oralSum / divisor).toFixed(2));
      
      // Calculate detailed breakdown by judge
      const judgeDetails = judges.map(judge => {
        const judgeMarks = paperMarks.filter(m => m.judge_id === judge.id);
        const totalGiven = judgeMarks.reduce((sum, m) => sum + m.score, 0);
        const commentObj = paperComments.find(c => c.judge_id === judge.id);
        
        const criteriaScores = {};
        judgeMarks.forEach(m => {
          const crit = criteria.find(c => c.id === m.criteria_id);
          if (crit) {
            criteriaScores[crit.name] = m.score;
          }
        });

        return {
          judgeId: judge.id,
          judgeName: judge.name,
          totalGiven,
          criteriaScores,
          comment: commentObj ? commentObj.comment : ''
        };
      });

      return {
        ...paper,
        totalScore,
        oralScore,
        judgeDetails
      };
    });

    // Sort by total score descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
