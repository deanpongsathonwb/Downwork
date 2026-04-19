/**
 * Demo client accounts used only for marketplace job seeding.
 * Same shape as main seed users (client role + ClientProfile).
 */

export interface MarketplaceDemoClientDef {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  location: string;
}

export const MARKETPLACE_DEMO_CLIENTS: MarketplaceDemoClientDef[] = [
  {
    email: 'jobs.aurora@mkt-demo.downwork.local',
    username: 'mkt_aurora',
    firstName: 'Riley',
    lastName: 'Nguyen',
    companyName: 'Aurora Tech Labs',
    industry: 'Technology',
    location: 'Austin, TX',
  },
  {
    email: 'hiring@nexusdigital.mkt-demo.downwork.local',
    username: 'mkt_nexus',
    firstName: 'Jordan',
    lastName: 'Park',
    companyName: 'Nexus Digital',
    industry: 'Software',
    location: 'Seattle, WA',
  },
  {
    email: 'talent@pixelcraft.mkt-demo.downwork.local',
    username: 'mkt_pixel',
    firstName: 'Sam',
    lastName: 'Okonkwo',
    companyName: 'Pixelcraft Studio',
    industry: 'Design',
    location: 'London, UK',
  },
  {
    email: 'work@scaleup.mkt-demo.downwork.local',
    username: 'mkt_scaleup',
    firstName: 'Casey',
    lastName: 'Martinez',
    companyName: 'ScaleUp Ventures',
    industry: 'Finance',
    location: 'New York, NY',
  },
  {
    email: 'projects@brightpath.mkt-demo.downwork.local',
    username: 'mkt_brightpath',
    firstName: 'Morgan',
    lastName: 'Lee',
    companyName: 'Brightpath Analytics',
    industry: 'Data & AI',
    location: 'Toronto, ON',
  },
  {
    email: 'recruit@cloudline.mkt-demo.downwork.local',
    username: 'mkt_cloudline',
    firstName: 'Taylor',
    lastName: 'Brooks',
    companyName: 'Cloudline Systems',
    industry: 'Cloud',
    location: 'Denver, CO',
  },
  {
    email: 'ops@meridianco.mkt-demo.downwork.local',
    username: 'mkt_meridian',
    firstName: 'Jamie',
    lastName: 'Foster',
    companyName: 'Meridian Co.',
    industry: 'E-commerce',
    location: 'Chicago, IL',
  },
  {
    email: 'build@stackforge.mkt-demo.downwork.local',
    username: 'mkt_stackforge',
    firstName: 'Quinn',
    lastName: 'Reyes',
    companyName: 'Stackforge',
    industry: 'Technology',
    location: 'San Francisco, CA',
  },
  {
    email: 'hello@northwind.mkt-demo.downwork.local',
    username: 'mkt_northwind',
    firstName: 'Avery',
    lastName: 'Chen',
    companyName: 'Northwind Products',
    industry: 'Retail',
    location: 'Portland, OR',
  },
  {
    email: 'team@blueharbor.mkt-demo.downwork.local',
    username: 'mkt_blueharbor',
    firstName: 'Drew',
    lastName: 'Patel',
    companyName: 'Blue Harbor Media',
    industry: 'Marketing',
    location: 'Miami, FL',
  },
  {
    email: 'careers@ironwood.mkt-demo.downwork.local',
    username: 'mkt_ironwood',
    firstName: 'Blake',
    lastName: 'Washington',
    companyName: 'Ironwood Games',
    industry: 'Game Development',
    location: 'Los Angeles, CA',
  },
  {
    email: 'workwith@silverline.mkt-demo.downwork.local',
    username: 'mkt_silverline',
    firstName: 'Skyler',
    lastName: 'Ibrahim',
    companyName: 'Silverline Health',
    industry: 'Healthcare IT',
    location: 'Boston, MA',
  },
];
