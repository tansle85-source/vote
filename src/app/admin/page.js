"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('papers'); // 'papers' or 'judges'
  const [judges, setJudges] = useState([]);
  const [passwordResets, setPasswordResets] = useState({});
  const [selectedPaperDetails, setSelectedPaperDetails] = useState(null);

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

  const handleSaveJudge = async (judgeId) => {
    const judge = judges.find(j => j.id === judgeId);
    const newPassword = passwordResets[judgeId];
    
    try {
      const res = await fetch(`/api/judges/${judgeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: judge.name, 
          organization: judge.organization, 
          email: judge.email, 
          password: newPassword || undefined 
        })
      });
      if (res.ok) {
        alert('Judge saved successfully!');
        if (newPassword) {
          setPasswordResets({ ...passwordResets, [judgeId]: '' });
        }
      } else {
        alert('Failed to save judge');
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
      if (res.ok && Array.isArray(data)) {
        setLeaderboard(data);
      } else {
        console.error("API Error:", data);
        alert("API Error: " + (data.error || "Unknown error"));
        setLeaderboard([]);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
      alert("Failed to fetch leaderboard: " + error.message);
      setLeaderboard([]);
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
            <div>
              <button onClick={fetchData} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Refresh</button>
              <a href="/api/export" download className="btn" style={{ textDecoration: 'none' }}>Download CSV</a>
            </div>
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
                    <th>Oral Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((paper, index) => (
                    <tr key={paper.id}>
                      <td>
                        <strong>#{index + 1}</strong>
                      </td>
                      <td>{paper.title}</td>
                      <td>{paper.author}</td>
                      <td>
                        <strong style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                          {paper.totalScore}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>
                          {paper.oralScore !== undefined ? paper.oralScore : 0}
                        </strong>
                      </td>
                      <td>    
                        <button 
                          onClick={() => setSelectedPaperDetails(paper)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', marginRight: '0.5rem' }}
                        >
                          View
                        </button>
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
          <p className="mb-4">Edit judge names, details, or set new passwords here. Click Save when done.</p>
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
                  <td>
                    <input 
                      type="text" 
                      style={{ marginBottom: 0, padding: '0.4rem', fontSize: '0.9rem' }}
                      value={judge.name} 
                      onChange={(e) => setJudges(judges.map(j => j.id === judge.id ? { ...j, name: e.target.value } : j))} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      style={{ marginBottom: 0, padding: '0.4rem', fontSize: '0.9rem' }}
                      value={judge.organization || ''} 
                      onChange={(e) => setJudges(judges.map(j => j.id === judge.id ? { ...j, organization: e.target.value } : j))} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      style={{ marginBottom: 0, padding: '0.4rem', fontSize: '0.9rem' }}
                      value={judge.email || ''} 
                      onChange={(e) => setJudges(judges.map(j => j.id === judge.id ? { ...j, email: e.target.value } : j))} 
                    />
                  </td>
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
                      onClick={() => handleSaveJudge(judge.id)}
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

      {selectedPaperDetails && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2>{selectedPaperDetails.title}</h2>
              <button onClick={() => setSelectedPaperDetails(null)} className="btn btn-secondary">Close</button>
            </div>
            <p><strong>Author:</strong> {selectedPaperDetails.author}</p>
            <div style={{ margin: '2rem 0' }}>
              {selectedPaperDetails.judgeDetails && selectedPaperDetails.judgeDetails.map(jd => (
                <div key={jd.judgeId} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                  <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    {jd.judgeName} <span style={{ float: 'right', color: 'var(--accent-color)' }}>{jd.totalGiven > 0 ? `${jd.totalGiven} / 100` : 'Not Evaluated'}</span>
                  </h3>
                  {jd.totalGiven > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {Object.entries(jd.criteriaScores).map(([critName, score]) => (
                        <div key={critName}>
                          <span style={{ color: '#555' }}>{critName}:</span> <strong>{score}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {jd.comment && (
                    <div style={{ background: '#fff', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                      <strong>Comment:</strong> <i>"{jd.comment}"</i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
