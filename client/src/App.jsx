import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { quantSignalTheme } from './siteData.js' 
import "./App.css";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const SKILLS = [
  { name: 'React / Vite', level: 75 },
  { name: 'Node.js / Express', level: 65 },
  { name: 'MongoDB', level: 60 },
  { name: 'R / Statistics', level: 80 },
  { name: 'Linux / Bash', level: 55 },
]

const TABS = ['home', 'blog', 'changelog', 'tools', 'friends', 'about']

// ─── SKILL BAR (终端风进度条) ──────────────────────────────────────────
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
    <div ref={ref} style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--accent)' }}>{name}</span>
        <span style={{ fontWeight: 900 }}>{level}%</span>
      </div>
      <div style={{ background: 'var(--line)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ 
          width: animated ? `${level}%` : '0%', 
          height: '100%', 
          background: 'var(--warm)',
          transition: 'width 1s ease-out' 
        }} />
      </div>
    </div>
  )
}

// ─── HEADER (极客导航栏) ───────────────────────────────────────────
function NavBar({ activeTab, setActiveTab, lang, setLang, mode, setMode }) {
  const tabLabels = {
    home: { en: 'Home', zh: '首页' },
    blog: { en: 'Blog', zh: '博客' },
    changelog: { en: 'Changelog', zh: '更新日志' },
    tools: { en: 'Tools', zh: '工具与技术' },
    friends: { en: 'Friends', zh: '友链' },
    about: { en: 'About', zh: '关于' },
  }

  return (
    <header className="site-header">
      <a className="site-brand" onClick={() => setActiveTab('home')} style={{cursor: 'pointer'}}>
        <div className="brand-logo-wrapper">
          <img 
            src="/teemo-swag.png" 
            alt="Swag Teemo" 
            className="brand-logo-custom" 
          />
        </div>
        <span>kevinhz.dev</span>
      </a>
      <nav className="site-nav">
        {TABS.map(tab => (
          <a
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
            style={{cursor: 'pointer'}}
          >
            {tabLabels[tab][lang]}
          </a>
        ))}
      </nav>
      <div className="site-nav" style={{ gap: '16px', alignItems: 'center' }}>
        
        {/* 全新三态胶囊按钮 */}
        <div className="theme-toggle">
          <button className={`theme-btn ${mode === 'light' ? 'active' : ''}`} onClick={() => setMode('light')} title="Light Mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
          <button className={`theme-btn ${mode === 'dark' ? 'active' : ''}`} onClick={() => setMode('dark')} title="Dark Mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
          <button className={`theme-btn ${mode === 'system' ? 'active' : ''}`} onClick={() => setMode('system')} title="System Preference">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </button>
        </div>

        <a onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} style={{cursor: 'pointer', color: 'var(--warm)'}}>
          {lang === 'en' ? '中' : 'EN'}
        </a>
        <a href="https://github.com/XTM722" target="_blank" rel="noreferrer" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
           GitHub
        </a>
      </div>
    </header>
  )
}

// ─── HOME TAB (纯粹的终端风首页) ────────────────────────────────────
function HomeTab({ setActiveTab, lang }) {
  const t = {
    en: { greeting: "Hi, I'm Kevin", title1: '<Full Stack/>', title2: 'Statistics Student', subtitle: 'Studying Statistics, Economics, and Linguistics at UTSC. Building custom web infrastructure to understand the full data lifecycle.', btn: 'View My Stack' },
    zh: { greeting: '你好，我是 Kevin', title1: '<全栈开发/>', title2: '统计学与数据', subtitle: '就读于多伦多大学（UTSC），主修统计学、经济学与语言学。通过构建自定义 Web 基础设施来理解完整的数据生命周期。', btn: '查看我的技术栈' },
  }[lang]

  return (
    <section className="creator-hero">
      <div className="hero-stack">
        <p className="hero-kicker">{t.greeting}</p>
        <h1>
          <span>{t.title1}</span> <br/>
          <span className="hero-focus">{t.title2}</span>
        </h1>
        <p className="hero-copy">{t.subtitle}</p>
        <div className="hero-actions">
          <button className="button primary" onClick={() => setActiveTab('tools')}>{t.btn}</button>
          <button className="button ghost" onClick={() => setActiveTab('blog')}>{lang === 'en' ? 'Read Blog' : '读最新文章'}</button>
        </div>
      </div>
      <aside className="signal-card">
        <p className="terminal-line">$ curl kevinhz.dev/status</p>
        <dl>
          <div><dt>focus</dt><dd>data + markets</dd></div>
          <div><dt>school</dt><dd>UofT Statistics</dd></div>
          <div><dt>minor</dt><dd>linguistics / econ</dd></div>
          <div><dt>status</dt><dd>building in public</dd></div>
        </dl>
      </aside>
    </section>
  )
}

