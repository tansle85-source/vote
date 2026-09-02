"use client";

import Link from 'next/link';

export default function Home() {

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


    </div>
  );
}
