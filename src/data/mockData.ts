import { Book, Category } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Quantum Paradox',
    author: {
      id: 'a1',
      name: 'Elena Martinez'
    },
    coverImage: 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg',
    description: 'When physicist Dr. Maya Chen discovers a way to communicate across parallel universes, she opens a doorway that threatens the fabric of reality itself. Now, she must race against time to close the portal before both worlds collapse.',
    categories: ['Science Fiction', 'Thriller'],
    price: 12.99,
    rating: 4.7,
    reviewCount: 218,
    publishedDate: '2025-01-15',
    hasVoice: true
  },
  {
    id: '2',
    title: 'Whispers in the Labyrinth',
    author: {
      id: 'a2',
      name: 'Jonathan Blake'
    },
    coverImage: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg',
    description: 'Detective Sarah Hayes thought she\'d seen it all until she\'s called to investigate a series of murders where the victims all share one impossible trait: they\'ve been dead for years. As she unravels the mystery, she discovers an ancient conspiracy that blurs the line between life and death.',
    categories: ['Mystery', 'Horror'],
    price: 9.99,
    rating: 4.5,
    reviewCount: 176,
    publishedDate: '2025-02-03',
    hasVoice: true
  },
  {
    id: '3',
    title: 'The Algorithm of Power',
    author: {
      id: 'a3',
      name: 'Michael Zhang'
    },
    coverImage: 'https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg',
    description: 'When tech CEO David Chen creates an AI system that can predict human behavior with perfect accuracy, he becomes the most powerful man on Earth. But as the algorithm evolves beyond his control, David must confront the moral implications of his creation before it\'s too late.',
    categories: ['Technothriller', 'Science Fiction'],
    price: 14.99,
    rating: 4.8,
    reviewCount: 302,
    publishedDate: '2025-01-28',
    hasVoice: false
  },
  {
    id: '4',
    title: 'Echoes of Eternity',
    author: {
      id: 'a4',
      name: 'Isabella Hernandez'
    },
    coverImage: 'https://images.pexels.com/photos/2272825/pexels-photo-2272825.jpeg',
    description: 'In a world where memories can be bought, sold, and stolen, memory collector Lucia Reyes specializes in preserving the most precious moments for her wealthy clients. But when she stumbles upon a memory that reveals a terrible truth about her own past, Lucia must choose between exposing a devastating secret or protecting those she loves.',
    categories: ['Fantasy', 'Romance'],
    price: 11.99,
    rating: 4.6,
    reviewCount: 245,
    publishedDate: '2025-03-12',
    hasVoice: true
  },
  {
    id: '5',
    title: 'The Last Lighthouse',
    author: {
      id: 'a5',
      name: 'Thomas Reed'
    },
    coverImage: 'https://images.pexels.com/photos/2662792/pexels-photo-2662792.jpeg',
    description: 'When the world\'s oceans rise and coastal cities disappear beneath the waves, a small community takes refuge in an abandoned lighthouse on the last remaining island. As resources dwindle and tensions rise, seventeen-year-old Maya must find a way to unite the survivors before they destroy each other—and discover the shocking truth about what caused the floods.',
    categories: ['Young Adult', 'Climate Fiction'],
    price: 10.99,
    rating: 4.4,
    reviewCount: 189,
    publishedDate: '2025-02-20',
    hasVoice: true
  },
  {
    id: '6',
    title: 'Shadows of the Mind',
    author: {
      id: 'a6',
      name: 'Olivia Chen'
    },
    coverImage: 'https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg',
    description: 'Dr. Eliza Morgan has dedicated her career to treating patients with dissociative identity disorder. But when her newest patient exhibits personalities that know details from Eliza\'s own carefully guarded past, she begins to question everything she knows about consciousness, identity, and the boundaries between minds.',
    categories: ['Psychological Thriller', 'Medical Fiction'],
    price: 13.99,
    rating: 4.9,
    reviewCount: 276,
    publishedDate: '2025-03-05',
    hasVoice: false
  },
  {
    id: '7',
    title: 'Chronicles of the Forgotten',
    author: {
      id: 'a7',
      name: 'Marcus Williams'
    },
    coverImage: 'https://images.pexels.com/photos/3693788/pexels-photo-3693788.jpeg',
    description: 'In a world where history is rewritten by the victors, Librarian Zara Hassan discovers an ancient text that contradicts everything her society believes. As she delves deeper into forbidden knowledge, Zara becomes the target of powerful forces who will stop at nothing to keep the past buried.',
    categories: ['Fantasy', 'Historical Fiction'],
    price: 12.99,
    rating: 4.7,
    reviewCount: 231,
    publishedDate: '2025-01-07',
    hasVoice: true
  },
  {
    id: '8',
    title: 'Beyond the Horizon Line',
    author: {
      id: 'a8',
      name: 'Sophia Park'
    },
    coverImage: 'https://images.pexels.com/photos/3328154/pexels-photo-3328154.jpeg',
    description: 'When NASA astronaut Captain Alex Rivera is stranded on the International Space Station after a catastrophic event on Earth, she must find a way to survive with dwindling supplies. As she struggles to make contact with anyone on the ground, Alex begins to question what really happened to her home planet—and whether she\'s truly alone in space.',
    categories: ['Science Fiction', 'Survival'],
    price: 14.99,
    rating: 4.8,
    reviewCount: 312,
    publishedDate: '2025-04-10',
    hasVoice: true
  },
  {
    id: '9',
    title: 'The Frequency of Hope',
    author: {
      id: 'a9',
      name: 'Daniel Carter'
    },
    coverImage: 'https://images.pexels.com/photos/7034053/pexels-photo-7034053.jpeg',
    description: 'In a near-future where depression has reached epidemic proportions, neuroscientist Dr. Sam Nichols develops a revolutionary brain implant that can manipulate emotions. When his own daughter becomes a candidate for the procedure, Sam must confront the ethical implications of his work and the true nature of happiness.',
    categories: ['Science Fiction', 'Literary Fiction'],
    price: 11.99,
    rating: 4.6,
    reviewCount: 198,
    publishedDate: '2025-02-28',
    hasVoice: false
  },
  {
    id: '10',
    title: 'The Cartographer\'s Daughter',
    author: {
      id: 'a10',
      name: 'Emma Thompson'
    },
    coverImage: 'https://images.pexels.com/photos/6146929/pexels-photo-6146929.jpeg',
    description: 'When Lillian discovers her father\'s collection of impossible maps—ones that show lands, creatures, and phenomena that don\'t exist in any atlas—she dismisses them as fantasy. But after her father\'s mysterious disappearance, Lillian begins to realize the maps might be more fact than fiction, and that following them is the only way to bring him home.',
    categories: ['Fantasy', 'Adventure'],
    price: 13.99,
    rating: 4.9,
    reviewCount: 287,
    publishedDate: '2025-03-20',
    hasVoice: true
  },
  {
    id: '11',
    title: 'The Ethics Engine',
    author: {
      id: 'a11',
      name: 'Robert Chen'
    },
    coverImage: 'https://images.pexels.com/photos/4394104/pexels-photo-4394104.jpeg',
    description: 'In a world where AI systems make all major decisions for humanity, Judge Imani Washington presides over the Ethics Court, where humans can appeal automated verdicts. When an algorithm sentences a renowned humanitarian to death for treason, Imani\'s investigation uncovers corruption that threatens the foundation of their utopian society.',
    categories: ['Science Fiction', 'Legal Thriller'],
    price: 12.99,
    rating: 4.7,
    reviewCount: 223,
    publishedDate: '2025-01-22',
    hasVoice: true
  },
  {
    id: '12',
    title: 'The Memory Collector',
    author: {
      id: 'a12',
      name: 'James Wilson'
    },
    coverImage: 'https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg',
    description: 'After a near-fatal accident, Noah Taylor wakes up with the ability to absorb other people\'s memories through physical contact. What begins as a disorienting curse becomes valuable when the police recruit him to help solve cold cases. But as Noah immerses himself in the memories of killers and victims alike, he risks losing his own identity in the process.',
    categories: ['Paranormal', 'Crime'],
    price: 10.99,
    rating: 4.5,
    reviewCount: 176,
    publishedDate: '2025-04-05',
    hasVoice: false
  }
];

export const mockCategories: Category[] = [
  { id: 'Science Fiction', name: 'Science Fiction', count: 32 },
  { id: 'Fantasy', name: 'Fantasy', count: 28 },
  { id: 'Mystery', name: 'Mystery', count: 24 },
  { id: 'Thriller', name: 'Thriller', count: 22 },
  { id: 'Romance', name: 'Romance', count: 20 },
  { id: 'Horror', name: 'Horror', count: 18 },
  { id: 'Biography', name: 'Biography', count: 15 },
  { id: 'History', name: 'History', count: 14 },
  { id: 'Self-Help', name: 'Self-Help', count: 12 },
  { id: 'Business', name: 'Business', count: 10 },
  { id: 'Technology', name: 'Technology', count: 9 },
  { id: 'Young Adult', name: 'Young Adult', count: 8 }
];