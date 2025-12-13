import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { TrinityPath } from './TrinityNav';
import { cn } from '@/lib/utils';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  path: TrinityPath;
  image: string;
  featured?: boolean;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

const pathLabels: Record<string, string> = {
  sound: 'Nada',
  body: 'Kaya',
  flow: 'Prana',
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  if (variant === 'featured') {
    return (
      <Link 
        to={`/journal/${article.id}`}
        className="group relative block aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden"
      >
        <img 
          src={article.image} 
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-saffron/90 text-primary-foreground text-xs font-medium rounded-full uppercase tracking-wider">
              Cover Story
            </span>
            <span className="text-parchment/80 text-sm">
              {pathLabels[article.path]} Path
            </span>
          </div>
          
          <h2 className="font-display text-2xl md:text-4xl text-parchment mb-3 group-hover:text-saffron transition-colors">
            {article.title}
          </h2>
          
          <p className="text-parchment/80 text-sm md:text-base max-w-2xl mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center gap-4 text-parchment/60 text-sm">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </div>
          </div>
        </div>
        
        {/* Hover Arrow */}
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-12 h-12 rounded-full bg-saffron/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight className="w-6 h-6 text-parchment" />
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/journal/${article.id}`}
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-saffron/50 transition-all"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-saffron font-medium uppercase tracking-wider">
            {pathLabels[article.path]}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
        </div>
        
        <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-saffron transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
