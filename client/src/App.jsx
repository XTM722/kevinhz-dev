import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Offline')
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    // 👇 UPDATED: Pointing to your live Render Backend
    fetch('https://kevinhz-api.onrender.com/api') 
      .then(res => {
        if (res.ok) setServerStatus('Online')
      })
      .catch(err => {
        setServerStatus('Offline')
      })
  }, [])

  return (
    <div className="app-container">
      
      {/* --- NAVBAR (Tab Controller) --- */}
      <nav className="navbar">
        {/* 1. Left: Logo */}
        <div className="logo nav-item-left" onClick={() => setActiveTab('home')}>
          kevinhz<span className="dot">.dev</span>
        </div>
        
        {/* 2. Center: Tab Links */}
        <div className="nav-links">
          <button className={activeTab === 'home' ? "nav-item active" : "nav-item"} onClick={() => setActiveTab('home')}>Home</button>
          <button className={activeTab === 'blog' ? "nav-item active" : "nav-item"} onClick={() => setActiveTab('blog')}>Blog</button>
          <button className={activeTab === 'changelog' ? "nav-item active" : "nav-item"} onClick={() => setActiveTab('changelog')}>Changelog</button>
          <button className={activeTab === 'tools' ? "nav-item active" : "nav-item"} onClick={() => setActiveTab('tools')}>Tools</button>
          <button className={activeTab === 'about' ? "nav-item active" : "nav-item"} onClick={() => setActiveTab('about')}>About</button>
        </div>

        {/* 3. Right: GitHub Button (Balances the Logo) */}
        <div className="nav-item-right">
          <a href="https://github.com/XTM722" target="_blank" className="btn-small">
            {/* SVG GitHub Icon */}
            <svg height="16" viewBox="0 0 16 16" width="16" style={{marginRight: '8px', fill: 'currentColor'}}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            GitHub
          </a>
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
                {/* Kept primary button, removed secondary GitHub button */}
                <button onClick={() => setActiveTab('tools')} className="btn btn-primary">View My Stack</button>
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
                  <strong>UI Update:</strong> Converted single-page scroll to a tabbed application interface with balanced navigation.
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