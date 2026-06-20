import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageNav from './PageNav.jsx'
import { useMemo } from 'react'
import { getPosts, getPost, formatDate } from '../lib/posts.js'
import { useReadingProgress, useScrollReveal } from '../hooks/useBlogAnimations.js'
import { useSeo } from '../lib/seo.js'
import { absoluteUrl, AUTHOR, SITE_URL } from '../lib/site.js'

// Styling overrides for elements rendered from the MDX content.
const mdxComponents = {
  img: (props) => <img loading="lazy" decoding="async" {...props} />,
  a: (props) => {
    const external = /^https?:\/\//.test(props.href || '')
    return external ? (
      <a target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a {...props} />
    )
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const locale = (i18n.language || 'en').split('-')[0]
  const post = getPost(slug, locale)
  const posts = useMemo(() => getPosts(locale), [locale])
  const progress = useReadingProgress()
  const revealRef = useScrollReveal('[data-reveal]', [slug, locale])

  const canonical = absoluteUrl(`/blog/${slug}`)
  useSeo({
    title: post?.title,
    description: post?.excerpt,
    url: canonical,
    image: post?.cover ? absoluteUrl(post.cover) : undefined,
    type: 'article',
    locale,
    jsonLd: post && {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.cover ? absoluteUrl(post.cover) : undefined,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: locale,
      keywords: (post.tags || []).join(', '),
      author: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
      publisher: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) return <Navigate to="/blog" replace />

  const Article = post.Component
  const index = posts.findIndex((p) => p.slug === slug)
  const prev = posts[index + 1] // older
  const next = posts[index - 1] // newer

  return (
    <div className="page blog-post-page">
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
      <PageNav />

      <main className="wrap blog-article" ref={revealRef}>
        <Link className="blog-back" to="/blog">
          {t('blog.backToBlog')}
        </Link>

        <header className="blog-article__head" data-reveal>
          <div className="blog-card__tags">
            {post.tags.map((tag) => (
              <span className="blog-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="blog-article__title">{post.title}</h1>
          <div className="blog-article__meta">
            <time dateTime={post.date}>{formatDate(post.date, i18n.language)}</time>
            <span aria-hidden>·</span>
            <span>{t('blog.readingTime', { min: post.readingTime })}</span>
          </div>
        </header>

        {post.cover && (
          <div className="blog-article__cover" data-reveal>
            <img src={post.cover} alt="" decoding="async" />
          </div>
        )}

        <div className="blog-prose" data-reveal>
          <Article components={mdxComponents} />
        </div>

        {(prev || next) && (
          <nav className="blog-pager" aria-label={t('blog.morePosts')}>
            {prev ? (
              <Link className="blog-pager__link blog-pager__link--prev" to={`/blog/${prev.slug}`}>
                <span className="blog-pager__dir">← {t('blog.older')}</span>
                <span className="blog-pager__title">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="blog-pager__link blog-pager__link--next" to={`/blog/${next.slug}`}>
                <span className="blog-pager__dir">{t('blog.newer')} →</span>
                <span className="blog-pager__title">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
    </div>
  )
}
