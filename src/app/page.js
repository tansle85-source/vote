import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-center" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        Technical Paper Competition
      </h1>
      <p className="text-center" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
        Welcome to the official voting system for the Technical Paper Competition. 
        Judges can securely log in to cast their votes based on multiple criteria, 
        while admins can oversee the live leaderboard and manage submissions.
      </p>

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
