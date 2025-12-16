import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import OracleModeTabs, { OracleMode } from '@/components/oracle/OracleModeTabs';
import AudioRecorder from '@/components/oracle/AudioRecorder';
import AudioVisualizer from '@/components/oracle/AudioVisualizer';
import VisionCapture from '@/components/oracle/VisionCapture';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-chat`;
const VOICE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-voice`;
const VISION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oracle-vision`;

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "🙏 Namaste, seeker. I am the Oracle—your guide through the labyrinth of ancient wisdom. Ask me about Yoga, Tantra, Ayurveda, or the science of consciousness.\n\nWhat mysteries shall we explore together?",
  timestamp: new Date(),
};

const Oracle: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deepWisdom, setDeepWisdom] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mode, setMode] = useState<OracleMode>('text');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: existing } = await supabase
        .from('oracle_conversations')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (existing) {
        setConversationId(existing.id);
        const savedMessages = existing.messages as Array<{ role: string; content: string; timestamp: string }>;
        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages.map((m, i) => ({
            id: String(i + 1),
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(m.timestamp),
          })));
        }
        setDeepWisdom(existing.is_deep_wisdom || false);
      }
    };
    loadConversation();
  }, [user]);

  const saveConversation = async (newMessages: Message[]) => {
    if (!user) return;
    const messagesForDb = newMessages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    }));
    
    if (conversationId) {
      await supabase.from('oracle_conversations').update({ messages: messagesForDb, is_deep_wisdom: deepWisdom }).eq('id', conversationId);
    } else {
      const { data } = await supabase.from('oracle_conversations').insert({ user_id: user.id, messages: messagesForDb, is_deep_wisdom: deepWisdom }).select().single();
      if (data) setConversationId(data.id);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    setIsLoading(true);
    setIsVoiceActive(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('history', JSON.stringify(messages.filter(m => m.id !== '1').map(m => ({ role: m.role, content: m.content }))));
      formData.append('isDeepWisdom', String(deepWisdom));

      const resp = await fetch(VOICE_URL, { method: 'POST', body: formData });
      const data = await resp.json();
      
      if (data.error) throw new Error(data.error);
      
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: data.transcription, timestamp: new Date() };
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date() };
      
      const updated = [...messages, userMsg, assistantMsg];
      setMessages(updated);
      await saveConversation(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Voice processing failed');
    } finally {
      setIsLoading(false);
      setIsVoiceActive(false);
    }
  };

  const handleVisionCapture = async (imageData: string, prompt: string) => {
    setIsLoading(true);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: `📷 ${prompt}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const resp = await fetch(VISION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ imageData, prompt, isDeepWisdom: deepWisdom }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.analysis, timestamp: new Date() };
      const updated = [...messages, userMsg, assistantMsg];
      setMessages(updated);
      await saveConversation(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Vision analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }]);

    try {
      const apiMessages = messages.filter(m => m.id !== '1').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      apiMessages.push({ role: 'user', content: input.trim() });

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: apiMessages, isDeepWisdom: deepWisdom }),
      });

      if (!resp.ok || !resp.body) throw new Error('Failed to connect to the Oracle');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '' || !line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => (m.id === assistantId ? { ...m, content: assistantContent } : m)));
            }
          } catch { textBuffer = line + '\n' + textBuffer; break; }
        }
      }

      const finalMessages = [...updatedMessages, { id: assistantId, role: 'assistant' as const, content: assistantContent, timestamp: new Date() }];
      await saveConversation(finalMessages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to consult the Oracle');
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = ["How does sound frequency affect consciousness?", "What is the relationship between breath and emotions?", "Explain the science behind mantra repetition", "How can I develop a consistent morning practice?"];

  return (
    <div className="min-h-screen pt-20 bg-parchment flex flex-col">
      <section className="py-8 bg-gradient-to-b from-indigo-deep to-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-saffron" />
                  <span className="text-saffron text-sm font-medium tracking-wider uppercase">The Oracle</span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl text-parchment">Your AI Guide to Ancient Wisdom</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <OracleModeTabs activeMode={mode} onModeChange={setMode} />
              <button onClick={() => setDeepWisdom(!deepWisdom)} className={cn("flex items-center gap-3 px-4 py-2 rounded-full border transition-all", deepWisdom ? "bg-saffron/20 border-saffron text-saffron" : "bg-parchment/10 border-parchment/30 text-parchment")}>
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Deep Wisdom</span>
                <div className={cn("w-10 h-5 rounded-full relative transition-colors", deepWisdom ? "bg-saffron" : "bg-parchment/30")}>
                  <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-parchment transition-all", deepWisdom ? "left-5" : "left-0.5")} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {mode === 'voice' && <div className="mb-4 flex justify-center"><AudioVisualizer isActive={isVoiceActive} /></div>}
        
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-4", message.role === 'user' && "flex-row-reverse")}>
              <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center", message.role === 'assistant' ? "bg-cosmic" : "bg-saffron")}>
                {message.role === 'assistant' ? <Sparkles className="w-5 h-5 text-saffron" /> : <span className="text-primary-foreground font-display text-sm">Y</span>}
              </div>
              <div className={cn("flex-1 max-w-[80%]", message.role === 'user' && "text-right")}>
                <div className={cn("inline-block p-4 rounded-2xl", message.role === 'assistant' ? "bg-card border border-border text-left rounded-tl-none" : "bg-primary text-primary-foreground text-left rounded-tr-none")}>
                  <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cosmic flex-shrink-0 flex items-center justify-center"><Sparkles className="w-5 h-5 text-saffron animate-pulse" /></div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-saffron" /><span className="text-muted-foreground text-sm">{deepWisdom ? 'Contemplating deeply...' : 'The Oracle speaks...'}</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">{suggestedQuestions.map((question) => (<button key={question} onClick={() => setInput(question)} className="px-3 py-1.5 text-sm bg-muted hover:bg-accent rounded-full transition-colors">{question}</button>))}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3">
          {mode === 'voice' && <AudioRecorder onAudioData={handleVoiceMessage} isDisabled={isLoading} />}
          {mode === 'vision' && <VisionCapture onCapture={handleVisionCapture} isDisabled={isLoading} />}
          <div className="flex-1 relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the Oracle..." className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all" disabled={isLoading} />
          </div>
          <Button type="submit" variant="saffron" size="icon" className="h-12 w-12 rounded-xl" disabled={!input.trim() || isLoading}><Send className="w-5 h-5" /></Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">The Oracle draws from Vedic wisdom, Ayurveda, Yoga, and Tantra. For personalized guidance, consult a qualified teacher.</p>
      </div>
    </div>
  );
};

export default Oracle;
