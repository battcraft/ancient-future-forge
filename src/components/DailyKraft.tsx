import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const dailyTasks = [
  { task: "Sit in complete silence for 3 minutes", category: "Flow" },
  { task: "Chant 'Om' 21 times with awareness", category: "Sound" },
  { task: "Hold a deep squat for 1 minute", category: "Body" },
  { task: "Practice 5 rounds of Nadi Shodhana", category: "Flow" },
  { task: "Speak an affirmation 7 times aloud", category: "Sound" },
  { task: "Take 10 conscious breaths before eating", category: "Flow" },
  { task: "Practice gratitude for 3 things", category: "Flow" },
  { task: "Stand in Vrikshasana for 30 seconds each side", category: "Body" },
  { task: "Listen to 5 minutes of sacred music", category: "Sound" },
  { task: "Walk barefoot on earth for 5 minutes", category: "Body" },
];

const DailyKraft: React.FC = () => {
  const { user } = useAuth();
  const [currentTask, setCurrentTask] = useState(dailyTasks[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get today's date as seed for consistent daily task
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % dailyTasks.length;
    setCurrentTask(dailyTasks[index]);
    
    // Check if already completed today
    const checkCompletion = async () => {
      if (user) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const { data } = await supabase
          .from('daily_kraft_log')
          .select('id')
          .eq('user_id', user.id)
          .gte('completed_at', todayStart.toISOString())
          .limit(1)
          .maybeSingle();
        
        if (data) {
          setIsCompleted(true);
        }
      } else {
        // Fallback to localStorage for non-logged in users
        const completedDate = localStorage.getItem('dailyKraftCompleted');
        if (completedDate === today) {
          setIsCompleted(true);
        }
      }
    };
    
    checkCompletion();
  }, [user]);

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        await supabase.from('daily_kraft_log').insert({
          user_id: user.id,
          task: currentTask.task,
        });
      } else {
        localStorage.setItem('dailyKraftCompleted', new Date().toDateString());
      }
      
      setIsCompleted(true);
      toast.success('Daily Kraft completed! 🙏');
    } catch (error) {
      console.error('Error saving completion:', error);
      toast.error('Failed to save completion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const newIndex = Math.floor(Math.random() * dailyTasks.length);
    setTimeout(() => {
      setCurrentTask(dailyTasks[newIndex]);
      setIsRefreshing(false);
    }, 500);
  };

  const categoryColors: Record<string, string> = {
    Sound: 'text-purple-600',
    Body: 'text-amber-600',
    Flow: 'text-cyan-600',
  };

  return (
    <div className={cn(
      "relative p-6 rounded-2xl border overflow-hidden transition-all duration-500",
      isCompleted 
        ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200" 
        : "bg-gradient-to-br from-saffron/5 to-indigo-deep/5 border-border"
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-sacred-geometry opacity-30" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className={cn(
              "w-5 h-5",
              isCompleted ? "text-emerald-500" : "text-saffron"
            )} />
            <h3 className="font-display text-lg text-foreground">Daily Kraft</h3>
          </div>
          
          {!isCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
          )}
        </div>

        <div className="mb-4">
          <span className={cn("text-xs font-medium uppercase tracking-wider", categoryColors[currentTask.category])}>
            {currentTask.category} Path
          </span>
          <p className="font-body text-lg text-foreground mt-1">
            {currentTask.task}
          </p>
        </div>

        <Button
          variant={isCompleted ? "parchment" : "saffron"}
          className="w-full"
          onClick={handleComplete}
          disabled={isCompleted || isLoading}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4" />
              Completed Today
            </>
          ) : isLoading ? (
            'Saving...'
          ) : (
            'Mark as Complete'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DailyKraft;
