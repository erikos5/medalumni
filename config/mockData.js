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

module.exports = {
  schools,
  users,
  profiles
}; 