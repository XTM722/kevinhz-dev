import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Offline')
  // New State: Tracks which "Tab" is currently open
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    fetch('/api')
      .then(res => {
        if (res.ok) setServerStatus('Online')
      })
      .catch(err => {
        setServerStatus('Offline')
      })
  }, [])

  // Helper function to check if a tab is active for styling
  const getNavClass = (tabName) => {
    return activeTab === tabName ? "nav-item active" : "nav-item"
  }

  return (
    <div className="app-container">
      
      {/* --- NAVBAR (Tab Controller) --- */}
      <nav className="navbar">
        {/* Clicking Logo goes back to Home */}
        <div className="logo" onClick={() => setActiveTab('home')} style={{cursor: 'pointer'}}>
          kevinhz<span className="dot">.dev</span>
        </div>
        
        <div className="nav-links">
          {/* We use buttons now instead of anchor tags */}
          <button className={getNavClass('home')} onClick={() => setActiveTab('home')}>Home</button>
          <button className={getNavClass('blog')} onClick={() => setActiveTab('blog')}>Blog</button>
          <button className={getNavClass('changelog')} onClick={() => setActiveTab('changelog')}>Changelog</button>
          <button className={getNavClass('tools')} onClick={() => setActiveTab('tools')}>Tools</button>
          <button className={getNavClass('about')} onClick={() => setActiveTab('about')}>About</button>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">

        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <header className="hero fade-in">
            <div className="hero-content">
              <h2 className="greeting">Hi, I'm Kevin</h2>
              <h1 className="title">
                Full Stack Developer <br />
                & <span className="highlight">Statistics Student</span>
              </h1>
              <p className="subtitle">
                Studying <strong>Statistics, Economics, and Linguistics</strong> at UTSC. <br />
                Building custom web infrastructure to understand the full data lifecycle.
              </p>
              <div className="cta-group">
                <button onClick={() => setActiveTab('tools')} className="btn btn-primary">View My Stack</button>
                <a href="https://github.com/XTM722" target="_blank" className="btn btn-secondary">
                  GitHub Profile
                </a>
              </div>
            </div>
          </header>
        )}

        {/* 2. BLOG TAB */}
        {activeTab === 'blog' && (
          <section className="section-tab fade-in">
            <div className="container">
              <h2>Latest Thoughts</h2>
              <div className="card-grid">
                <div className="card">
                  <h3>Moving to Self-Hosted</h3>
                  <p>Why I built a custom Linux home server instead of using managed cloud services.</p>
                  <span className="date">Jan 26, 2026</span>
                </div>
                <div className="card">
                  <h3>Data Science & React</h3>
                  <p>Exploring how to visualize statistical datasets using modern web libraries.</p>
                  <span className="date">Jan 12, 2026</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. CHANGELOG TAB */}
        {activeTab === 'changelog' && (
          <section className="section-tab fade-in">
            <div className="container">
              <h2>Changelog</h2>
              <ul className="changelog-list">
                <li>
                  <span className="date">v1.1.0</span>
                  <strong>UI Update:</strong> Converted single-page scroll to a tabbed application interface.
                </li>
                <li>
                  <span className="date">v1.0.0</span>
                  <strong>Portfolio Launch:</strong> Initial release with MERN Stack architecture.
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* 4. TOOLS TAB */}
        {activeTab === 'tools' && (
          <section className="section-tab fade-in">
            <div className="container">
              <h2>Tools & Stack</h2>
              <div style={{marginBottom: '20px'}}>
                <span className="badge" style={{
                    borderColor: serverStatus === 'Online' ? '#4ade80' : '#f87171', 
                    color: serverStatus === 'Online' ? '#4ade80' : '#f87171'
                }}>
                    ● Backend System: {serverStatus}
                </span>
              </div>
              <div className="tools-grid" style={{justifyContent: 'center'}}>
                <span className="badge">React (Vite)</span>
                <span className="badge">Node.js / Express</span>
                <span className="badge">MongoDB</span>
                <span className="badge">Linux / Bash</span>
                <span className="badge">R Studio</span>
              </div>
            </div>
          </section>
        )}

        {/* 5. ABOUT TAB */}
        {activeTab === 'about' && (
          <section className="section-tab fade-in">
            <div className="container">
              <h2>About Me</h2>
              <p style={{maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.6'}}>
                I am a student at the University of Toronto Scarborough (UTSC), specializing in 
                Statistics, Economics, and Linguistics. My goal is to combine rigorous data analysis 
                with modern software engineering to build reliable, high-performance systems.
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default App