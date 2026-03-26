import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.platformSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      commissionRate: 20,
      minWithdrawal: 50,
      maxWithdrawal: 10000,
      maintenanceMode: false,
      registrationEnabled: true,
      kycRequired: false,
      autoApproveJobs: true,
    },
  });

  await prisma.connectsPackage.createMany({
    data: [
      { id: 'pkg-10', name: '10 Connects', connects: 10, price: 1.5, popular: false },
      { id: 'pkg-40', name: '40 Connects', connects: 40, price: 5.0, popular: true },
      { id: 'pkg-80', name: '80 Connects', connects: 80, price: 9.0, popular: false },
      { id: 'pkg-150', name: '150 Connects', connects: 150, price: 15.0, popular: false },
    ],
  });

  const password = await bcrypt.hash('password123', 12);

  // ─── Users ──────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@downwork.com' },
    update: {},
    create: {
      email: 'admin@downwork.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      status: 'active',
    },
  });

  const client1 = await prisma.user.upsert({
    where: { email: 'sarah@techcorp.com' },
    update: {},
    create: {
      email: 'sarah@techcorp.com',
      password,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'client',
      isEmailVerified: true,
      location: 'San Francisco, CA',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
    },
  });
  await prisma.clientProfile.upsert({
    where: { userId: client1.id },
    update: {},
    create: {
      userId: client1.id,
      companyName: 'TechCorp Inc.',
      companySize: '50-200',
      industry: 'Technology',
      website: 'https://techcorp.example.com',
      description: 'Leading technology solutions company',
      totalSpent: 45000,
      totalJobsPosted: 12,
      hireRate: 85,
      rating: 4.8,
      reviewCount: 8,
      paymentVerified: true,
    },
  });

  const client2 = await prisma.user.upsert({
    where: { email: 'mike@designstudio.com' },
    update: {},
    create: {
      email: 'mike@designstudio.com',
      password,
      firstName: 'Mike',
      lastName: 'Chen',
      role: 'client',
      isEmailVerified: true,
      location: 'New York, NY',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=8b5cf6&color=fff',
    },
  });
  await prisma.clientProfile.upsert({
    where: { userId: client2.id },
    update: {},
    create: {
      userId: client2.id,
      companyName: 'Design Studio Co.',
      companySize: '10-50',
      industry: 'Design',
      totalSpent: 22000,
      totalJobsPosted: 8,
      hireRate: 75,
      rating: 4.6,
      reviewCount: 5,
      paymentVerified: true,
    },
  });

  const freelancer1 = await prisma.user.upsert({
    where: { email: 'alex@freelance.com' },
    update: {},
    create: {
      email: 'alex@freelance.com',
      password,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: 'freelancer',
      isEmailVerified: true,
      location: 'Austin, TX',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=10b981&color=fff',
    },
  });
  await prisma.freelancerProfile.upsert({
    where: { userId: freelancer1.id },
    update: {},
    create: {
      userId: freelancer1.id,
      title: 'Senior Full-Stack Developer',
      bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture.',
      hourlyRate: 85,
      availability: 'available',
      skills: (['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL']),
      categories: (['web-development', 'mobile-development']),
      experience: ([
        { company: 'Google', role: 'Senior Software Engineer', from: '2020', to: '2024', description: 'Led frontend team for Google Maps' },
        { company: 'Startup XYZ', role: 'Full-Stack Developer', from: '2018', to: '2020', description: 'Built the entire platform from scratch' },
      ]),
      languages: ([{ language: 'English', proficiency: 'native' }, { language: 'Spanish', proficiency: 'fluent' }]),
      totalEarnings: 125000,
      completedJobs: 47,
      successRate: 98,
      rating: 4.9,
      reviewCount: 42,
      connectsBalance: 120,
      profileCompleteness: 95,
    },
  });

  const freelancer2 = await prisma.user.upsert({
    where: { email: 'emma@design.com' },
    update: {},
    create: {
      email: 'emma@design.com',
      password,
      firstName: 'Emma',
      lastName: 'Watson',
      role: 'freelancer',
      isEmailVerified: true,
      location: 'London, UK',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=f59e0b&color=fff',
    },
  });
  await prisma.freelancerProfile.upsert({
    where: { userId: freelancer2.id },
    update: {},
    create: {
      userId: freelancer2.id,
      title: 'UI/UX Designer & Brand Strategist',
      bio: 'Creative designer specializing in user experience and brand identity. 6+ years helping startups and enterprises craft beautiful digital products.',
      hourlyRate: 75,
      availability: 'available',
      skills: (['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Brand Design']),
      categories: (['design-creative', 'web-development']),
      languages: ([{ language: 'English', proficiency: 'native' }]),
      totalEarnings: 89000,
      completedJobs: 35,
      successRate: 97,
      rating: 4.8,
      reviewCount: 30,
      connectsBalance: 80,
      profileCompleteness: 90,
    },
  });

  const freelancer3 = await prisma.user.upsert({
    where: { email: 'james@dev.com' },
    update: {},
    create: {
      email: 'james@dev.com',
      password,
      firstName: 'James',
      lastName: 'Park',
      role: 'freelancer',
      isEmailVerified: true,
      location: 'Seoul, South Korea',
      avatar: 'https://ui-avatars.com/api/?name=James+Park&background=ef4444&color=fff',
    },
  });
  await prisma.freelancerProfile.upsert({
    where: { userId: freelancer3.id },
    update: {},
    create: {
      userId: freelancer3.id,
      title: 'Mobile App Developer (React Native & Flutter)',
      bio: 'Cross-platform mobile developer building high-performance apps. Published 15+ apps on App Store and Play Store.',
      hourlyRate: 70,
      availability: 'busy',
      skills: (['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'TypeScript']),
      categories: (['mobile-development']),
      languages: ([{ language: 'English', proficiency: 'fluent' }, { language: 'Korean', proficiency: 'native' }]),
      totalEarnings: 67000,
      completedJobs: 28,
      successRate: 96,
      rating: 4.7,
      reviewCount: 24,
      connectsBalance: 45,
      profileCompleteness: 85,
    },
  });

  // ─── Jobs ───────────────────────────────────────────────────
  const job1 = await prisma.job.upsert({
    where: { id: 'job-1' },
    update: {},
    create: {
      id: 'job-1',
      clientId: client1.id,
      title: 'Build a SaaS Dashboard with React & TypeScript',
      description: 'We need an experienced React developer to build a comprehensive analytics dashboard for our SaaS platform. The dashboard should include real-time data visualization, user management, and reporting features. Must be responsive and follow our design system.',
      category: 'web-development',
      skills: (['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'REST API']),
      budgetType: 'fixed',
      budgetFixed: 5000,
      duration: '1-3 months',
      experienceLevel: 'expert',
      scope: 'large',
      status: 'open',
      proposalCount: 8,
      viewCount: 145,
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 'job-2' },
    update: {},
    create: {
      id: 'job-2',
      clientId: client1.id,
      title: 'Mobile App Development - React Native',
      description: 'Looking for a skilled React Native developer to build a cross-platform mobile app for our food delivery service. The app needs to support real-time tracking, push notifications, and payment integration.',
      category: 'mobile-development',
      skills: (['React Native', 'TypeScript', 'Firebase', 'Stripe', 'Maps API']),
      budgetType: 'hourly',
      budgetMin: 50,
      budgetMax: 80,
      duration: '3-6 months',
      experienceLevel: 'intermediate',
      status: 'open',
      proposalCount: 5,
      viewCount: 89,
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 'job-3' },
    update: {},
    create: {
      id: 'job-3',
      clientId: client2.id,
      title: 'Brand Identity & UI Design for Fintech Startup',
      description: 'We are a fintech startup looking for a talented designer to create our complete brand identity including logo, color palette, typography, and UI design for our web and mobile applications.',
      category: 'design-creative',
      skills: (['Figma', 'Brand Design', 'UI Design', 'Logo Design', 'Design Systems']),
      budgetType: 'fixed',
      budgetFixed: 3000,
      duration: '1-3 months',
      experienceLevel: 'expert',
      status: 'open',
      proposalCount: 12,
      viewCount: 203,
    },
  });

  const job4 = await prisma.job.upsert({
    where: { id: 'job-4' },
    update: {},
    create: {
      id: 'job-4',
      clientId: client2.id,
      title: 'WordPress E-commerce Website',
      description: 'Need a WordPress developer to set up an e-commerce website with WooCommerce. Should include product catalog, shopping cart, checkout, and payment gateway integration.',
      category: 'web-development',
      skills: (['WordPress', 'WooCommerce', 'PHP', 'CSS', 'Payment Integration']),
      budgetType: 'fixed',
      budgetFixed: 1500,
      duration: 'less than 1 month',
      experienceLevel: 'intermediate',
      status: 'open',
      proposalCount: 15,
      viewCount: 178,
    },
  });

  const job5 = await prisma.job.upsert({
    where: { id: 'job-5' },
    update: {},
    create: {
      id: 'job-5',
      clientId: client1.id,
      title: 'API Integration & Backend Development (Node.js)',
      description: 'We need a backend developer to integrate multiple third-party APIs and build RESTful endpoints for our platform. Experience with payment gateways (Stripe), messaging (Twilio), and cloud services required.',
      category: 'web-development',
      subcategory: 'backend',
      skills: (['Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'REST API', 'Docker']),
      budgetType: 'hourly',
      budgetMin: 60,
      budgetMax: 100,
      duration: '1-3 months',
      experienceLevel: 'expert',
      status: 'open',
      proposalCount: 3,
      viewCount: 67,
    },
  });

  // ─── Proposals ──────────────────────────────────────────────
  await prisma.proposal.upsert({
    where: { id: 'prop-1' },
    update: {},
    create: {
      id: 'prop-1',
      jobId: job1.id,
      freelancerId: freelancer1.id,
      coverLetter: 'I have extensive experience building SaaS dashboards with React and TypeScript. I recently completed a similar project for a Fortune 500 company. I can deliver this within 6 weeks with full test coverage.',
      bidAmount: 4500,
      bidType: 'fixed',
      estimatedDuration: '6 weeks',
      status: 'pending',
      milestones: ([
        { title: 'UI Foundation & Layout', amount: 1000 },
        { title: 'Data Visualization & Charts', amount: 1500 },
        { title: 'User Management & Reporting', amount: 1500 },
        { title: 'Testing & Polish', amount: 500 },
      ]),
    },
  });

  await prisma.proposal.upsert({
    where: { id: 'prop-2' },
    update: {},
    create: {
      id: 'prop-2',
      jobId: job3.id,
      freelancerId: freelancer2.id,
      coverLetter: 'As a UI/UX designer with fintech experience, I understand the unique challenges of designing for financial products. I would love to create a cohesive brand identity that communicates trust and innovation.',
      bidAmount: 2800,
      bidType: 'fixed',
      estimatedDuration: '4 weeks',
      status: 'shortlisted',
    },
  });

  await prisma.proposal.upsert({
    where: { id: 'prop-3' },
    update: {},
    create: {
      id: 'prop-3',
      jobId: job2.id,
      freelancerId: freelancer3.id,
      coverLetter: 'I specialize in React Native development and have built several food delivery apps. I can integrate real-time tracking, push notifications, and Stripe payments seamlessly.',
      bidAmount: 65,
      bidType: 'hourly',
      estimatedDuration: '4 months',
      status: 'accepted',
    },
  });

  // ─── Contracts ──────────────────────────────────────────────
  const contract1 = await prisma.contract.upsert({
    where: { id: 'contract-1' },
    update: {},
    create: {
      id: 'contract-1',
      jobId: job2.id,
      clientId: client1.id,
      freelancerId: freelancer3.id,
      title: 'Mobile App Development - Food Delivery',
      description: 'Cross-platform mobile app development',
      totalAmount: 12000,
      paidAmount: 4000,
      paymentType: 'fixed',
      status: 'active',
    },
  });

  await prisma.milestone.createMany({
    data: [
      { id: 'ms-1', contractId: contract1.id, title: 'UI/UX & Wireframes', amount: 2000, status: 'released', order: 0 },
      { id: 'ms-2', contractId: contract1.id, title: 'Core Features Development', amount: 4000, status: 'released', order: 1 },
      { id: 'ms-3', contractId: contract1.id, title: 'Payment & Tracking Integration', amount: 4000, status: 'in_progress', order: 2 },
      { id: 'ms-4', contractId: contract1.id, title: 'Testing & App Store Submission', amount: 2000, status: 'pending', order: 3 },
    ],
  });

  // ─── Reviews ────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        id: 'review-1',
        contractId: contract1.id,
        authorId: client1.id,
        targetId: freelancer3.id,
        rating: 5,
        comment: 'Excellent developer! Delivered the first two milestones ahead of schedule with exceptional quality.',
        skills: ({ communication: 5, quality: 5, expertise: 5, professionalism: 5, hireAgain: 5 }),
      },
    ],
  });

  // ─── Conversations ─────────────────────────────────────────
  const [u1, u2] = [client1.id, freelancer1.id].sort();
  const conv1 = await prisma.conversation.upsert({
    where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    update: {},
    create: {
      user1Id: u1,
      user2Id: u2,
      lastMessage: 'Looking forward to working together!',
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv1.id, senderId: client1.id, content: 'Hi Alex, I saw your profile and would love to discuss a project.', type: 'text' },
      { conversationId: conv1.id, senderId: freelancer1.id, content: 'Hi Sarah! I would be happy to discuss. What kind of project do you have in mind?', type: 'text' },
      { conversationId: conv1.id, senderId: client1.id, content: 'We need a React dashboard for our SaaS platform. Interested?', type: 'text' },
      { conversationId: conv1.id, senderId: freelancer1.id, content: 'Looking forward to working together!', type: 'text' },
    ],
  });

  // ─── Notifications ─────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: freelancer1.id, type: 'proposal_received', title: 'New Job Match', message: 'A new job matching your skills has been posted: "Build a SaaS Dashboard"', link: '/jobs/job-1' },
      { userId: client1.id, type: 'proposal_received', title: 'New Proposal', message: 'Alex Rivera submitted a proposal for "Build a SaaS Dashboard"', link: '/client/jobs/job-1' },
      { userId: freelancer3.id, type: 'contract_started', title: 'Contract Started', message: 'Your contract "Mobile App Development" has started', link: '/freelancer/contracts/contract-1' },
    ],
  });

  // ─── Transactions ──────────────────────────────────────────
  await prisma.transaction.createMany({
    data: [
      { userId: freelancer3.id, contractId: contract1.id, type: 'payment', amount: 2000, fee: 400, net: 1600, status: 'completed', description: 'Milestone: UI/UX & Wireframes' },
      { userId: freelancer3.id, contractId: contract1.id, type: 'payment', amount: 4000, fee: 800, net: 3200, status: 'completed', description: 'Milestone: Core Features Development' },
      { userId: freelancer1.id, type: 'deposit', amount: 500, fee: 0, net: 500, status: 'completed', description: 'Deposit via PayPal' },
    ],
  });

  // ─── Payment Methods ───────────────────────────────────────
  await prisma.paymentMethod.createMany({
    data: [
      { userId: client1.id, type: 'card', label: 'Visa ending in 4242', last4: '4242', brand: 'Visa', isDefault: true },
      { userId: freelancer1.id, type: 'bank_account', label: 'Chase Checking ****1234', last4: '1234', isDefault: true },
      { userId: freelancer3.id, type: 'paypal', label: 'james@dev.com', isDefault: true },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin:      admin@downwork.com / password123');
  console.log('  Client 1:   sarah@techcorp.com / password123');
  console.log('  Client 2:   mike@designstudio.com / password123');
  console.log('  Freelancer: alex@freelance.com / password123');
  console.log('  Freelancer: emma@design.com / password123');
  console.log('  Freelancer: james@dev.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
