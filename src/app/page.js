"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [winner, setWinner] = useState(null);
  const [oralWinner, setOralWinner] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLeaderboard(data);
          // Overall winner
          setWinner(data[0]);
          
          // Best Oral Presentation winner
          const sortedByOral = [...data].sort((a, b) => b.oralScore - a.oralScore);
          if (sortedByOral[0] && sortedByOral[0].oralScore > 0) {
            setOralWinner(sortedByOral[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch winner", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-center" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Technical Paper Competition
      </h1>
      <p className="text-center" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        Welcome to the official voting system for the Technical Paper Competition. 
        Judges can securely log in to cast their votes based on multiple criteria, 
        while admins can oversee the live leaderboard and manage submissions.
      </p>

      {!loading && winner && (
        <div className="grid grid-cols-2" style={{ gap: '2rem', width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
          
          {/* Overall Winner Card */}
          <div className="glass-panel text-center animate-fade-in" style={{ border: '2px solid var(--accent-color)', background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <h2 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>Overall Leader</h2>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{winner.title}</h3>
            <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>By: {winner.author}</p>
            <div className="score-display" style={{ fontSize: '1.5rem', justifyContent: 'center', display: 'flex' }}>
              Score: {winner.totalScore}
            </div>
          </div>

          {/* Oral Winner Card */}
          {oralWinner && (
            <div className="glass-panel text-center animate-fade-in" style={{ border: '2px solid #f59e0b', background: 'linear-gradient(to bottom right, #ffffff, #fffbeb)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎤</div>
              <h2 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Best Presentation</h2>
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{oralWinner.title}</h3>
              <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>By: {oralWinner.author}</p>
              <div className="score-display" style={{ fontSize: '1.5rem', justifyContent: 'center', display: 'flex', color: '#f59e0b', borderColor: '#f59e0b', backgroundColor: '#fffbeb' }}>
                Oral Score: {oralWinner.oralScore}
              </div>
            </div>
          )}
          
        </div>
      )}

      {/* Full Live Leaderboard Table */}
      {!loading && leaderboard.length > 0 && (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Live Leaderboard Ranking</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>Rank</th>
                  <th style={{ padding: '1rem' }}>Paper Title</th>
                  <th style={{ padding: '1rem' }}>Author</th>
                  <th style={{ padding: '1rem' }}>Total Score</th>
                  <th style={{ padding: '1rem' }}>Oral Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((paper, index) => (
                  <tr key={paper.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}><strong>#{index + 1}</strong></td>
                    <td style={{ padding: '1rem' }}>{paper.title}</td>
                    <td style={{ padding: '1rem', color: '#555' }}>{paper.author}</td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>{paper.totalScore}</strong>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{paper.oralScore !== undefined ? paper.oralScore : 0}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2" style={{ gap: '2rem', width: '100%', maxWidth: '800px' }}>
        <div className="glass-panel text-center">
          <h2 style={{ marginBottom: '1rem' }}>👨‍⚖️ Judge Portal</h2>
          <p style={{ marginBottom: '2rem' }}>Access your personalized dashboard to evaluate papers and submit scores.</p>
          <Link href="/judge" className="btn" style={{ width: '100%' }}>Enter as Judge</Link>
        </div>

        <div className="glass-panel text-center">
          <h2 style={{ marginBottom: '1rem' }}>⚙️ Admin Dashboard</h2>
          <p style={{ marginBottom: '2rem' }}>Manage papers, view real-time results, and oversee the competition.</p>
          <Link href="/admin" className="btn btn-secondary" style={{ width: '100%' }}>Enter as Admin</Link>
        </div>
      </div>
    </div>
  );
}
