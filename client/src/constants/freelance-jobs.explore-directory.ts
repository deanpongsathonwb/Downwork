import type { FreelanceJobsDirectoryItem, FreelanceJobsDirectoryLetterGroup } from './freelance-jobs.landing'
import exploreRaw from './freelance-jobs.explore-directory.json'

const LETTER_ORDER = [
  '0-9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const

type ExploreJson = Record<string, string[]>

function slugify(label: string): string {
  const s = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
  return s || 'item'
}

/** Full A–Z / 0–9 explore directory for `/freelance-jobs` (links to job search). */
export function getFreelanceJobsExploreDirectory(): FreelanceJobsDirectoryLetterGroup[] {
  const data = exploreRaw as ExploreJson
  const out: FreelanceJobsDirectoryLetterGroup[] = []
  for (const letter of LETTER_ORDER) {
    const labels = data[letter]
    if (!labels?.length) continue
    const items: FreelanceJobsDirectoryItem[] = labels.map((label, i) => ({
      label,
      slug: `explore-${letter}-${i}-${slugify(label)}`,
      to: `/browse-jobs?search=${encodeURIComponent(label)}`,
    }))
    out.push({ letter, items })
  }
  return out
}

/** Alias used across the app (same data as {@link getFreelanceJobsExploreDirectory}). */
export function getFreelanceJobsDirectoryByLetter(): FreelanceJobsDirectoryLetterGroup[] {
  return getFreelanceJobsExploreDirectory()
}
