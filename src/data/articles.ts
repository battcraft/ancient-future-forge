import { Article } from '@/components/ArticleCard';

export const articles: Article[] = [
  {
    id: 'decoding-hanuman-chalisa',
    title: 'Decoding the Hanuman Chalisa: Biomechanics of Devotion',
    excerpt: 'A deep dive into how the rhythmic recitation of the Hanuman Chalisa affects the vagus nerve, heart rate variability, and the nervous system\'s parasympathetic response.',
    author: 'Dr. Arjun Mehta',
    date: 'Dec 10, 2024',
    readTime: '12 min read',
    path: 'sound',
    image: 'https://images.unsplash.com/photo-1609619385076-36a873425636?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    id: 'ojas-science',
    title: 'The Science of Ojas: Your Vital Life Essence',
    excerpt: 'Ayurveda speaks of Ojas as the supreme essence of all tissues. Modern research is finally catching up to what the ancients knew about this subtle energy.',
    author: 'Vaidya Priya Sharma',
    date: 'Dec 8, 2024',
    readTime: '8 min read',
    path: 'flow',
    image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&h=600&fit=crop',
  },
  {
    id: 'warrior-stance-physics',
    title: 'The Physics of Virabhadrasana: Why Warriors Don\'t Fall',
    excerpt: 'Exploring the biomechanical brilliance of Warrior Pose and how it builds structural integrity from the ground up through proper force distribution.',
    author: 'Prof. Kiran Desai',
    date: 'Dec 5, 2024',
    readTime: '10 min read',
    path: 'body',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop',
  },
  {
    id: 'breath-consciousness',
    title: 'Breath as the Bridge: Pranayama and Altered States',
    excerpt: 'How controlled breathing techniques can shift brain chemistry, induce theta wave states, and open doorways to expanded consciousness.',
    author: 'Swami Niranjananda',
    date: 'Dec 3, 2024',
    readTime: '15 min read',
    path: 'flow',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
  },
  {
    id: 'raga-therapy',
    title: 'Raga Therapy: Healing Through Indian Classical Music',
    excerpt: 'Specific ragas for specific times and conditions. Understanding the therapeutic framework of Indian classical music and its application in modern wellness.',
    author: 'Pt. Vishwa Mohan Bhatt',
    date: 'Nov 28, 2024',
    readTime: '11 min read',
    path: 'sound',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
  },
  {
    id: 'spine-serpent',
    title: 'The Spine as Serpent: Kundalini from an Anatomical Lens',
    excerpt: 'What happens physiologically when Kundalini rises? A neuroscientist\'s perspective on the ancient descriptions of serpent energy ascending the spine.',
    author: 'Dr. Rahul Joshi',
    date: 'Nov 25, 2024',
    readTime: '14 min read',
    path: 'body',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};
