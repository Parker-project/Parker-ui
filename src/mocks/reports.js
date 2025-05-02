export const MOCK_REPORTS = [
  {
    id: 1,
    plate: "123-45-678",
    description: "Blocking sidewalk",
    createdAt: new Date("2025-05-01T13:15:00"),
    location: "Hashalom St, Tel Aviv",
    resolved: false,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    reporter: 'John Doe',
    reporterContact: 'john@example.com'
  },
  {
    id: 2,
    plate: "987-65-432",
    description: "Parked in disabled spot",
    createdAt: new Date("2025-05-01T14:30:00"),
    location: "Bialik St, Ramat Gan",
    resolved: true,
    imageUrl: 'https://placehold.co/400x250?text=Report+2+Image',
    reporter: 'Shimshon Coehn',
    reporterContact: 'shimshon@example.com'
  },
  {
    id: 3,
    plate: "123-45-679",
    description: "Double parking on Dizengoff St.",
    createdAt: new Date("2025-05-02T09:45:00"),
    location: "Dizengoff St, Tel Aviv",
    resolved: true,
    imageUrl: 'https://placehold.co/400x250?text=Report+3+Image',
    reporter: 'Dvora Yehezkel',
    reporterContact: 'dvora@example.com'
  },
  {
    id: 4,
    plate: "123-78-456",
    description: "Parked in loading zone",
    createdAt: new Date("2025-05-02T11:20:00"),
    location: "Allenby St, Tel Aviv",
    resolved: false,
    imageUrl: 'https://placehold.co/400x250?text=Report+4+Image',
    reporter: 'Sarah Levi',
    reporterContact: 'sarah@example.com'
  }
]; 