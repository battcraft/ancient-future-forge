import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrinityNav, { TrinityPath } from '@/components/TrinityNav';
import CourseCard from '@/components/CourseCard';
import ArticleCard from '@/components/ArticleCard';
import { courses } from '@/data/courses';
import { articles } from '@/data/articles';

const Index: React.FC = () => {
  const [activePath, setActivePath] = useState<TrinityPath>('all');

  const filteredCourses = activePath === 'all' 
    ? courses.slice(0, 3) 
    : courses.filter(c => c.path === activePath).slice(0, 3);

  const filteredArticles = activePath === 'all'
    ? articles.slice(0, 4)
    : articles.filter(a => a.path === activePath).slice(0, 4);

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cosmic" />
        <div className="absolute inset-0 bg-sacred-geometry opacity-10" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-saffron/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-cyan-500/10 blur-2xl animate-breathe" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-parchment/10 border border-parchment/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span className="text-parchment text-sm font-medium tracking-wide">The Consciousness Engineering Platform</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-parchment mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Craft Your Life
          </h1>
          <p className="font-display text-2xl md:text-3xl text-saffron mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            with Ancient Wisdom
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-parchment/80 text-lg md:text-xl mb-12 animate-fade-in font-body" style={{ animationDelay: '0.3s' }}>
            A Digital Ashram bridging Vedic wisdom with modern science. 
            Master the technology of consciousness through Sound, Body, and Flow.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/academy">
              <Button variant="hero" size="xl">
                Begin Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/oracle">
              <Button variant="trinity" size="xl" className="text-parchment border-parchment/50 hover:bg-parchment/10 hover:border-parchment">
                <MessageCircle className="w-5 h-5" />
                Consult the Oracle
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { value: '10K+', label: 'Practitioners' },
              { value: '50+', label: 'Courses' },
              { value: '200+', label: 'Articles' },
              { value: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl text-saffron">{stat.value}</p>
                <p className="text-parchment/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-parchment/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-saffron" />
          </div>
        </div>
      </section>

      {/* Trinity Navigation */}
      <section className="py-16 bg-parchment">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Choose Your Path
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three sacred pathways converge to form the complete practice. 
              Filter content by your current focus or explore all paths.
            </p>
          </div>
          
          <TrinityNav activePath={activePath} onPathChange={setActivePath} />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gradient-to-b from-parchment to-parchment-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-saffron text-sm font-medium tracking-wider uppercase mb-2 block">
                The Academy
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                Master the Kraft
              </h2>
            </div>
            <Link to="/academy" className="hidden sm:flex items-center gap-2 text-foreground hover:text-saffron transition-colors group">
              <span className="font-display">View All Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <Link to="/academy" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-foreground hover:text-saffron transition-colors">
            <span className="font-display">View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-parchment-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-saffron text-sm font-medium tracking-wider uppercase mb-2 block">
                The Decoder
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                Ancient Wisdom, Decoded
              </h2>
            </div>
            <Link to="/journal" className="hidden sm:flex items-center gap-2 text-foreground hover:text-saffron transition-colors group">
              <span className="font-display">Read the Journal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-8">
              <ArticleCard article={featuredArticle} variant="featured" />
            </div>
          )}

          {/* Other Articles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cosmic relative overflow-hidden">
        <div className="absolute inset-0 bg-sacred-geometry opacity-10" />
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-saffron/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-parchment mb-6">
            Ready to Upgrade Your Operating System?
          </h2>
          <p className="text-parchment/80 text-lg max-w-2xl mx-auto mb-10">
            Join thousands of consciousness engineers who are using The Kraft 
            to unlock their full human potential.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/academy">
              <Button variant="hero" size="xl">
                <BookOpen className="w-5 h-5" />
                Explore Academy
              </Button>
            </Link>
            <Link to="/bazaar">
              <Button variant="trinity" size="xl" className="text-parchment border-parchment/50 hover:bg-parchment/10 hover:border-parchment">
                <ShoppingBag className="w-5 h-5" />
                Visit Bazaar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-charcoal">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center">
                <span className="text-saffron font-display text-lg">॰</span>
              </div>
              <div>
                <p className="font-display text-parchment">LifeisKraft</p>
                <p className="text-xs text-parchment/50">Digital Ashram</p>
              </div>
            </div>
            
            <p className="text-parchment/50 text-sm">
              © 2024 LifeisKraft. Craft Your Life with Ancient Wisdom.
            </p>
            
            <div className="flex gap-6">
              {['Academy', 'Journal', 'Bazaar', 'Oracle'].map((link) => (
                <Link 
                  key={link} 
                  to={`/${link.toLowerCase()}`}
                  className="text-parchment/70 hover:text-saffron text-sm transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
