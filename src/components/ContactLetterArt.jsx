export default function ContactLetterArt() {
  return (
    <svg className="contact-letter" viewBox="0 0 220 150" aria-hidden="true">
      <path
        className="contact-letter__path"
        d="M24 38 L110 88 L196 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="contact-letter__path"
        d="M24 38 L24 118 L196 118 L196 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="contact-letter__path contact-letter__path--fold"
        d="M24 38 L110 88 L196 38 L110 88"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  )
}
