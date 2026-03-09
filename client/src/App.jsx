import { useState, useEffect, useRef } from 'react'
import './App.css'

const SKILLS = [
  { name: 'React / Vite', level: 75 },
  { name: 'Node.js / Express', level: 65 },
  { name: 'MongoDB', level: 60 },
  { name: 'R / Statistics', level: 80 },
  { name: 'Linux / Bash', level: 55 },
]

const TABS = ['home', 'blog', 'changelog', 'tools', 'about']

function SkillBar({ name, level }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="skill-item" ref={ref}>
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{ width: animated ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  )
}

function NavBar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="nav-item-left logo" onClick={() => setActiveTab('home')}>
        kevinhz<span className="dot">.dev</span>
      </div>

      <div className="nav-links">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="nav-item-right">
        <a href="https://github.com/XTM722" target="_blank" className="btn-small">
          <svg height="16" viewBox="0 0 16 16" width="16" style={{ marginRight: '8px', fill: 'currentColor' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>
    </nav>
  )
}

function HomeTab({ setActiveTab }) {
  return (
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
          <button onClick={() => setActiveTab('tools')} className="btn btn-primary">
            View My Stack
          </button>
        </div>
      </div>
    </header>
  )
}

function BlogTab() {
  const posts = [
    {
      title: 'Moving to Self-Hosted',
      desc: 'Why I built a custom Linux home server instead of using managed cloud services.',
      date: 'Jan 26, 2026',
    },
    {
      title: 'Data Science & React',
      desc: 'Exploring how to visualize statistical datasets using modern web libraries.',
      date: 'Jan 12, 2026',
    },
  ]

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>Latest Thoughts</h2>
        <div className="card-grid">
          {posts.map(post => (
            <div className="card" key={post.title}>
              <h3>{post.title}</h3>
              <p>{post.desc}</p>
              <span className="date">{post.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChangelogTab() {
  const entries = [
    { version: 'v1.2.0', desc: 'Added animated skill progress bars to the Tools section.' },
    { version: 'v1.1.0', desc: 'UI Update: Converted single-page scroll to a tabbed application interface with balanced navigation.' },
    { version: 'v1.0.0', desc: 'Portfolio Launch: Initial release with MERN Stack architecture.' },
  ]

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>Changelog</h2>
        <ul className="changelog-list">
          {entries.map(entry => (
            <li key={entry.version}>
              <span className="date">{entry.version}</span>
              {entry.desc}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ToolsTab({ serverStatus }) {
  const badges = ['React (Vite)', 'Node.js / Express', 'MongoDB', 'Linux / Bash', 'R Studio']
  const isOnline = serverStatus === 'Online'

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>Tools & Stack</h2>

        <div style={{ marginBottom: '20px' }}>
          <span className="badge" style={{
            borderColor: isOnline ? '#4ade80' : '#f87171',
            color: isOnline ? '#4ade80' : '#f87171',
          }}>
            ● Backend System: {serverStatus}
          </span>
        </div>

        <div className="tools-grid">
          {badges.map(b => <span className="badge" key={b}>{b}</span>)}
        </div>

        <div className="skills-section">
          <h3 className="skills-title">Skill Levels</h3>
          {SKILLS.map(skill => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutTab() {
  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>About Me</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.6' }}>
          I am a student at the University of Toronto Scarborough (UTSC), specializing in
          Statistics, Economics, and Linguistics. My goal is to combine rigorous data analysis
          with modern software engineering to build reliable, high-performance systems.
        </p>
      </div>
    </section>
  )
}

export default function App() {
  const [serverStatus, setServerStatus] = useState('Offline')
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    fetch('https://kevinhz-api.onrender.com/api')
      .then(res => { if (res.ok) setServerStatus('Online') })
      .catch(() => setServerStatus('Offline'))
  }, [])

  return (
    <div className="app-container">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'home'      && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'blog'      && <BlogTab />}
        {activeTab === 'changelog' && <ChangelogTab />}
        {activeTab === 'tools'     && <ToolsTab serverStatus={serverStatus} />}
        {activeTab === 'about'     && <AboutTab />}
      </main>
    </div>
  )
}