import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Offline')

  useEffect(() => {
    fetch('/api')
      .then(res => {
        if (res.ok) setServerStatus('Online')
      })
      .catch(err => {
        console.log("Backend currently offline (Safe Mode)")
        setServerStatus('Offline')
      })
  }, [])

  return (
    <div className="app-container">
      
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="logo">kevinhz<span className="dot">.dev</span></div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#blog">Blog</a>
          <a href="#changelog">Changelog</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
        </div>
      </nav>

      {/* --- HERO SECTION (Updated: Honest & Student Focused) --- */}
      <header id="home" className="hero">
        <div className="hero-content">
          <h2 className="greeting">Hi, I'm Kevin</h2>
          
          {/* TITLE: Focus on the Tech & The Data (Safe for your major) */}
          <h1 className="title">
            Full Stack Developer <br />
            & <span className="highlight">Statistics Student</span>
          </h1>
          
          {/* SUBTITLE: Lists your actual majors. This is unique and impressive. */}
          <p className="subtitle">
            Studying <strong>Statistics, Economics, and Linguistics</strong> at UTSC. <br />
            Building custom web infrastructure to understand the full data lifecycle.
          </p>

          <div className="cta-group">
            <a href="#tools" className="btn btn-primary">View My Stack</a>
            <a href="https://github.com/XTM722" target="_blank" className="btn btn-secondary">
              GitHub Profile
            </a>
          </div>
        </div>
      </header>

      {/* --- BLOG (Updated: Removed Finance References) --- */}
      <section id="blog" className="section-alt">
        <div className="container" style={{textAlign: 'center'}}>
          <h2>Latest Thoughts</h2>
          <div className="card-grid">
            <div className="card">
              <h3>Moving to Self-Hosted</h3>
              <p>Why I built a custom Linux home server instead of using managed cloud services.</p>
              <span className="date">Jan 26, 2026</span>
            </div>
            {/* Replaced 'Trading' with 'Data Analysis' - safe for a Stats student */}
            <div className="card">
              <h3>Data Science & React</h3>
              <p>Exploring how to visualize statistical datasets using modern web libraries.</p>
              <span className="date">Jan 12, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CHANGELOG --- */}
      <section id="changelog" className="section">
        <div className="container">
          <h2 style={{textAlign: 'center'}}>Changelog</h2>
          <ul className="changelog-list">
            <li>
              <span className="date">v1.0.0</span>
              <strong>Portfolio Launch:</strong> Initial release with MERN Stack architecture.
            </li>
            <li>
              <span className="date">v0.9.0</span>
              <strong>Environment:</strong> Established local development environment with Vite & Express.
            </li>
          </ul>
        </div>
      </section>

      {/* --- TOOLS --- */}
      <section id="tools" className="section-alt">
        <div className="container" style={{textAlign: 'center'}}>
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

      {/* --- ABOUT --- */}
      <section id="about" className="section">
        <div className="container" style={{textAlign: 'center'}}>
          <h2>About Me</h2>
          <p style={{maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.6'}}>
            I am a student at the University of Toronto Scarborough (UTSC), Majoring in 
            Statistics, Minoring in Economics and Linguistics. My goal is to combine rigorous data analysis 
            with modern software engineering to build reliable, high-performance systems.
          </p>
        </div>
      </section>

    </div>
  )
}

export default App