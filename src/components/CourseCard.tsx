import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/contexts/ShopContext';
import { TrinityPath } from './TrinityNav';
import { cn } from '@/lib/utils';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  students?: number;
  rating?: number;
  lessons_count?: number;
  level: 'initiate' | 'adept' | 'master';
  path: TrinityPath;
  image?: string;
  image_url?: string | null;
}

interface CourseCardProps {
  course: Course;
}

const pathColors: Record<string, string> = {
  sound: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  body: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  flow: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
};

const levelColors: Record<string, string> = {
  initiate: 'bg-emerald-500/10 text-emerald-700',
  adept: 'bg-blue-500/10 text-blue-700',
  master: 'bg-saffron/10 text-saffron',
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { addToCart, cart } = useShop();
  const isInCart = cart.some(item => item.id === course.id);
  
  // Support both image and image_url
  const imageUrl = course.image_url || course.image || '/placeholder.svg';

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-saffron/50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium border capitalize", pathColors[course.path])}>
            {course.path}
          </span>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", levelColors[course.level])}>
            {course.level}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-saffron text-primary-foreground px-3 py-1 rounded-full font-display text-sm">
          ${course.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link to={`/academy/${course.id}`}>
          <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-saffron transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <p className="text-xs text-charcoal-muted mb-4">
          with <span className="font-medium text-foreground">{course.instructor}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </div>
          {course.lessons_count && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.lessons_count} lessons
            </div>
          )}
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
              {course.rating}
            </div>
          )}
        </div>

        {/* Action */}
        <Button
          variant={isInCart ? "parchment" : "saffron"}
          className="w-full"
          onClick={() => !isInCart && addToCart({
            id: course.id,
            title: course.title,
            price: course.price,
            type: 'course',
            image: imageUrl,
          })}
          disabled={isInCart}
        >
          {isInCart ? 'In Cart' : 'Enroll Now'}
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
