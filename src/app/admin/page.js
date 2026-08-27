"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('papers'); // 'papers' or 'judges'
  const [judges, setJudges] = useState([]);
  const [passwordResets, setPasswordResets] = useState({});

  const [papers, setPapers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPaper, setNewPaper] = useState({ title: '', author: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
      fetchJudges();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', username: authUsername, password: authPassword })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        fetchData();
        fetchJudges();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  const fetchJudges = async () => {
    try {
      const res = await fetch('/api/judges');
      const data = await res.json();
      setJudges(data);
    } catch (error) {
      console.error("Failed to fetch judges", error);
    }
  };

  const handleResetPassword = async (judgeId) => {
    const newPassword = passwordResets[judgeId];
    if (!newPassword) return alert('Enter a new password');
    
    try {
      const res = await fetch(`/api/judges/${judgeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        alert('Password saved successfully!');
        setPasswordResets({ ...passwordResets, [judgeId]: '' });
      } else {
        alert('Failed to save password');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
    setLoading(false);
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaper)
      });
      setNewPaper({ title: '', author: '', description: '' });
      fetchData();
    } catch (error) {
      console.error("Failed to add paper", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this paper and all its marks?')) return;
    try {
      await fetch(`/api/papers/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Failed to delete paper", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input type="text" required value={authUsername} onChange={e => setAuthUsername(e.target.value)} />
            <label>Password</label>
            <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
            <button type="submit" className="btn mt-4" style={{ width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div>
          <button onClick={() => setActiveTab('papers')} className={`btn ${activeTab === 'papers' ? '' : 'btn-secondary'}`} style={{ marginRight: '1rem' }}>Manage Papers</button>
          <button onClick={() => setActiveTab('judges')} className={`btn ${activeTab === 'judges' ? '' : 'btn-secondary'}`} style={{ marginRight: '1rem' }}>Manage Judges</button>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>
      
      {activeTab === 'papers' ? (
        <div className="grid grid-cols-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-panel">
          <h2>Add New Paper</h2>
          <form onSubmit={handleAddPaper}>
            <label>Title</label>
            <input 
              type="text" 
              required 
              value={newPaper.title}
              onChange={(e) => setNewPaper({...newPaper, title: e.target.value})} 
            />
            
            <label>Author(s)</label>
            <input 
              type="text" 
              required 
              value={newPaper.author}
              onChange={(e) => setNewPaper({...newPaper, author: e.target.value})} 
            />
            
            <label>Description</label>
            <textarea 
              rows="3"
              value={newPaper.description}
              onChange={(e) => setNewPaper({...newPaper, description: e.target.value})} 
            />
            
            <button type="submit" className="btn" style={{ width: '100%' }}>Add Paper</button>
          </form>
        </div>

        <div className="glass-panel">
          <div className="flex justify-between items-center mb-4">
            <h2>Live Leaderboard</h2>
            <button onClick={fetchData} className="btn btn-secondary">Refresh</button>
          </div>
          
          {loading ? (
            <p>Loading leaderboard...</p>
          ) : leaderboard.length === 0 ? (
            <p>No papers submitted yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Paper Title</th>
                    <th>Author</th>
                    <th>Total Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((paper, index) => (
                    <tr key={paper.id}>
                      <td>#{index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{paper.title}</td>
                      <td>{paper.author}</td>
                      <td className="score-display" style={{ textAlign: 'left', fontSize: '1.2rem' }}>
                        {paper.totalScore}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(paper.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      ) : (
        <div className="glass-panel">
          <h2>Manage Judges</h2>
          <p className="mb-4">Set new passwords for the judges here. Type the new password and click Save.</p>
          <table>
            <thead>
              <tr>
                <th>Judge Name</th>
                <th>Organization</th>
                <th>Email</th>
                <th>New Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {judges.map(judge => (
                <tr key={judge.id}>
                  <td style={{ fontWeight: 600 }}>{judge.name}</td>
                  <td>{judge.organization || '-'}</td>
                  <td>{judge.email || '-'}</td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="New password" 
                      style={{ marginBottom: 0, padding: '0.4rem', fontSize: '0.9rem' }}
                      value={passwordResets[judge.id] || ''}
                      onChange={(e) => setPasswordResets({ ...passwordResets, [judge.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button 
                      onClick={() => handleResetPassword(judge.id)}
                      className="btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
