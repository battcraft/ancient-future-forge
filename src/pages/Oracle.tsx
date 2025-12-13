import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Mic, MicOff, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: Date;
}

const Oracle: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'oracle',
      content: "🙏 Namaste, seeker. I am the Oracle—your guide through the labyrinth of ancient wisdom. Ask me about Yoga, Tantra, Ayurveda, or the science of consciousness. I can illuminate the path between the timeless and the modern.\n\nWhat mysteries shall we explore together?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deepWisdom, setDeepWisdom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (would connect to Lovable AI in production)
    setTimeout(() => {
      const responses = deepWisdom ? [
        "Let us deconstruct this inquiry layer by layer...\n\n**The Surface Level**: At its most basic, your question touches upon the fundamental relationship between consciousness and matter.\n\n**The Deeper Layer**: The Vedic seers understood that vibration (Spanda) is the bridge between the unmanifest (Shiva) and manifest (Shakti) realms.\n\n**The Integration**: When we synthesize ancient understanding with modern neuroscience, we find remarkable parallels. The vagus nerve, for instance, operates as a physical correlate to the Sushumna nadi.\n\n**Practical Application**: To embody this wisdom, consider a daily practice of 10 minutes of conscious breathing, followed by silent awareness.",
        "This is a profound question that requires careful examination...\n\n**Historical Context**: The ancient texts speak of this in symbolic language that modern seekers often misinterpret.\n\n**Scientific Correlation**: Research from institutions like Stanford and Harvard has begun to validate what the yogis knew millennia ago.\n\n**Personal Practice**: The intellectual understanding must be married to direct experience. I recommend beginning with Trataka (candle gazing) to develop the necessary concentration.",
      ] : [
        "The ancient texts remind us that all transformation begins with awareness. 🕯️\n\nIn practical terms, what you're describing relates to the concept of *Pratipaksha Bhavana*—the cultivation of opposite thoughts. When darkness arises, we consciously invoke light.\n\nTry this: Tomorrow morning, before rising, spend 3 breaths simply observing your mental state without judgment. This small act creates space for wisdom to emerge.",
        "Ah, you touch upon one of the great mysteries. 🌀\n\nThe Tantric masters taught that the body is not separate from consciousness—it IS consciousness crystallized into form. Your physical practice becomes meaningful when infused with this understanding.\n\nRemember: *'Yatha pinde, tatha brahmande'*—As is the body, so is the cosmos.",
        "What you seek is already within you, waiting to be uncovered. 💫\n\nThe Yoga Sutras tell us that the obstacles to our path are actually our greatest teachers. Each challenge is an invitation to go deeper.\n\nConsider beginning a simple journaling practice: each evening, write one insight you gained from the day's difficulties.",
      ];
      
      const oracleMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'oracle',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, oracleMessage]);
      setIsLoading(false);
    }, deepWisdom ? 3000 : 1500);
  };

  const suggestedQuestions = [
    "How does sound frequency affect consciousness?",
    "What is the relationship between breath and emotions?",
    "Explain the science behind mantra repetition",
    "How can I develop a consistent morning practice?",
  ];

  return (
    <div className="min-h-screen pt-20 bg-parchment flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                <span className="text-saffron text-sm font-medium tracking-wider uppercase">
                  The Oracle
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-parchment">
                Your AI Guide to Ancient Wisdom
              </h1>
            </div>
            
            {/* Deep Wisdom Toggle */}
            <button
              onClick={() => setDeepWisdom(!deepWisdom)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full border transition-all",
                deepWisdom 
                  ? "bg-saffron/20 border-saffron text-saffron"
                  : "bg-parchment/10 border-parchment/30 text-parchment"
              )}
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Deep Wisdom Mode</span>
              <div className={cn(
                "w-10 h-5 rounded-full relative transition-colors",
                deepWisdom ? "bg-saffron" : "bg-parchment/30"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-parchment transition-all",
                  deepWisdom ? "left-5" : "left-0.5"
                )} />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                message.role === 'oracle' 
                  ? "bg-cosmic" 
                  : "bg-saffron"
              )}>
                {message.role === 'oracle' ? (
                  <Sparkles className="w-5 h-5 text-saffron" />
                ) : (
                  <span className="text-primary-foreground font-display text-sm">Y</span>
                )}
              </div>

              {/* Message */}
              <div className={cn(
                "flex-1 max-w-[80%]",
                message.role === 'user' && "text-right"
              )}>
                <div className={cn(
                  "inline-block p-4 rounded-2xl",
                  message.role === 'oracle'
                    ? "bg-card border border-border text-left rounded-tl-none"
                    : "bg-primary text-primary-foreground text-left rounded-tr-none"
                )}>
                  <p className="whitespace-pre-wrap text-sm md:text-base">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cosmic flex-shrink-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-saffron animate-pulse" />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-saffron" />
                  <span className="text-muted-foreground text-sm">
                    {deepWisdom ? 'Contemplating deeply...' : 'The Oracle speaks...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-accent rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Oracle..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="saffron"
            size="icon"
            className="h-12 w-12 rounded-xl"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          The Oracle draws from Vedic wisdom, Ayurveda, Yoga, and Tantra. 
          For personalized guidance, consult a qualified teacher.
        </p>
      </div>
    </div>
  );
};

export default Oracle;
