import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Clock, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DailyKraft from '@/components/DailyKraft';
import { courses } from '@/data/courses';

const Dashboard: React.FC = () => {
  // Simulated user data
  const user = {
    name: 'Sadhaka',
    enrolledCourses: [courses[0], courses[2]],
    minutesPracticed: 847,
    articlesRead: 23,
    streak: 12,
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

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
                Welcome back, {user.name}
              </h1>
            </div>
            
            {/* Streak Badge */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-parchment/10 border border-parchment/20">
              <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-parchment font-display text-xl">{user.streak} Days</p>
                <p className="text-parchment/60 text-xs">Practice Streak</p>
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
                    <Clock className="w-5 h-5 text-saffron" />
                  </div>
                  <span className="text-muted-foreground text-sm">Minutes Practiced</span>
                </div>
                <p className="font-display text-4xl text-foreground">{user.minutesPracticed}</p>
                <p className="text-sm text-muted-foreground mt-1">+47 this week</p>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-muted-foreground text-sm">Articles Read</span>
                </div>
                <p className="font-display text-4xl text-foreground">{user.articlesRead}</p>
                <p className="text-sm text-muted-foreground mt-1">+3 this week</p>
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

              {user.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {user.enrolledCourses.map((course, index) => (
                    <div 
                      key={course.id}
                      className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-foreground mb-1 truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {course.instructor}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-saffron rounded-full transition-all"
                              style={{ width: `${(index + 1) * 30}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {(index + 1) * 30}%
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
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
