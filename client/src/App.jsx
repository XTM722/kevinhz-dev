import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

const API = 'http://localhost:5001/api'

const SKILLS = [
  { name: 'React / Vite', level: 75 },
  { name: 'Node.js / Express', level: 65 },
  { name: 'MongoDB', level: 60 },
  { name: 'R / Statistics', level: 80 },
  { name: 'Linux / Bash', level: 55 },
]

const TABS = ['home', 'blog', 'changelog', 'tools', 'friends', 'about']

// ─── PARTICLE CANVAS ──────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    // Get the parent container (.hero) to dynamically track its true DOM size
    const parent = canvas.parentElement
    
    let animId
    const mouse = { x: null, y: null }

    const PARTICLE_COUNT = 70
    const MAX_DIST       = 150
    const MOUSE_RADIUS   = 200

    // PRO FIX: Sync canvas internal resolution with its actual parent DOM element
    // instead of the window object. This prevents stretching and clipping.
    function resize() {
      if (parent) {
        canvas.width  = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    // Initial sizing
    resize()

    // PRO FIX: Use ResizeObserver instead of window 'resize' event. 
    // This perfectly catches layout shifts, mobile keyboard popups, or content wrapping.
    const resizeObserver = new ResizeObserver(() => resize())
    if (parent) {
      resizeObserver.observe(parent)
    }

    // Track mouse globally so the effect works even when the mouse leaves the canvas area
    function onMouseMove(e) {
      // Calculate mouse position relative to the canvas/hero top-left corner
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    
    function onMouseLeave() { 
      mouse.x = null; 
      mouse.y = null 
    }
    
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    // Main animation loop
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        
        // Bounce particles off the dynamically sized boundaries
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx   = p.x - mouse.x
          const dy   = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
            p.vx += (dx / dist) * force * 0.4
            p.vy += (dy / dist) * force * 0.4
          }
        }

        // Enforce a maximum speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2) { 
          p.vx = (p.vx / speed) * 2; 
          p.vy = (p.vy / speed) * 2 
        }

        // Render particles
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)'
        ctx.fill()
      }

      // Render connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - dist / MAX_DIST)})`
            ctx.lineWidth   = 1
            ctx.stroke()
          }
        }

        // Render mouse interaction lines
        if (mouse.x !== null && mouse.y !== null) {
          const dx   = particles[i].x - mouse.x
          const dy   = particles[i].y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < MOUSE_RADIUS) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * (1 - dist / MOUSE_RADIUS)})`
            ctx.lineWidth   = 1.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    // Initialize particles array
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r:  Math.random() * 2 + 1.5,
    }))

    draw()

    // Cleanup phase: prevent memory leaks
    return () => {
      cancelAnimationFrame(animId)
      if (parent) resizeObserver.unobserve(parent)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

// ─── SKILL BAR ────────────────────────────────────────────────────────────────

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
        <div className="skill-fill" style={{ width: animated ? `${level}%` : '0%' }} />
      </div>
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function NavBar({ activeTab, setActiveTab, lang, setLang }) {
  const tabLabels = {
    home:      { en: 'Home',      zh: '首页' },
    blog:      { en: 'Blog',      zh: '博客' },
    changelog: { en: 'Changelog', zh: '更新日志' },
    tools:     { en: 'Tools',     zh: '技术栈' },
    friends:   { en: 'Friends',   zh: '友情链接' },
    about:     { en: 'About',     zh: '关于' },
  }

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
            {tabLabels[tab][lang]}
          </button>
        ))}
      </div>

      <div className="nav-item-right" style={{ gap: '0.75rem' }}>
        <div className="lang-switch">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>中</button>
        </div>
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

// ─── HOME TAB ─────────────────────────────────────────────────────────────────

function HomeTab({ setActiveTab, lang }) {
  const content = {
    en: {
      greeting: "Hi, I'm Kevin",
      title1:   'Full Stack Developer',
      title2:   'Statistics Student',
      subtitle: 'Studying Statistics, Economics, and Linguistics at UTSC. Building custom web infrastructure to understand the full data lifecycle.',
      btn:      'View My Stack',
    },
    zh: {
      greeting: '你好，我是 Kevin',
      title1:   '全栈开发者',
      title2:   '统计学学生',
      subtitle: '就读于多伦多大学士嘉堡分校（UTSC），主修统计学、经济学与语言学。通过构建自定义 Web 基础设施来理解完整的数据生命周期。',
      btn:      '查看我的技术栈',
    },
  }
  const t = content[lang]

  return (
    <header className="hero fade-in">
      <ParticleCanvas />
      <div className="hero-content">
        <h2 className="greeting">{t.greeting}</h2>
        <h1 className="title">
          {t.title1} <br />& <span className="highlight">{t.title2}</span>
        </h1>
        <p className="subtitle">{t.subtitle}</p>
        <div className="cta-group">
          <button onClick={() => setActiveTab('tools')} className="btn btn-primary">
            {t.btn}
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── BLOG TAB ─────────────────────────────────────────────────────────────────

function BlogTab({ lang }) {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setError('Failed to load posts.'); setLoading(false) })
  }, [])

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>{lang === 'zh' ? '最新文章' : 'Latest Thoughts'}</h2>
        {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
        {error   && <p style={{ color: '#f87171' }}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p style={{ color: '#94a3b8' }}>{lang === 'zh' ? '暂无文章' : 'No posts yet.'}</p>
        )}
        <div className="card-grid">
          {posts.map(post => (
            <div className="card" key={post._id} onClick={() => navigate(`/blog/${post.slug}`)} style={{ cursor: 'pointer' }}>
              <h3>{post.title[lang] || post.title.en}</h3>
              <p>{post.excerpt?.[lang] || post.excerpt?.en || ''}</p>
              {post.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {post.tags.map(tag => (
                    <span key={tag} className="badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="date">
                {new Date(post.createdAt).toLocaleDateString(
                  lang === 'zh' ? 'zh-CN' : 'en-CA',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CHANGELOG TAB ────────────────────────────────────────────────────────────

function ChangelogTab({ lang }) {
  const entries = [
    { version: 'v1.3.0', en: 'Connected Blog to real MongoDB API with bilingual support and friend links page.', zh: '将博客连接到真实 MongoDB API，支持双语显示，并添加友情链接页面。' },
    { version: 'v1.2.0', en: 'Added animated skill progress bars to the Tools section.',                         zh: '在技术栈页面添加了动画技能进度条。' },
    { version: 'v1.1.0', en: 'UI Update: Converted single-page scroll to a tabbed application interface.',      zh: 'UI 更新：将单页滚动改为标签页应用界面。' },
    { version: 'v1.0.0', en: 'Portfolio Launch: Initial release with MERN Stack architecture.',                  zh: '作品集上线：基于 MERN Stack 架构的初始版本。' },
    { version: 'v1.4.0', en: 'Added individual blog post pages with slug-based routing and bilingual reading support.', zh: '新增博客文章独立页面，支持基于 slug 的路由跳转与双语阅读。' },
  ]

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>{lang === 'zh' ? '更新日志' : 'Changelog'}</h2>
        <ul className="changelog-list">
          {entries.map(entry => (
            <li key={entry.version}>
              <span className="date">{entry.version}</span>
              {entry[lang]}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─── TOOLS TAB ────────────────────────────────────────────────────────────────

function ToolsTab({ serverStatus, lang }) {
  const badges   = ['React (Vite)', 'Node.js / Express', 'MongoDB', 'Linux / Bash', 'R Studio']
  const isOnline = serverStatus === 'Online'

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>{lang === 'zh' ? '技术栈' : 'Tools & Stack'}</h2>
        <div style={{ marginBottom: '20px' }}>
          <span className="badge" style={{
            borderColor: isOnline ? '#4ade80' : '#f87171',
            color:       isOnline ? '#4ade80' : '#f87171',
          }}>
            ● {lang === 'zh' ? '后端系统' : 'Backend System'}: {serverStatus}
          </span>
        </div>
        <div className="tools-grid">
          {badges.map(b => <span className="badge" key={b}>{b}</span>)}
        </div>
        <div className="skills-section">
          <h3 className="skills-title">{lang === 'zh' ? '技能水平' : 'Skill Levels'}</h3>
          {SKILLS.map(skill => <SkillBar key={skill.name} name={skill.name} level={skill.level} />)}
        </div>
      </div>
    </section>
  )
}

// ─── FRIENDS TAB ──────────────────────────────────────────────────────────────

function FriendsTab({ lang }) {
  const [links, setLinks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/friendlinks`)
      .then(res => res.json())
      .then(data => { setLinks(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>{lang === 'zh' ? '友情链接' : 'Friend Links'}</h2>
        {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
        {!loading && links.length === 0 && (
          <p style={{ color: '#94a3b8' }}>{lang === 'zh' ? '暂无友情链接' : 'No friend links yet.'}</p>
        )}
        <div className="friends-grid">
          {links.map(link => (
            <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="friend-card">
              {link.avatar && <img src={link.avatar} alt={link.name} className="friend-avatar" />}
              <div className="friend-info">
                <strong className="friend-name">{link.name}</strong>
                {link.description?.[lang] && <p className="friend-desc">{link.description[lang]}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT TAB ────────────────────────────────────────────────────────────────

function AboutTab({ lang }) {
  const content = {
    en: 'I am a student at the University of Toronto Scarborough (UTSC), specializing in Statistics, Economics, and Linguistics. My goal is to combine rigorous data analysis with modern software engineering to build reliable, high-performance systems.',
    zh: '我是多伦多大学士嘉堡分校（UTSC）的学生，主修统计学、经济学与语言学。我的目标是将严谨的数据分析与现代软件工程相结合，构建可靠、高性能的系统。',
  }

  return (
    <section className="section-tab fade-in">
      <div className="container">
        <h2>{lang === 'zh' ? '关于我' : 'About Me'}</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#94a3b8', lineHeight: '1.8' }}>
          {content[lang]}
        </p>
      </div>
    </section>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [serverStatus, setServerStatus] = useState('Offline')
  const [activeTab, setActiveTab]       = useState('home')
  const [lang, setLang]                 = useState('en')

  useEffect(() => {
    fetch('https://kevinhz-api.onrender.com/api')
      .then(res => { if (res.ok) setServerStatus('Online') })
      .catch(() => setServerStatus('Offline'))
  }, [])

  return (
    <div className="app-container">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />
      <main className="main-content">
        {activeTab === 'home'      && <HomeTab setActiveTab={setActiveTab} lang={lang} />}
        {activeTab === 'blog'      && <BlogTab lang={lang} />}
        {activeTab === 'changelog' && <ChangelogTab lang={lang} />}
        {activeTab === 'tools'     && <ToolsTab serverStatus={serverStatus} lang={lang} />}
        {activeTab === 'friends'   && <FriendsTab lang={lang} />}
        {activeTab === 'about'     && <AboutTab lang={lang} />}
      </main>
    </div>
  )
}