import React, { useState } from 'react';
import TrinityNav, { TrinityPath } from '@/components/TrinityNav';
import ArticleCard from '@/components/ArticleCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const Journal: React.FC = () => {
  const [activePath, setActivePath] = useState<TrinityPath>('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = activePath === 'all' 
    ? articles 
    : articles.filter(a => a.path === activePath);

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen pt-20 bg-parchment">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block text-saffron text-sm font-medium tracking-wider uppercase mb-4">
            The Decoder
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-parchment mb-6">
            Ancient Wisdom, Decoded
          </h1>
          <p className="text-parchment/80 text-lg max-w-2xl mx-auto">
            Deep dives into the intersection of Vedic science and modern research. 
            Each article deconstructs timeless practices for the contemporary seeker.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <TrinityNav activePath={activePath} onPathChange={setActivePath} />
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-saffron" />
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">
                {filteredArticles.length} article{filteredArticles.length !== 1 && 's'} in The Decoder
              </p>

              {featuredArticle && (
                <div className="mb-12">
                  <ArticleCard article={featuredArticle} variant="featured" />
                </div>
              )}

              {otherArticles.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Journal;
