import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vuePath = path.join(__dirname, '..', 'src', 'modules', 'client', 'pages', 'GuidedJobPostPage.vue')
const s = fs.readFileSync(vuePath, 'utf8')
const m = s.match(/<template>([\s\S]*)<\/template>/)[1]
const lines = m.split('\n')
const stack = []
for (let li = 0; li < lines.length; li++) {
  const line = lines[li]
  const re = /<div\b[^>]*>|<\/div>/g
  let x
  while ((x = re.exec(line))) {
    const t = x[0]
    if (t === '</div>') {
      if (stack.length) stack.pop()
    } else if (t.endsWith('/>')) {
      // self-closing
    } else {
      stack.push(li + 2)
    }
  }
}
console.log('unclosed count:', stack.length)
console.log('last open lines:', stack.slice(-10))
