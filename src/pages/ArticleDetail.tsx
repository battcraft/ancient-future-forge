import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Shell,
  Zap,
  Wind
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  path: string;
  read_time: string;
  image_url: string | null;
  is_featured: boolean;
  published_at: string;
}

const pathIcons = {
  sound: Shell,
  body: Zap,
  flow: Wind,
};

const pathColors = {
  sound: 'bg-purple-100 text-purple-800',
  body: 'bg-orange-100 text-orange-800',
  flow: 'bg-blue-100 text-blue-800',
};

export default function ArticleDetail() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching article:', error);
        toast.error('Article not found');
        navigate('/journal');
        return;
      }

      if (data) {
        setArticle(data);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [articleId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment paper-texture">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-parchment paper-texture">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="font-heading text-3xl text-charcoal mb-4">Article Not Found</h1>
          <Link to="/journal" className="text-saffron hover:underline">
            Return to Journal
          </Link>
        </div>
      </div>
    );
  }

  const PathIcon = pathIcons[article.path as keyof typeof pathIcons] || Shell;

  // Parse markdown-like content into sections
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        elements.push(
          <p key={elements.length} className="text-charcoal/80 leading-relaxed mb-4">
            {text}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside mb-4 space-y-2 text-charcoal/80">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        flushParagraph();
        flushList();
        // Skip main title as we show it separately
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={elements.length} className="font-heading text-2xl text-charcoal mt-8 mb-4">
            {trimmed.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={elements.length} className="font-heading text-xl text-charcoal mt-6 mb-3">
            {trimmed.slice(4)}
          </h3>
        );
        return;
      }

      // Blockquotes
      if (trimmed.startsWith('>')) {
        flushParagraph();
        flushList();
        elements.push(
          <blockquote key={elements.length} className="border-l-4 border-saffron pl-4 py-2 my-6 italic text-charcoal/70 bg-saffron/5">
            {trimmed.slice(1).trim()}
          </blockquote>
        );
        return;
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        inList = true;
        listItems.push(trimmed.slice(2));
        return;
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph();
        inList = true;
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
        return;
      }

      // Bold text handling
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        flushParagraph();
        flushList();
        elements.push(
          <p key={elements.length} className="font-semibold text-charcoal mb-2">
            {trimmed.slice(2, -2)}
          </p>
        );
        return;
      }

      // Regular paragraph
      flushList();
      currentParagraph.push(trimmed);
    });

    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <div className="min-h-screen bg-parchment paper-texture">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={article.image_url || '/placeholder.svg'}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 pb-12 w-full">
            <Link 
              to="/journal" 
              className="inline-flex items-center gap-2 text-parchment/80 hover:text-parchment mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Journal
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <Badge className={pathColors[article.path as keyof typeof pathColors]}>
                <PathIcon className="w-3 h-3 mr-1" />
                {article.path.charAt(0).toUpperCase() + article.path.slice(1)}
              </Badge>
              {article.is_featured && (
                <Badge variant="outline" className="border-saffron text-saffron">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="font-heading text-3xl md:text-5xl text-parchment mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-6 text-parchment/70 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Drop Cap First Paragraph */}
        <p className="text-xl text-charcoal/80 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-heading first-letter:text-saffron first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          {article.excerpt}
        </p>

        <div className="prose prose-lg max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Author Card */}
        <div className="mt-12 p-6 bg-white/80 rounded-xl border border-charcoal/5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center">
              <User className="w-8 h-8 text-parchment" />
            </div>
            <div>
              <p className="text-charcoal/60 text-sm">Written by</p>
              <h3 className="font-heading text-lg text-charcoal">{article.author}</h3>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
