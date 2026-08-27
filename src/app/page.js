"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // The leaderboard API already sorts by totalScore descending
          setWinner(data[0]);
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
        <div className="glass-panel text-center animate-fade-in" style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem', border: '2px solid var(--accent-color)', background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>Current Leader</h2>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{winner.title}</h3>
          <p style={{ fontWeight: '600', marginBottom: '1rem' }}>By: {winner.author}</p>
          <div className="score-display" style={{ fontSize: '2rem', justifyContent: 'center', display: 'flex' }}>
            Score: {winner.totalScore}
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
