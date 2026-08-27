"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JudgePortal() {
  const router = useRouter();
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch('/api/judges')
      .then(res => res.json())
      .then(data => {
        setJudges(data);
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedJudge) return;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'judge', judge_id: selectedJudge.id, password })
      });
      const data = await res.json();
      if (data.success) {
        // Simple auth for prototype
        localStorage.setItem(`judgeAuth_${selectedJudge.id}`, 'true');
        router.push(`/judge/${selectedJudge.id}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  if (selectedJudge) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
          <button className="btn btn-secondary mb-4" onClick={() => { setSelectedJudge(null); setPassword(''); }}>
            ← Back to Judge List
          </button>
          <h2 className="text-center mb-4">Login as {selectedJudge.name}</h2>
          <form onSubmit={handleLogin}>
            <label>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="btn mt-4" style={{ width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      <h1 className="text-center mb-4">Select Judge Profile</h1>
      <p className="text-center mb-8">Please select your judge profile to login.</p>
      
      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', width: '100%', maxWidth: '800px' }}>
          {judges.map(judge => (
            <div key={judge.id} onClick={() => setSelectedJudge(judge)} className="glass-panel text-center" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚖️</div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{judge.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
