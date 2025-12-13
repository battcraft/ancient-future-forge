import React, { useState } from 'react';
import TrinityNav, { TrinityPath } from '@/components/TrinityNav';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Level = 'all' | 'initiate' | 'adept' | 'master';

const Academy: React.FC = () => {
  const [activePath, setActivePath] = useState<TrinityPath>('all');
  const [activeLevel, setActiveLevel] = useState<Level>('all');

  const filteredCourses = courses.filter(course => {
    const pathMatch = activePath === 'all' || course.path === activePath;
    const levelMatch = activeLevel === 'all' || course.level === activeLevel;
    return pathMatch && levelMatch;
  });

  const levels: { id: Level; label: string }[] = [
    { id: 'all', label: 'All Levels' },
    { id: 'initiate', label: 'Initiate' },
    { id: 'adept', label: 'Adept' },
    { id: 'master', label: 'Master' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-parchment">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block text-saffron text-sm font-medium tracking-wider uppercase mb-4">
            The Academy
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-parchment mb-6">
            Master the Kraft
          </h1>
          <p className="text-parchment/80 text-lg max-w-2xl mx-auto">
            Comprehensive courses taught by masters. Each program is a precise protocol 
            for upgrading your consciousness through sound, body, or flow.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 border-b border-border sticky top-16 md:top-20 bg-parchment/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 space-y-6">
          <TrinityNav activePath={activePath} onPathChange={setActivePath} />
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
              {levels.map((level) => (
                <Button
                  key={level.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-display tracking-wide",
                    activeLevel === level.id && "bg-card shadow-sm"
                  )}
                  onClick={() => setActiveLevel(level.id)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCourses.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 && 's'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-xl text-foreground mb-2">No courses found</p>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Academy;
