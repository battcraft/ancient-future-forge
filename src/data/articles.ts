import { Article } from '@/components/ArticleCard';

export const articles: Article[] = [
  {
    id: 'decoding-hanuman-chalisa',
    title: 'Decoding the Hanuman Chalisa: Biomechanics of Devotion',
    excerpt: 'A deep dive into how the rhythmic recitation of the Hanuman Chalisa affects the vagus nerve, heart rate variability, and the nervous system\'s parasympathetic response.',
    author: 'Dr. Arjun Mehta',
    published_at: '2024-12-10T00:00:00Z',
    read_time: '12 min read',
    path: 'sound',
    image_url: 'https://images.unsplash.com/photo-1609619385076-36a873425636?w=800&h=600&fit=crop',
    is_featured: true,
  },
  {
    id: 'ojas-science',
    title: 'The Science of Ojas: Your Vital Life Essence',
    excerpt: 'Ayurveda speaks of Ojas as the supreme essence of all tissues. Modern research is finally catching up to what the ancients knew about this subtle energy.',
    author: 'Vaidya Priya Sharma',
    published_at: '2024-12-08T00:00:00Z',
    read_time: '8 min read',
    path: 'flow',
    image_url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&h=600&fit=crop',
  },
  {
    id: 'warrior-stance-physics',
    title: 'The Physics of Virabhadrasana: Why Warriors Don\'t Fall',
    excerpt: 'Exploring the biomechanical brilliance of Warrior Pose and how it builds structural integrity from the ground up through proper force distribution.',
    author: 'Prof. Kiran Desai',
    published_at: '2024-12-05T00:00:00Z',
    read_time: '10 min read',
    path: 'body',
    image_url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop',
  },
  {
    id: 'breath-consciousness',
    title: 'Breath as the Bridge: Pranayama and Altered States',
    excerpt: 'How controlled breathing techniques can shift brain chemistry, induce theta wave states, and open doorways to expanded consciousness.',
    author: 'Swami Niranjananda',
    published_at: '2024-12-03T00:00:00Z',
    read_time: '15 min read',
    path: 'flow',
    image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
  },
  {
    id: 'raga-therapy',
    title: 'Raga Therapy: Healing Through Indian Classical Music',
    excerpt: 'Specific ragas for specific times and conditions. Understanding the therapeutic framework of Indian classical music and its application in modern wellness.',
    author: 'Pt. Vishwa Mohan Bhatt',
    published_at: '2024-11-28T00:00:00Z',
    read_time: '11 min read',
    path: 'sound',
    image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
  },
  {
    id: 'spine-serpent',
    title: 'The Spine as Serpent: Kundalini from an Anatomical Lens',
    excerpt: 'What happens physiologically when Kundalini rises? A neuroscientist\'s perspective on the ancient descriptions of serpent energy ascending the spine.',
    author: 'Dr. Rahul Joshi',
    published_at: '2024-11-25T00:00:00Z',
    read_time: '14 min read',
    path: 'body',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};
