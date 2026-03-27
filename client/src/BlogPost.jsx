import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import './BlogPost.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default function BlogPost() {
  const { slug }       = useParams()
  const navigate       = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [lang, setLang]       = useState('en')
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null)

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

  const handleCopyCode = async (rawCode, index) => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API not available')
      }
      await navigator.clipboard.writeText(rawCode)
      setCopiedCodeIndex(index)
      setTimeout(() => {
        setCopiedCodeIndex(current => (current === index ? null : current))
      }, 1800)
    } catch {
      setCopiedCodeIndex(null)
      // eslint-disable-next-line no-alert
      alert(lang === 'zh' ? '复制失败，请手动复制。' : 'Copy failed. Please copy manually.')
    }
  }

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
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ inline, className, children, ...props }) {
                const rawCode = String(children ?? '').replace(/\n$/, '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                const codeIndex = `${className || 'plain'}-${rawCode.slice(0, 24)}`
                const copied = copiedCodeIndex === codeIndex

                return (
                  <div className="post-code-wrap">
                    <button
                      type="button"
                      className={`post-code-copy ${copied ? 'copied' : ''}`}
                      onClick={() => handleCopyCode(rawCode, codeIndex)}
                    >
                      {copied
                        ? (lang === 'zh' ? '已复制' : 'Copied')
                        : (lang === 'zh' ? '复制' : 'Copy')}
                    </button>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </div>
                )
              },
            }}
          >
            {post.content[lang] || post.content.en || ''}
          </Markdown>
        </div>
      </article>
    </div>
  )
}