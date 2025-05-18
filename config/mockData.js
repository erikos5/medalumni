// Mock data to use when database is not available

// School mock data
const schools = [
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c8f",
    name: "School of Business",
    description: "The School of Business at Mediterranean College offers high-quality programs in business administration, marketing, and finance.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521",
    departments: [
      {
        name: "Business Administration",
        description: "Department focused on business management and leadership"
      },
      {
        name: "Marketing",
        description: "Department focused on marketing strategies and consumer behavior"
      }
    ],
    date: "2020-10-20T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c8e",
    name: "School of Computing",
    description: "The School of Computing at Mediterranean College offers cutting-edge programs in computer science, software engineering, and cybersecurity.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    departments: [
      {
        name: "Computer Science",
        description: "Department focused on theoretical and practical aspects of computation"
      },
      {
        name: "Software Engineering",
        description: "Department focused on designing and building software systems"
      }
    ],
    date: "2020-10-21T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c8d",
    name: "School of Psychology",
    description: "The School of Psychology at Mediterranean College offers comprehensive programs in clinical psychology, counseling, and psychotherapy.",
    image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df",
    departments: [
      {
        name: "Clinical Psychology",
        description: "Department focused on diagnosis and treatment of mental disorders"
      },
      {
        name: "Counseling Psychology",
        description: "Department focused on helping people improve their well-being"
      }
    ],
    date: "2020-10-22T12:00:00.000Z"
  }
];

// User mock data
const users = [
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c9f",
    name: "John Doe",
    email: "johndoe@example.com",
    role: "alumni",
    date: "2020-10-23T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c9e",
    name: "Jane Smith",
    email: "janesmith@example.com",
    role: "alumni",
    date: "2020-10-24T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c9d",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    date: "2020-10-25T12:00:00.000Z"
  }
];

// Profile mock data
const profiles = [
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c7f",
    user: {
      _id: "5f8f8c8f8c8f8c8f8c8f8c9f",
      name: "John Doe",
      email: "johndoe@example.com"
    },
    school: {
      _id: "5f8f8c8f8c8f8c8f8c8f8c8f",
      name: "School of Business"
    },
    degree: "Bachelor of Business Administration",
    graduationYear: 2019,
    bio: "Business professional with expertise in marketing and finance.",
    location: "Athens, Greece",
    currentPosition: "Marketing Manager",
    company: "Global Solutions Inc.",
    website: "https://johndoe-portfolio.example.com",
    skills: ["Marketing", "Management", "Finance", "Sales", "Strategic Planning"],
    social: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      facebook: "https://facebook.com/johndoe",
      instagram: "https://instagram.com/johndoe"
    },
    status: "approved",
    date: "2020-11-01T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8c7e",
    user: {
      _id: "5f8f8c8f8c8f8c8f8c8f8c9e",
      name: "Jane Smith",
      email: "janesmith@example.com"
    },
    school: {
      _id: "5f8f8c8f8c8f8c8f8c8f8c8e",
      name: "School of Computing"
    },
    degree: "Master of Computer Science",
    graduationYear: 2020,
    bio: "Software engineer specializing in web development and artificial intelligence.",
    location: "Thessaloniki, Greece",
    currentPosition: "Senior Developer",
    company: "Tech Innovations SA",
    website: "https://janesmith-dev.example.com",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "AWS"],
    social: {
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      twitter: "https://twitter.com/janesmith"
    },
    status: "approved",
    date: "2020-11-02T12:00:00.000Z"
  }
];

// Events mock data
const events = [
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8d1f",
    title: "Career Day 2023",
    description: "Annual career day with companies from all over Greece. Bring your resume and be ready for on-site interviews!",
    date: "2023-12-15T10:00:00.000Z",
    time: "10:00",
    location: "Main Campus, Athens",
    category: "career",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    registrationEnabled: true,
    registrationDeadline: "2023-12-10T23:59:59.000Z",
    createdBy: "5f8f8c8f8c8f8c8f8c8f8c9d",
    createdAt: "2023-11-01T12:00:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8d2e",
    title: "Alumni Networking Night",
    description: "Join us for an evening of networking with fellow alumni from all departments. Refreshments will be served.",
    date: "2023-12-22T19:00:00.000Z",
    time: "19:00",
    location: "Gallery Hall, Thessaloniki Campus",
    category: "networking",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    registrationEnabled: true,
    registrationDeadline: "2023-12-15T23:59:59.000Z",
    createdBy: "5f8f8c8f8c8f8c8f8c8f8c9d",
    createdAt: "2023-11-05T14:30:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8d3d",
    title: "International Education Conference",
    description: "The 5th International Conference on Education Innovation will host speakers from universities around the world.",
    date: "2024-01-10T09:30:00.000Z",
    time: "09:30",
    location: "Conference Center, Athens",
    category: "academic",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    registrationEnabled: true,
    registrationDeadline: "2023-12-30T23:59:59.000Z",
    createdBy: "5f8f8c8f8c8f8c8f8c8f8c9d",
    createdAt: "2023-11-10T09:15:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8d4c",
    title: "Summer Party 2024",
    description: "Our annual summer celebration with food, music, and games! Open to all alumni and their families.",
    date: "2024-08-05T16:00:00.000Z",
    time: "16:00",
    location: "Beach Club, Athens Riviera",
    category: "social",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3",
    registrationEnabled: true,
    registrationDeadline: "2024-07-25T23:59:59.000Z",
    createdBy: "5f8f8c8f8c8f8c8f8c8f8c9d",
    createdAt: "2023-11-15T11:45:00.000Z"
  },
  {
    _id: "5f8f8c8f8c8f8c8f8c8f8d5b",
    title: "Workshop: Digital Marketing Trends",
    description: "Learn about the latest trends in digital marketing from industry experts in this practical workshop.",
    date: "2024-02-12T14:00:00.000Z",
    time: "14:00",
    location: "Digital Lab, Athens Campus",
    category: "workshop",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    registrationEnabled: true,
    registrationDeadline: "2024-02-05T23:59:59.000Z",
    createdBy: "5f8f8c8f8c8f8c8f8c8f8c9d",
    createdAt: "2023-11-20T10:30:00.000Z"
  }
];

module.exports = {
  schools,
  users,
  profiles,
  events
}; 