import type { PrismaClient } from '@prisma/client';

/** Top-level groups and leaf labels (Upwork-style job browse taxonomy). */
const JOB_TAXONOMY_TREE: {
  slug: string;
  label: string;
  sortOrder: number;
  children: { slug: string; label: string; sortOrder: number }[];
}[] = [
  {
    slug: 'data-science-analytics',
    label: 'Data Science & Analytics',
    sortOrder: 0,
    children: [
      { slug: 'data-analyst', label: 'Data Analyst Jobs', sortOrder: 0 },
      { slug: 'data-science', label: 'Data Science Jobs', sortOrder: 1 },
      { slug: 'microsoft-power-bi', label: 'Microsoft Power BI Jobs', sortOrder: 2 },
      { slug: 'gis', label: 'Geographic Information System (GIS) Jobs', sortOrder: 3 },
      { slug: 'data-engineer', label: 'Data Engineer Jobs', sortOrder: 4 },
      { slug: 'tableau', label: 'Tableau Software Jobs', sortOrder: 5 },
      { slug: 'r-language', label: 'R Jobs', sortOrder: 6 },
      { slug: 'data-visualization', label: 'Data Visualization Jobs', sortOrder: 7 },
      { slug: 'google-analytics', label: 'Google Analytics Jobs', sortOrder: 8 },
    ],
  },
  {
    slug: 'development',
    label: 'Development',
    sortOrder: 1,
    children: [
      { slug: 'amazon-backend-developer', label: 'Amazon Backend Developer Jobs', sortOrder: 0 },
      { slug: 'python', label: 'Python Jobs', sortOrder: 1 },
      { slug: 'java-development', label: 'Java Development Jobs', sortOrder: 2 },
      { slug: 'devops-engineer', label: 'DevOps Engineer Jobs', sortOrder: 3 },
      { slug: 'sql', label: 'SQL Jobs', sortOrder: 4 },
      { slug: 'django', label: 'Django Jobs', sortOrder: 5 },
      { slug: 'php-developer', label: 'PHP Developer Jobs', sortOrder: 6 },
      { slug: 'golang', label: 'Golang Jobs', sortOrder: 7 },
      { slug: 'ruby-on-rails', label: 'Ruby on Rails Jobs', sortOrder: 8 },
      { slug: 'web-scraping', label: 'Web Scraping Jobs', sortOrder: 9 },
      { slug: 'cpp-developer', label: 'C++ Developer Jobs', sortOrder: 10 },
      { slug: 'csharp-developer', label: 'C# Programming Jobs', sortOrder: 11 },
      { slug: 'amazon-web-services', label: 'Amazon Web Services Jobs', sortOrder: 12 },
      { slug: 'html', label: 'HTML Jobs', sortOrder: 13 },
      { slug: 'reactjs', label: 'React.js Jobs', sortOrder: 14 },
      { slug: 'javascript', label: 'JavaScript Jobs', sortOrder: 15 },
      { slug: 'remote-ux-design', label: 'Remote UX Design Jobs', sortOrder: 16 },
      { slug: 'vuejs', label: 'Vue.js Jobs', sortOrder: 17 },
      { slug: 'css', label: 'CSS Jobs', sortOrder: 18 },
      { slug: 'application-programmer', label: 'Application Programmer Jobs', sortOrder: 19 },
      { slug: 'nodejs', label: 'Node.js Jobs', sortOrder: 20 },
      { slug: 'software-development', label: 'Software Development Jobs', sortOrder: 21 },
      { slug: 'salesforce-app-developer', label: 'Salesforce App Developer Jobs', sortOrder: 22 },
      { slug: 'aspnet', label: 'ASP.NET Jobs', sortOrder: 23 },
    ],
  },
  {
    slug: 'emerging-tech',
    label: 'Emerging Tech',
    sortOrder: 2,
    children: [
      { slug: 'machine-learning', label: 'Machine Learning Jobs', sortOrder: 0 },
      { slug: 'ethical-hacking', label: 'Ethical Hacking Jobs', sortOrder: 1 },
      { slug: 'blockchain', label: 'Blockchain Jobs', sortOrder: 2 },
      { slug: 'cryptocurrency', label: 'Cryptocurrency Jobs', sortOrder: 3 },
      { slug: 'artificial-intelligence', label: 'Artificial Intelligence Jobs', sortOrder: 4 },
      { slug: 'remote-solidity', label: 'Remote Solidity Jobs', sortOrder: 5 },
    ],
  },
  {
    slug: 'ai-content-creation',
    label: 'AI Content Creation',
    sortOrder: 3,
    children: [
      { slug: 'chatgpt', label: 'ChatGPT', sortOrder: 0 },
      { slug: 'gpt-3', label: 'GPT-3', sortOrder: 1 },
      { slug: 'midjourney-ai', label: 'Midjourney AI', sortOrder: 2 },
      { slug: 'openai-codex', label: 'OpenAI Codex', sortOrder: 3 },
      { slug: 'stable-diffusion', label: 'StableDiffusion', sortOrder: 4 },
      { slug: 'google-bert', label: 'Google BERT', sortOrder: 5 },
    ],
  },
  {
    slug: 'game-development',
    label: 'Game Development',
    sortOrder: 4,
    children: [
      { slug: 'mobile-game-development', label: 'Mobile Game Development Jobs', sortOrder: 0 },
      { slug: 'game-development-general', label: 'Game Development Jobs', sortOrder: 1 },
      { slug: 'unity-programmer', label: 'Unity Programmer Jobs', sortOrder: 2 },
    ],
  },
  {
    slug: 'mobile-app-development',
    label: 'Mobile App Development',
    sortOrder: 5,
    children: [
      { slug: 'flutter', label: 'Flutter Jobs', sortOrder: 0 },
      { slug: 'android-developer', label: 'Android Developer Jobs', sortOrder: 1 },
      { slug: 'mobile-app-developer', label: 'Mobile App Developer Jobs', sortOrder: 2 },
      { slug: 'react-native', label: 'React Native Jobs', sortOrder: 3 },
      { slug: 'ios-developer', label: 'iOS Developer Jobs', sortOrder: 4 },
    ],
  },
  {
    slug: 'web-development',
    label: 'Web Development',
    sortOrder: 6,
    children: [
      { slug: 'web-developer', label: 'Web Developer Jobs', sortOrder: 0 },
      { slug: 'wordpress', label: 'WordPress Jobs', sortOrder: 1 },
      { slug: 'shopify', label: 'Shopify Jobs', sortOrder: 2 },
      { slug: 'remote-magento', label: 'Remote Magento Jobs', sortOrder: 3 },
      { slug: 'shopify-theme-designer', label: 'Shopify Theme Designer Jobs', sortOrder: 4 },
      { slug: 'ui-designer', label: 'UI Designer Jobs', sortOrder: 5 },
      { slug: 'figma', label: 'Figma Jobs', sortOrder: 6 },
      { slug: 'web-design', label: 'Web Design Jobs', sortOrder: 7 },
      { slug: 'webflow', label: 'Webflow Jobs', sortOrder: 8 },
      { slug: 'wix', label: 'WiX Jobs', sortOrder: 9 },
      { slug: 'elementor', label: 'Elementor Jobs', sortOrder: 10 },
      { slug: 'ecommerce-development', label: 'Ecommerce Development Jobs', sortOrder: 11 },
      { slug: 'frontend-developer', label: 'Frontend Developer Jobs', sortOrder: 12 },
    ],
  },
  {
    slug: 'other',
    label: 'Other',
    sortOrder: 7,
    children: [
      { slug: 'excel', label: 'Excel Jobs', sortOrder: 0 },
      { slug: 'vba', label: 'VBA Jobs', sortOrder: 1 },
      { slug: 'devops-engineering', label: 'DevOps Engineering Jobs', sortOrder: 2 },
      { slug: 'it-outsourcing', label: 'IT Outsourcing Jobs', sortOrder: 3 },
      { slug: 'bug-testing', label: 'Bug Testing Jobs', sortOrder: 4 },
      { slug: 'remote-qa', label: 'Remote QA Jobs', sortOrder: 5 },
    ],
  },
];

export async function seedJobTaxonomy(prisma: PrismaClient): Promise<void> {
  for (const group of JOB_TAXONOMY_TREE) {
    await prisma.jobTaxonomy.upsert({
      where: { slug: group.slug },
      create: {
        slug: group.slug,
        label: group.label,
        sortOrder: group.sortOrder,
        parentId: null,
      },
      update: {
        label: group.label,
        sortOrder: group.sortOrder,
        parentId: null,
      },
    });

    const parent = await prisma.jobTaxonomy.findUniqueOrThrow({
      where: { slug: group.slug },
    });

    for (const child of group.children) {
      await prisma.jobTaxonomy.upsert({
        where: { slug: child.slug },
        create: {
          slug: child.slug,
          label: child.label,
          sortOrder: child.sortOrder,
          parentId: parent.id,
        },
        update: {
          label: child.label,
          sortOrder: child.sortOrder,
          parentId: parent.id,
        },
      });
    }
  }

  console.log(`Job taxonomy: ${JOB_TAXONOMY_TREE.length} groups seeded.`);
}
