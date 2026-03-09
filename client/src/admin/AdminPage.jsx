import { useState, useEffect } from 'react'
import {
  login, logout, isLoggedIn,
  fetchAllPosts, createPost, updatePost, deletePost,
  fetchFriendLinks, createFriendLink, deleteFriendLink,
} from './api'
import './AdminPage.css'

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-logo">kevinhz<span>.dev</span></div>
        <p className="login-sub">Admin Dashboard</p>
        <form onSubmit={handleSubmit}>
          <input
            className="admin-input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── POST EDITOR ──────────────────────────────────────────────────────────────

const EMPTY_POST = {
  title:     { en: '', zh: '' },
  content:   { en: '', zh: '' },
  excerpt:   { en: '', zh: '' },
  slug:      '',
  tags:      '',
  published: false,
}

function PostEditor({ post, onSave, onCancel }) {
  const [form, setForm]     = useState(post || EMPTY_POST)
  const [lang, setLang]     = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  function setNested(field, key, value) {
    setForm(f => ({ ...f, [field]: { ...f[field], [key]: value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : form.tags,
      }
      await onSave(payload)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="post-editor" onSubmit={handleSubmit}>
      <div className="editor-header">
        <h2>{post ? 'Edit Post' : 'New Post'}</h2>
        <div className="lang-toggle">
          <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>中文</button>
        </div>
      </div>

      <label className="admin-label">Title ({lang.toUpperCase()})</label>
      <input
        className="admin-input"
        value={form.title[lang]}
        onChange={e => setNested('title', lang, e.target.value)}
        placeholder={lang === 'en' ? 'Post title' : '文章标题'}
        required
      />

      <label className="admin-label">Excerpt ({lang.toUpperCase()})</label>
      <input
        className="admin-input"
        value={form.excerpt[lang]}
        onChange={e => setNested('excerpt', lang, e.target.value)}
        placeholder={lang === 'en' ? 'Short description' : '简短描述'}
      />

      <label className="admin-label">Content ({lang.toUpperCase()})</label>
      <textarea
        className="admin-textarea"
        value={form.content[lang]}
        onChange={e => setNested('content', lang, e.target.value)}
        placeholder={lang === 'en' ? 'Write your post...' : '写文章内容...'}
        rows={12}
        required
      />

      <label className="admin-label">Slug (URL)</label>
      <input
        className="admin-input"
        value={form.slug}
        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
        placeholder="my-post-url"
        required
      />

      <label className="admin-label">Tags (comma separated)</label>
      <input
        className="admin-input"
        value={typeof form.tags === 'string' ? form.tags : form.tags?.join(', ')}
        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
        placeholder="react, mongodb, tutorial"
      />

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.published}
          onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
        />
        Publish immediately
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="editor-actions">
        <button type="button" className="admin-btn secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  )
}

// ─── POSTS TAB ────────────────────────────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts]     = useState([])
  const [editing, setEditing] = useState(null)  // null = list, 'new' = new, post = edit
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { setPosts(await fetchAllPosts()) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSave(payload) {
    if (editing === 'new') {
      await createPost(payload)
    } else {
      await updatePost(editing._id, payload)
    }
    setEditing(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    load()
  }

  if (editing !== null) {
    return (
      <PostEditor
        post={editing === 'new' ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Posts</h2>
        <button className="admin-btn primary" onClick={() => setEditing('new')}>+ New Post</button>
      </div>

      {loading ? (
        <p className="admin-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="admin-muted">No posts yet. Create your first one!</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <div className="post-row" key={post._id}>
              <div>
                <span className={`status-dot ${post.published ? 'published' : 'draft'}`} />
                <strong>{post.title.en}</strong>
                <span className="admin-muted" style={{ marginLeft: '8px' }}>{post.title.zh}</span>
              </div>
              <div className="post-row-actions">
                <span className="admin-muted">{post.slug}</span>
                <button className="admin-btn secondary small" onClick={() => setEditing(post)}>Edit</button>
                <button className="admin-btn danger small" onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── FRIEND LINKS TAB ────────────────────────────────────────────────────────

const EMPTY_LINK = { name: '', url: '', description: { en: '', zh: '' }, avatar: '' }

function FriendLinksTab() {
  const [links, setLinks]   = useState([])
  const [form, setForm]     = useState(EMPTY_LINK)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  async function load() {
    setLoading(true)
    try { setLinks(await fetchFriendLinks()) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    try {
      await createFriendLink(form)
      setForm(EMPTY_LINK)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this link?')) return
    await deleteFriendLink(id)
    load()
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Friend Links</h2>
      </div>

      <form className="link-form" onSubmit={handleAdd}>
        <input className="admin-input" placeholder="Name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="admin-input" placeholder="URL (https://...)" value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required />
        <input className="admin-input" placeholder="Avatar URL (optional)" value={form.avatar}
          onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
        <input className="admin-input" placeholder="Description (EN)" value={form.description.en}
          onChange={e => setForm(f => ({ ...f, description: { ...f.description, en: e.target.value } }))} />
        <input className="admin-input" placeholder="描述 (中文)" value={form.description.zh}
          onChange={e => setForm(f => ({ ...f, description: { ...f.description, zh: e.target.value } }))} />
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn primary" type="submit">Add Link</button>
      </form>

      <div className="link-list">
        {loading ? <p className="admin-muted">Loading...</p> : links.map(link => (
          <div className="link-row" key={link._id}>
            <div className="link-info">
              {link.avatar && <img src={link.avatar} alt={link.name} className="link-avatar" />}
              <div>
                <strong>{link.name}</strong>
                <a href={link.url} target="_blank" className="link-url">{link.url}</a>
              </div>
            </div>
            <button className="admin-btn danger small" onClick={() => handleDelete(link._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [tab, setTab]       = useState('posts')
  useEffect(() => {
    document.body.classList.add('admin-mode')
    return () => document.body.classList.remove('admin-mode')
  }, [])

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">kevinhz<span>.dev</span></div>
        <p className="sidebar-label">ADMIN</p>
        <nav className="sidebar-nav">
          <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
            📝 Posts
          </button>
          <button className={tab === 'links' ? 'active' : ''} onClick={() => setTab('links')}>
            🔗 Friend Links
          </button>
        </nav>
        <button className="admin-btn danger logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        {tab === 'posts' && <PostsTab />}
        {tab === 'links' && <FriendLinksTab />}
      </main>
    </div>
  )
}