import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { imageData, prompt, isDeepWisdom } = await req.json();

    if (!imageData) {
      throw new Error('No image data provided');
    }

    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

    // System prompt for vision analysis
    const systemPrompt = `You are The Oracle's Vision, analyzing images in the LifeisKraft Digital Ashram. You provide expert analysis from the perspective of ancient wisdom traditions combined with modern science.

Your expertise includes:
- Yoga posture and asana analysis with corrections
- Mudra identification and guidance
- Meditation space feng shui and vastu
- Body alignment and biomechanics
- Sacred geometry and symbolism

Provide specific, actionable feedback. Be encouraging but precise about improvements. ${isDeepWisdom ? 'Include deeper esoteric insights about the energetic and subtle dimensions.' : ''}`;

    const model = isDeepWisdom ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt || 'What do you see in this image? Provide guidance from a yogic perspective.' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Vision API error:', error);
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Unable to analyze the image.';

    console.log('Vision analysis complete');

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Oracle vision error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
