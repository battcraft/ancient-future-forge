import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Clock, 
  User, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  Shell,
  Zap,
  Wind
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructor_bio: string | null;
  price: number;
  duration: string;
  level: string;
  path: string;
  image_url: string | null;
  lessons_count: number;
  certification: string | null;
  curriculum: { title: string; lessons: string[] }[];
}

interface Enrollment {
  id: string;
  progress: number;
  enrolled_at: string;
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

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        toast.error('Course not found');
        navigate('/academy');
        return;
      }

      if (courseData) {
        setCourse({
          ...courseData,
          curriculum: (courseData.curriculum as { title: string; lessons: string[] }[]) || [],
        });
      }

      // Check enrollment if user is logged in
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (enrollmentData) {
          setEnrollment(enrollmentData);
        }
      }

      setLoading(false);
    };

    fetchCourse();
  }, [courseId, user, navigate]);

  const handleAddToCart = () => {
    if (!course) return;
    
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      type: 'course',
      image: course.image_url || undefined,
    });
    toast.success('Course added to cart');
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll');
      navigate('/auth');
      return;
    }

    if (!course) return;

    // For now, direct enrollment (in a real app, this would go through checkout)
    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: course.id,
        progress: 0,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('You are already enrolled in this course');
      } else {
        toast.error('Failed to enroll. Please try again.');
      }
      return;
    }

    toast.success('Successfully enrolled! Begin your journey.');
    setEnrollment({ id: crypto.randomUUID(), progress: 0, enrolled_at: new Date().toISOString() });
  };

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

  if (!course) {
    return (
      <div className="min-h-screen bg-parchment paper-texture">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="font-heading text-3xl text-charcoal mb-4">Course Not Found</h1>
          <Link to="/academy" className="text-saffron hover:underline">
            Return to Academy
          </Link>
        </div>
      </div>
    );
  }

  const PathIcon = pathIcons[course.path as keyof typeof pathIcons] || Shell;

  return (
    <div className="min-h-screen bg-parchment paper-texture">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={course.image_url || '/placeholder.svg'}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
            <Link 
              to="/academy" 
              className="inline-flex items-center gap-2 text-parchment/80 hover:text-parchment mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>
            
            <div className="flex items-center gap-3 mb-3">
              <Badge className={pathColors[course.path as keyof typeof pathColors]}>
                <PathIcon className="w-3 h-3 mr-1" />
                {course.path.charAt(0).toUpperCase() + course.path.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-parchment/30 text-parchment">
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl text-parchment mb-2">
              {course.title}
            </h1>
            
            <p className="text-parchment/80 max-w-2xl">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrollment Progress */}
            {enrollment && (
              <div className="bg-white/80 rounded-xl p-6 border border-charcoal/5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg text-charcoal">Your Progress</h3>
                  <span className="text-saffron font-medium">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
                <p className="text-charcoal/60 text-sm mt-2">
                  Enrolled on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-white/80 rounded-xl p-6 border border-charcoal/5 shadow-soft">
              <h2 className="font-heading text-2xl text-charcoal mb-6">Curriculum</h2>
              
              <div className="space-y-4">
                {course.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-charcoal/10 rounded-lg overflow-hidden">
                    <div className="bg-parchment/50 px-4 py-3 font-medium text-charcoal">
                      {module.title}
                    </div>
                    <div className="divide-y divide-charcoal/5">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className="px-4 py-3 flex items-center justify-between hover:bg-parchment/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {enrollment ? (
                              lessonIndex === 0 ? (
                                <Play className="w-4 h-4 text-saffron" />
                              ) : (
                                <Lock className="w-4 h-4 text-charcoal/30" />
                              )
                            ) : (
                              <CheckCircle className="w-4 h-4 text-charcoal/30" />
                            )}
                            <span className="text-charcoal/80">{lesson}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-charcoal/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white/80 rounded-xl p-6 border border-charcoal/5 shadow-soft">
              <h2 className="font-heading text-2xl text-charcoal mb-4">Your Guide</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-parchment" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-charcoal">{course.instructor}</h3>
                  <p className="text-charcoal/60 mt-2">
                    {course.instructor_bio || 'A master practitioner dedicated to sharing authentic wisdom.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 rounded-xl p-6 border border-charcoal/5 shadow-soft sticky top-24">
              <div className="text-3xl font-heading text-charcoal mb-4">
                ${course.price}
              </div>

              {enrollment ? (
                <Button variant="saffron" className="w-full mb-4" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              ) : (
                <>
                  <Button 
                    variant="saffron" 
                    className="w-full mb-3" 
                    size="lg"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </>
              )}

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-charcoal/70">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-charcoal/70">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons_count} lessons</span>
                </div>
                {course.certification && (
                  <div className="flex items-center gap-3 text-charcoal/70">
                    <Award className="w-4 h-4" />
                    <span>{course.certification}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
