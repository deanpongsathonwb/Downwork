import type { User, FreelancerProfile } from '@/types'

// ============================================================
// FREELANCER MOCK DATA
// Moved out of BrowseFreelancersPage to keep page components
// free of embedded data and improve tree-shaking in production.
// ============================================================

export const MOCK_FREELANCERS: (User & FreelancerProfile)[] = [
  {
    id: '1', userId: '1', email: 'alex@demo.com', role: 'freelancer',
    firstName: 'Alex', lastName: 'Johnson',
    avatar: undefined, isEmailVerified: true, is2FAEnabled: false,
    createdAt: '2022-03-15T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    title: 'Senior Vue.js & React Developer',
    bio: 'Full-stack developer with 7+ years experience building scalable web apps. Specialized in Vue.js, React, Node.js, and TypeScript.',
    hourlyRate: 85,
    skills: [
      { id: '1', name: 'Vue.js',     category: 'frontend' },
      { id: '2', name: 'React',      category: 'frontend' },
      { id: '3', name: 'TypeScript', category: 'frontend' },
    ],
    portfolio: [], certifications: [], workHistory: [], educationHistory: [], employmentHistory: [],
    totalEarnings: 125_000, totalJobsDone: 89, successRate: 98, jobSuccessScore: 98,
    rating: 4.9, totalReviews: 67, availability: 'available',
    location: 'New York, USA', languages: [],
    verificationStatus: 'verified', badge: 'top_rated',
  },
  {
    id: '2', userId: '2', email: 'sarah@demo.com', role: 'freelancer',
    firstName: 'Sarah', lastName: 'Chen',
    avatar: undefined, isEmailVerified: true, is2FAEnabled: false,
    createdAt: '2021-07-20T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    title: 'UI/UX Designer & Brand Strategist',
    bio: 'Creative designer passionate about crafting user-centered digital experiences. Expert in Figma, Adobe CC, and interaction design.',
    hourlyRate: 75,
    skills: [
      { id: '4', name: 'Figma',       category: 'design' },
      { id: '5', name: 'UI/UX',       category: 'design' },
      { id: '6', name: 'Branding',    category: 'design' },
      { id: '7', name: 'Prototyping', category: 'design' },
    ],
    portfolio: [], certifications: [], workHistory: [], educationHistory: [], employmentHistory: [],
    totalEarnings: 98_000, totalJobsDone: 54, successRate: 100, jobSuccessScore: 100,
    rating: 5.0, totalReviews: 43, availability: 'available',
    location: 'London, UK', languages: [],
    verificationStatus: 'verified', badge: 'top_rated_plus',
  },
  {
    id: '3', userId: '3', email: 'mark@demo.com', role: 'freelancer',
    firstName: 'Mark', lastName: 'Davis',
    avatar: undefined, isEmailVerified: true, is2FAEnabled: false,
    createdAt: '2020-11-10T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    title: 'Python Developer & Data Scientist',
    bio: 'Data scientist and ML engineer with deep expertise in Python, TensorFlow, and building production-ready ML pipelines.',
    hourlyRate: 95,
    skills: [
      { id: '8',  name: 'Python',     category: 'backend' },
      { id: '9',  name: 'TensorFlow', category: 'ml'      },
      { id: '10', name: 'SQL',        category: 'database' },
      { id: '11', name: 'PyTorch',    category: 'ml'      },
    ],
    portfolio: [], certifications: [], workHistory: [], educationHistory: [], employmentHistory: [],
    totalEarnings: 210_000, totalJobsDone: 112, successRate: 97, jobSuccessScore: 97,
    rating: 4.8, totalReviews: 91, availability: 'busy',
    location: 'Toronto, Canada', languages: [],
    verificationStatus: 'verified', badge: undefined,
  },
  {
    id: '4', userId: '4', email: 'priya@demo.com', role: 'freelancer',
    firstName: 'Priya', lastName: 'Sharma',
    avatar: undefined, isEmailVerified: true, is2FAEnabled: false,
    createdAt: '2022-09-05T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    title: 'React Native & Flutter Mobile Developer',
    bio: 'Mobile developer with 4 years building cross-platform apps. Published 12 apps on App Store and Play Store.',
    hourlyRate: 65,
    skills: [
      { id: '12', name: 'React Native', category: 'mobile'   },
      { id: '13', name: 'Flutter',      category: 'mobile'   },
      { id: '14', name: 'TypeScript',   category: 'frontend' },
    ],
    portfolio: [], certifications: [], workHistory: [], educationHistory: [], employmentHistory: [],
    totalEarnings: 45_000, totalJobsDone: 28, successRate: 95, jobSuccessScore: 95,
    rating: 4.7, totalReviews: 19, availability: 'available',
    location: 'Mumbai, India', languages: [],
    verificationStatus: 'verified', badge: 'rising_talent',
  },
]
