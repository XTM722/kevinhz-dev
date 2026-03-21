import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './BlogPost.css'

const API = 'http://localhost:5001/api'

export default function BlogPost() {
  const { slug }       = useParams()
  const navigate       = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [lang, setLang]       = useState('en')

  useEffect(() => {
    fetch(`${API}/posts/${slug}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => { setError('Post not found.'); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="post-page">
      <p className="post-loading">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="post-page">
      <p className="post-error">{error}</p>
      <button className="post-back" onClick={() => navigate('/')}>← Back</button>
    </div>
  )

  return (
    <div className="post-page">
      <div className="post-topbar">
        <button className="post-back" onClick={() => navigate('/')}>← Back</button>
        <div className="lang-switch">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>中</button>
        </div>
      </div>

      <article className="post-article">
        <header className="post-header">
          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
          )}
          <h1 className="post-title">
            {post.title[lang] || post.title.en}
          </h1>
          <p className="post-meta">
            {new Date(post.createdAt).toLocaleDateString(
              lang === 'zh' ? 'zh-CN' : 'en-CA',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </p>
        </header>

        <div className="post-body">
          {(post.content[lang] || post.content.en || '').split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>
      </article>
    </div>
  )
}