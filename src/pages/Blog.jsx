import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import { getPosts, getAllTags, formatDate } from '../lib/posts.js'
import { useScrollReveal } from '../hooks/useBlogAnimations.js'
import { useSeo } from '../lib/seo.js'
import { absoluteUrl, SITE_NAME } from '../lib/site.js'

function Tag({ children }) {
  return <span className="blog-tag">{children}</span>
}

function PostCard({ post, locale, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`blog-card${featured ? ' blog-card--featured' : ''}`}
      data-reveal
    >
      <div className="blog-card__thumb">
        {post.cover ? <img src={post.cover} alt="" loading="lazy" decoding="async" /> : null}
      </div>
      <div className="blog-card__body">
        <div className="blog-card__tags">
          {post.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__meta">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min</span>
        </div>
      </div>
    </Link>
  )
}

export default function Blog() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.language || 'en').split('-')[0]
  const [activeTag, setActiveTag] = useState(null)

  const posts = useMemo(() => getPosts(locale), [locale])
  const allTags = useMemo(() => getAllTags(locale), [locale])

  const filtered = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [activeTag, posts],
  )

  const [featured, ...rest] = filtered
  const revealRef = useScrollReveal('[data-reveal]', [activeTag, locale])

  const blogUrl = absoluteUrl('/blog')
  useSeo({
    title: `${t('blog.title')} — Blog`,
    description: t('blog.lead'),
    url: blogUrl,
    locale,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${SITE_NAME} — Blog`,
      description: t('blog.lead'),
      url: blogUrl,
      inLanguage: locale,
      blogPost: posts.slice(0, 20).map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: absoluteUrl(`/blog/${p.slug}`),
        datePublished: p.date,
      })),
    },
  })

  return (
    <div className="page blog-page">
      <PageNav />
      <main className="wrap blog-wrap">
        <header className="blog-head">
          <div className="eyebrow">{t('blog.eyebrow')}</div>
          <h1 className="title">{t('blog.title')}</h1>
          <p className="lead">{t('blog.lead')}</p>
        </header>

        {allTags.length > 0 && (
          <div className="blog-filter" role="tablist" aria-label={t('blog.filterLabel')}>
            <button
              type="button"
              className={`blog-chip${activeTag === null ? ' blog-chip--active' : ''}`}
              onClick={() => setActiveTag(null)}
              role="tab"
              aria-selected={activeTag === null}
            >
              {t('blog.all')}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`blog-chip${activeTag === tag ? ' blog-chip--active' : ''}`}
                onClick={() => setActiveTag(tag)}
                role="tab"
                aria-selected={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="blog-empty">{t('blog.empty')}</p>
        ) : (
          <div className="blog-feed" ref={revealRef}>
            {featured && <PostCard post={featured} locale={locale} featured />}
            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
