"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JudgeScoring() {
  const params = useParams();
  const router = useRouter();
  const judgeId = params.judgeId;

  const [judge, setJudge] = useState(null);
  const [papers, setPapers] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  
  // State for current marks being entered: { criteriaId: score }
  const [marks, setMarks] = useState({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('scoring'); // 'scoring' or 'profile'
  
  // Profile state
  const [profileForm, setProfileForm] = useState({ name: '', organization: '', email: '', password: '' });

  useEffect(() => {
    // Check auth
    if (localStorage.getItem(`judgeAuth_${judgeId}`) !== 'true') {
      router.push('/judge');
      return;
    }

    // Fetch judge details to ensure valid access
    fetch('/api/judges')
      .then(res => res.json())
      .then(data => {
        const currentJudge = data.find(j => j.id.toString() === judgeId);
        if (!currentJudge) {
          router.push('/judge');
        } else {
          setJudge(currentJudge);
          setProfileForm({ name: currentJudge.name, organization: currentJudge.organization || '', email: currentJudge.email || '', password: '' });
        }
      });

    // Fetch papers
    fetch('/api/papers')
      .then(res => res.json())
      .then(data => setPapers(data));

    // Fetch criteria
    fetch('/api/criteria')
      .then(res => res.json())
      .then(data => {
        setCriteria(data);
        // Initialize marks state
        const initialMarks = {};
        data.forEach(c => initialMarks[c.id] = c.max_score / 2);
        setMarks(initialMarks);
      });
  }, [judgeId, router]);

  const handleScoreChange = (criteriaId, score) => {
    setMarks(prev => ({
      ...prev,
      [criteriaId]: parseInt(score)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaper) {
      alert("Please select a paper to evaluate.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judge_id: judgeId,
          paper_id: selectedPaper,
          marks,
          comment
        })
      });
      
      if (res.ok) {
        alert("Scores submitted successfully!");
      } else {
        alert("Failed to submit scores.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
    setIsSubmitting(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/judges/${judgeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setJudge({ ...judge, name: profileForm.name });
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem(`judgeAuth_${judgeId}`);
    router.push('/judge');
  };

  if (!judge) return <div className="mt-8 text-center">Loading...</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Welcome, {judge.name}</h1>
        <div>
          <button className={`btn ${activeTab === 'scoring' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('scoring')} style={{ marginRight: '1rem' }}>Evaluate Papers</button>
          <button className={`btn ${activeTab === 'profile' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('profile')} style={{ marginRight: '1rem' }}>My Profile</button>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {activeTab === 'scoring' ? (
      <div className="grid grid-cols-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-panel">
          <h2>Papers to Evaluate</h2>
          {papers.length === 0 ? (
            <p>No papers have been submitted for evaluation yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {papers.map(paper => (
                <button
                  key={paper.id}
                  onClick={() => {
                    setSelectedPaper(paper.id);
                    // Fetch existing marks and comment for this paper
                    fetch(`/api/marks?judge_id=${judgeId}&paper_id=${paper.id}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data && data.marks) {
                          if (Object.keys(data.marks).length > 0) {
                            setMarks(data.marks);
                          } else {
                            // Reset to defaults
                            const defaultMarks = {};
                            criteria.forEach(c => defaultMarks[c.id] = c.max_score / 2);
                            setMarks(defaultMarks);
                          }
                          setComment(data.comment || "");
                        }
                      })
                      .catch(err => {
                        console.error("Failed to load existing marks", err);
                      });
                  }}
                  className={`btn ${selectedPaper === paper.id ? '' : 'btn-secondary'}`}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  {paper.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel">
          {selectedPaper ? (
            <>
              <h2>Evaluation Form</h2>
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>{papers.find(p => p.id === selectedPaper)?.title}</h3>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Author: {papers.find(p => p.id === selectedPaper)?.author}</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{papers.find(p => p.id === selectedPaper)?.description}</p>
              </div>

              <form onSubmit={handleSubmit}>
                {criteria.map(c => (
                  <div key={c.id} style={{ marginBottom: '1.5rem' }}>
                    <div className="flex justify-between items-center mb-2">
                      <label style={{ margin: 0 }}>{c.name}</label>
                      <div className="score-display">
                        {marks[c.id] || 0} / {c.max_score}
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={c.max_score} 
                      value={marks[c.id] || 0}
                      onChange={(e) => handleScoreChange(c.id, e.target.value)}
                    />
                  </div>
                ))}
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ margin: 0, display: 'block', marginBottom: '0.5rem' }}>Judge Comment</label>
                  <textarea 
                    rows="4" 
                    placeholder="Enter your comment and feedback here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.2rem' }}>
                    Total Score: <strong className="score-display" style={{ fontSize: '1.8rem' }}>
                      {Object.values(marks).reduce((a, b) => a + b, 0)}
                    </strong>
                  </div>
                  <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Scores'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📄</div>
              <h3 style={{ color: 'var(--text-secondary)' }}>Select a paper from the list to start evaluating.</h3>
            </div>
          )}
        </div>
      </div>
      ) : (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Edit Profile</h2>
          <form onSubmit={handleProfileUpdate}>
            <label>Name</label>
            <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
            
            <label>Organization</label>
            <input type="text" value={profileForm.organization} onChange={e => setProfileForm({...profileForm, organization: e.target.value})} />
            
            <label>Email</label>
            <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
            
            <label>Change Password (leave blank to keep current)</label>
            <input type="password" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} />
            
            <button type="submit" className="btn mt-4" style={{ width: '100%' }}>Save Profile</button>
          </form>
        </div>
      )}
    </div>
  );
}
