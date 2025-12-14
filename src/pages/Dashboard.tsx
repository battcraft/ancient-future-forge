import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Clock, ArrowRight, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DailyKraft from '@/components/DailyKraft';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: enrollments = [], isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: dailyKraftCount = 0 } = useQuery({
    queryKey: ['daily-kraft-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('daily_kraft_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-saffron" />
      </div>
    );
  }

  if (!user) return null;

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Sadhaka';

  return (
    <div className="min-h-screen pt-20 bg-parchment">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-saffron text-sm font-medium tracking-wider uppercase mb-2">
                {getGreeting()}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-parchment">
                Welcome back, {userName}
              </h1>
            </div>
            
            {/* Streak Badge */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-parchment/10 border border-parchment/20">
              <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-parchment font-display text-xl">{dailyKraftCount} Completions</p>
                <p className="text-parchment/60 text-xs">Daily Kraft Tasks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-saffron" />
                  </div>
                  <span className="text-muted-foreground text-sm">Enrolled Courses</span>
                </div>
                <p className="font-display text-4xl text-foreground">{enrollments.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Active learning</p>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-muted-foreground text-sm">Daily Kraft</span>
                </div>
                <p className="font-display text-4xl text-foreground">{dailyKraftCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Tasks completed</p>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-foreground">Your Courses</h2>
                <Link to="/academy" className="text-saffron text-sm hover:underline">
                  Browse more
                </Link>
              </div>

              {loadingEnrollments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-saffron" />
                </div>
              ) : enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <Link
                      key={enrollment.id}
                      to={`/academy/${enrollment.course_id}`}
                      className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {enrollment.course?.image_url && (
                          <img 
                            src={enrollment.course.image_url} 
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-foreground mb-1 truncate">
                          {enrollment.course?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {enrollment.course?.instructor}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-saffron rounded-full transition-all"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {enrollment.progress || 0}%
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                  <Link to="/academy">
                    <Button variant="saffron">Explore Academy</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Kraft */}
            <DailyKraft />

            {/* Quick Links */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-lg text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/oracle">
                  <Button variant="parchment" className="w-full justify-start">
                    🧙 Consult the Oracle
                  </Button>
                </Link>
                <Link to="/journal">
                  <Button variant="parchment" className="w-full justify-start">
                    📖 Read the Decoder
                  </Button>
                </Link>
                <Link to="/bazaar">
                  <Button variant="parchment" className="w-full justify-start">
                    🛒 Visit the Bazaar
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-cosmic rounded-xl p-6 text-center">
              <p className="font-display text-parchment text-lg italic mb-3">
                "The body is your temple. Keep it pure and clean for the soul to reside in."
              </p>
              <p className="text-parchment/60 text-sm">— B.K.S. Iyengar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
