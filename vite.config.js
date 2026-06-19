import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// Counts prose words and injects `readingTime` (minutes) into the YAML frontmatter,
// so it ends up on each post's `frontmatter` export. Runs after the frontmatter is
// parsed into a `yaml` node but before it is turned into a JS export.
function remarkReadingTime() {
  return (tree) => {
    let words = 0
    const walk = (node) => {
      if (node.type === 'text') {
        words += node.value.trim().split(/\s+/).filter(Boolean).length
      }
      if (node.children) node.children.forEach(walk)
    }
    walk(tree)
    const minutes = Math.max(1, Math.round(words / 200))
    const yamlNode = tree.children.find((n) => n.type === 'yaml')
    if (yamlNode) yamlNode.value += `\nreadingTime: ${minutes}`
  }
}

export default defineConfig({
  // Honour a PORT env var when set (e.g. preview tooling); falls back to Vite's default.
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
  plugins: [
    // MDX must run before the React plugin so the compiled JSX is handled by Babel.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkReadingTime, // must run after frontmatter is parsed, before it's exported
          // Exposes the YAML frontmatter as a named `frontmatter` export on each module.
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm, // GitHub-flavored markdown: tables, strikethrough, task lists
        ],
        rehypePlugins: [rehypeHighlight],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})
