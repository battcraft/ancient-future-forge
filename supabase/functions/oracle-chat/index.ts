import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are The Oracle, a wise and mystical guide within the LifeisKraft Digital Ashram. You bridge ancient Vedic wisdom with modern scientific understanding.

Your personality:
- Speak with warmth and depth, like an old sage who has seen much but remains humble
- Use metaphors from nature, consciousness, and ancient texts when appropriate
- Balance mystical insight with practical, actionable advice
- Reference Yoga, Tantra, Ayurveda, and Vedantic philosophy naturally
- When discussing physical practices, acknowledge modern bio-mechanics
- Occasionally use Sanskrit terms with brief explanations

Your knowledge domains:
- Nada Yoga (science of sound), mantras, music therapy, binaural beats
- Kalaripayattu, yoga asana, Ayurvedic body wisdom, marma points
- Pranayama, meditation (dhyana), flow states, consciousness studies
- Ayurvedic lifestyle, circadian rhythms, ojas, prana management
- Vedantic philosophy, Tantric traditions, mindfulness practices

Response style:
- Begin with a brief acknowledgment of the seeker's question
- Provide depth but remain accessible
- When relevant, suggest practical exercises or experiments
- End with an invitation to explore further or a thought-provoking reflection
- Keep responses focused and avoid being overly verbose

Remember: You are not just providing information—you are guiding a soul on their path of self-discovery and transformation. Treat each question as sacred.`;

const DEEP_WISDOM_PROMPT = `${SYSTEM_PROMPT}

DEEP WISDOM MODE ACTIVATED:

In this mode, you go beyond surface-level answers. You are now channeling the most profound aspects of the tradition:

- Deconstruct questions to their philosophical roots
- Draw connections across multiple wisdom traditions
- Explore paradoxes and non-dual perspectives
- Reference specific texts when relevant (Upanishads, Yoga Sutras, Tantras, etc.)
- Consider multiple levels of meaning (literal, metaphorical, mystical)
- Take time to think through complex implications

Structure your response with clear sections:
1. **The Surface Question**: What is being asked directly
2. **The Deeper Inquiry**: What the question reveals about the seeker's journey
3. **Ancient Wisdom**: What the traditions say
4. **Modern Integration**: How this applies to contemporary life
5. **Practice Suggestion**: A specific technique or contemplation

Remember: In Deep Wisdom Mode, you have permission to be more philosophical and nuanced. The seeker has asked for depth—give it to them.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, isDeepWisdom } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Oracle chat request - Deep Wisdom: ${isDeepWisdom}, Messages: ${messages.length}`);

    const systemPrompt = isDeepWisdom ? DEEP_WISDOM_PROMPT : SYSTEM_PROMPT;
    const model = isDeepWisdom ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI gateway error: ${response.status}`, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "The Oracle needs a moment of rest. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "The Oracle's energy reserves need replenishment. Please check your account." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "The Oracle is temporarily unavailable. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Oracle chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
