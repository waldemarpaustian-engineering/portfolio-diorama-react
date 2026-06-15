export default function SocialLink({ href, icon, label, className = '' }) {
  return (
    <a
      className={`social-link social-link--${icon.title.toLowerCase()} ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className="social-link__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d={icon.path} />
      </svg>
      <span>{label}</span>
    </a>
  )
}
