"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [winner, setWinner] = useState(null);
  const [oralWinner, setOralWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in" style={{ gap: '3rem' }}>
      
      {/* Hero Section */}
      <div className="text-center mt-12 mb-4" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-color)', borderRadius: '9999px', fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          Official Voting Platform
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
          APTS 2026<br/>
          <span style={{ color: 'var(--text-primary)', WebkitTextFillColor: 'var(--text-primary)' }}>Penang Chapter</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Welcome to the premier platform for technical paper evaluation. Engage with groundbreaking research and cast your votes to shape the future of technology in Penang.
        </p>
      </div>

      {/* Action Buttons / Portals - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem', width: '100%', maxWidth: '900px' }}>
        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,249,255,0.8))' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', background: '#fff', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 10px 25px rgba(37,99,235,0.15)' }}>👨‍⚖️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Judge Portal</h2>
          <p style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>Access your secure dashboard to evaluate presentations and submit your scores.</p>
          <Link href="/judge" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px', width: '80%' }}>Enter as Judge</Link>
        </div>

        <div className="glass-panel text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', background: '#fff', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>⚙️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Admin Dashboard</h2>
          <p style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>Manage submissions, monitor live voting progress, and oversee the event.</p>
          <Link href="/admin" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px', width: '80%', background: '#fff' }}>Enter as Admin</Link>
        </div>
      </div>

      {/* Highlights Section (Leaderboard table removed) */}
      {!loading && winner && (
        <div style={{ width: '100%', maxWidth: '900px', marginTop: '2rem', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))' }}></div>
            <h3 style={{ margin: '0 1.5rem', color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Highlights</h3>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.1))' }}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
            
            {/* Overall Winner Card */}
            <div className="glass-panel animate-fade-in" style={{ borderLeft: '4px solid var(--accent-color)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-color)', fontWeight: '700', marginBottom: '0.25rem' }}>Top Overall Paper</div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{winner.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>By {winner.author}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{winner.totalScore}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pts</div>
              </div>
            </div>

            {/* Oral Winner Card */}
            {oralWinner && (
              <div className="glass-panel animate-fade-in" style={{ borderLeft: '4px solid #f59e0b', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem' }}>🎤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b', fontWeight: '700', marginBottom: '0.25rem' }}>Best Presentation</div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{oralWinner.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>By {oralWinner.author}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{oralWinner.oralScore}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pts</div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
