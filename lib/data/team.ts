export interface LeaderProfile {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string[];
}

export const FOUNDER: LeaderProfile = {
  slug: 'sahun-khan',
  name: 'Sahun Khan',
  role: 'Founder & CEO',
  image: '/images/team/sahun-khan.jpg',
  bio: [
    'Sahun Khan is the Founder and CEO of Rentora Mobility. His journey in mobility began long before the company’s name existed — behind the wheel, as a professional driver serving travellers across India.',
    'Those years on the road gave him a first-hand understanding of what customers truly value: punctuality, a well-maintained vehicle, transparent pricing, and the reassurance of being looked after from pickup to drop-off.',
    'That ground-level, operational experience shaped the philosophy behind Rentora Mobility — a company built on discipline, reliability and genuine care for the traveller, not just the transaction.',
    'Since 2003, Sahun has guided the company’s direction with a simple, enduring belief: premium mobility should feel effortless, safe and human. His leadership keeps the customer at the centre of every decision.',
  ],
};

export const LEADERSHIP: LeaderProfile[] = [
  {
    slug: 'aadil-khan',
    name: 'Aadil Khan',
    role: 'COO & CFO',
    image: '/images/team/aadil-khan.png',
    bio: [
      'Aadil Khan serves as Chief Operating Officer and Chief Financial Officer, carrying broad responsibility for the company’s day-to-day operations and financial stewardship.',
      'He holds a Bachelor of Business Administration from the DPG Institute of Technology and Management, Gurugram, and has contributed to the travel and mobility sector through his work with Ganga Tourist Pvt. Ltd.',
      'With around four years of hands-on experience, Aadil focuses on operational efficiency, business coordination and strategic planning — ensuring the organisation runs smoothly and scales responsibly.',
      'His role bridges operations and finance, bringing structure and discipline to how Rentora Mobility grows while protecting the quality of service customers experience.',
    ],
  },
  {
    slug: 'arbaz-khan',
    name: 'Arbaz Khan',
    role: 'CTO & CIO',
    image: '/images/team/arbaz-khan.png',
    bio: [
      'Arbaz Khan is the Chief Technology Officer and Chief Information Officer, leading Rentora Mobility’s technology strategy and digital systems.',
      'Currently pursuing higher studies in the science field, he joined the company in 2023 and has since played a central role in shaping its digital experience.',
      'Arbaz drives digital transformation across the business — from information systems and technology strategy to the innovations that make booking, planning and travelling with Rentora smoother for customers.',
      'His contributions to the company’s technology have been recognised with an award for his role as CTO, reflecting a commitment to modern, dependable mobility platforms.',
    ],
  },
];