// ─── BLOG TAB ────────────────────────────────────────────────────────
function BlogTab({ lang }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="page-hero">
        <p className="hero-kicker">Writings</p>
        <h1>{lang === 'zh' ? '最新文章' : 'Latest Thoughts'}</h1>
      </section>
      <section className="page-grid">
        {loading && <p>Loading...</p>}
        {posts.map(post => (
          <article className="page-card" key={post._id} onClick={() => navigate(`/blog/${post.slug}`)} style={{cursor: 'pointer'}}>
            <span>{new Date(post.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-CA')}</span>
            <h3>{post.title[lang] || post.title.en}</h3>
            <p>{post.excerpt?.[lang] || post.excerpt?.en || ''}</p>
            <a style={{marginTop: '1rem', display: 'inline-block'}}>{lang === 'zh' ? '阅读' : 'Read'} →</a>
          </article>
        ))}
      </section>
    </>
  )
}

// ─── CHANGELOG TAB ───────────────────────────────────────────────────
function ChangelogTab({ lang }) {
  const entries = [
    { 
      version: 'v1.6.5', 
      en: 'Branding: Finally swapped everything to the "Cool Teemo" look. Fixed the friend list logos too.', 
      zh: '视觉更新：终于把全站都换成这只“拽哥提莫”了，顺便把之前坏掉的友链头像也修好啦。' 
    },
    { 
      version: 'v1.6.0', 
      en: 'Major UI Refactor: Transitioned to a pure Kevin Terminal layout with Quant Signal theme. Removed particle animations and added a tri-state (Light/Dark/System) toggle for a cleaner, data-focused aesthetic.', 
      zh: '重大 UI 重构：全面切换至 Terminal 极客终端布局与 Quant Signal 主题。移除粒子动画，新增三态（亮/暗/系统）主题切换，打造更纯粹、专注的数据控制台风格。' 
    },
    { version: 'v1.5.0', en: 'Upgraded blog rendering with Markdown...', zh: '升级博客渲染：支持 Markdown 与代码高亮...' },
    { version: 'v1.4.0', en: 'Added individual blog post pages...', zh: '新增博客文章独立页面，支持基于 slug 的路由跳转...' },
    { version: 'v1.3.0', en: 'Connected Blog to real MongoDB API...', zh: '将博客连接到真实 MongoDB API...' },
    { version: 'v1.0.0', en: 'Portfolio Launch: Initial release...', zh: '作品集上线：基于 MERN Stack 架构的初始版本。' }
  ]

  return (
    <>
      <section className="page-hero">
        <p className="hero-kicker">Commits</p>
        <h1>{lang === 'zh' ? '更新日志' : 'Changelog'}</h1>
        <p>small commits, visible thinking.</p>
      </section>
      <section className="page-grid">
        {entries.map(entry => (
          <article className="page-card" key={entry.version}>
            <span>{entry.version}</span>
            <p style={{marginTop: '1rem'}}>{entry[lang]}</p>
          </article>
        ))}
      </section>
    </>
  )
}

// ─── TOOLS TAB ───────────────────────────────────────────────────────
function ToolsTab({ serverStatus, lang }) {
  const isOnline = serverStatus === 'Online'
  return (
    <>
      <section className="page-hero">
        <p className="hero-kicker">Stack</p>
        <h1>{lang === 'zh' ? '技术栈' : 'Tools & Stack'}</h1>
        <p style={{color: isOnline ? 'var(--warm)' : '#f87171', fontWeight: 900}}>
          System Status: {serverStatus}
        </p>
      </section>
      <section className="page-grid">
        <article className="page-card wide" style={{ gridColumn: 'span 2' }}>
          <span>Skill Levels</span>
          <div style={{ marginTop: '20px' }}>
            {SKILLS.map(skill => <SkillBar key={skill.name} name={skill.name} level={skill.level} />)}
          </div>
        </article>
        <article className="page-card">
          <span>Core Stack</span>
          <h3 style={{marginBottom: '1rem'}}>MERN + Data</h3>
          <p>React (Vite), Node.js, Express, MongoDB. <br/><br/>Data workflow with Python, R Studio, Linux / Bash.</p>
        </article>
      </section>
    </>
  )
}

// ─── FRIENDS TAB ─────────────────────────────────────────────────────
function FriendsTab({ lang }) {
  const [links, setLinks] = useState([])
  
  useEffect(() => {
    fetch(`${API}/friendlinks`).then(res => res.json()).then(data => setLinks(data)).catch(()=>{})
  }, [])

  return (
    <>
      <section className="page-hero">
        <p className="hero-kicker">Network</p>
        <h1>{lang === 'zh' ? '友情链接' : 'Friend Links'}</h1>
      </section>
      <section className="page-grid">
        {links.map(link => (
          <article className="page-card" key={link._id}>
            {/* 👇 新增的头部结构：包含头像和名字 */}
            <div className="friend-header">
              {link.avatar && (
                <img src={link.avatar} alt={link.name} className="friend-avatar" />
              )}
              <span>{link.name}</span>
            </div>
            
            <p>{link.description?.[lang] || ''}</p>
            <a href={link.url} target="_blank" rel="noreferrer">Visit →</a>
          </article>
        ))}
      </section>
    </>
  )
}

// ─── ABOUT TAB ───────────────────────────────────────────────────────
function AboutTab({ lang }) {
  const content = {
    en: 'I am a student at the University of Toronto Scarborough (UTSC), specializing in Statistics, Economics, and Linguistics. My goal is to combine rigorous data analysis with modern software engineering to build reliable, high-performance systems.',
    zh: '我是多伦多大学士嘉堡分校（UTSC）的学生，主修统计学、经济学与语言学。我的目标是将严谨的数据分析与现代软件工程相结合，构建可靠、高性能的系统。',
  }
  return (
    <>
      <section className="page-hero">
        <p className="hero-kicker">Profile</p>
        <h1>{lang === 'zh' ? '关于我' : 'About Me'}</h1>
        <p>{content[lang]}</p>
      </section>
    </>
  )
}

// ─── MAIN APP (注入 Quant Signal 主题 + 自动监听系统) ──────────────
export default function App() {
  const [serverStatus, setServerStatus] = useState('Offline')
  const [activeTab, setActiveTab] = useState('home')
  const [lang, setLang] = useState('en')
  
  // 主题偏好：light | dark | system
  const [mode, setMode] = useState(() => localStorage.getItem('portfolioModePref') || 'system')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const activeMode = mode === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : mode;
      
      const vars = quantSignalTheme[activeMode]; 
      document.documentElement.style.colorScheme = activeMode;
      
      Object.entries(vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      
      // 保持颜色主题标识
      document.body.dataset.theme = "quant-signal";
      
      // "terminal-theme"
      document.body.dataset.template = "terminal-theme"; 
    };

    applyTheme();
    localStorage.setItem('portfolioModePref', mode);

    const handleSystemChange = () => {
      if (mode === 'system') applyTheme();
    };
    
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
    
  }, [mode]) // 依赖项是 mode，只要切换选项就会重新触发

  useEffect(() => {
    fetch('https://kevinhz-api.onrender.com/api')
      .then(res => { if (res.ok) setServerStatus('Online') })
      .catch(() => setServerStatus('Offline'))
  }, [])

  return (
    <div className="site-shell">
      <NavBar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        lang={lang} setLang={setLang} 
        mode={mode} setMode={setMode} 
      />
      <main>
        {activeTab === 'home'      && <HomeTab setActiveTab={setActiveTab} lang={lang} />}
        {activeTab === 'blog'      && <BlogTab lang={lang} />}
        {activeTab === 'changelog' && <ChangelogTab lang={lang} />}
        {activeTab === 'tools'     && <ToolsTab serverStatus={serverStatus} lang={lang} />}
        {activeTab === 'friends'   && <FriendsTab lang={lang} />}
        {activeTab === 'about'     && <AboutTab lang={lang} />}
      </main>
      <footer className="site-footer" style={{marginTop: '40px'}}>
        <span>© 2026 kevinhz.dev</span>
        <span>built with MERN-ish bones</span>
      </footer>
    </div>
  )
}