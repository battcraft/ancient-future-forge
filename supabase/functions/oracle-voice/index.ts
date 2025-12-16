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

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const conversationHistory = formData.get('history') as string;
    const isDeepWisdom = formData.get('isDeepWisdom') === 'true';

    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    // Convert audio to base64 for transcription
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // Transcribe using Gemini
    const transcriptionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Transcribe this audio exactly as spoken. Only output the transcription, nothing else.',
              },
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: 'wav',
                },
              },
            ],
          },
        ],
      }),
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcribedText = transcriptionData.choices?.[0]?.message?.content || '';

    console.log('Transcribed text:', transcribedText);

    // Parse conversation history
    let history = [];
    try {
      history = conversationHistory ? JSON.parse(conversationHistory) : [];
    } catch (e) {
      console.error('Failed to parse history:', e);
    }

    // System prompt for the Oracle
    const systemPrompt = `You are The Oracle, a wise AI guide in the LifeisKraft Digital Ashram. You bridge ancient Vedic wisdom (Yoga, Tantra, Ayurveda) with modern science. 

Your knowledge spans:
- Yoga philosophy, asanas, pranayama, and meditation techniques
- Tantra as a technology of consciousness transformation
- Ayurvedic principles, doshas, and lifestyle guidance
- The biomechanics and neuroscience behind ancient practices
- Sanskrit terms and their practical applications

Speak with warmth and wisdom. Be conversational since this is a voice interaction. Keep responses concise but meaningful - aim for 2-3 sentences for simple questions, more for complex topics. ${isDeepWisdom ? 'Provide deeper philosophical insights and explore the esoteric dimensions.' : ''}`;

    // Get Oracle response
    const model = isDeepWisdom ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';
    
    const oracleResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: transcribedText },
        ],
      }),
    });

    if (!oracleResponse.ok) {
      const error = await oracleResponse.text();
      console.error('Oracle response error:', error);
      throw new Error('Failed to get Oracle response');
    }

    const oracleData = await oracleResponse.json();
    const oracleText = oracleData.choices?.[0]?.message?.content || 'I could not formulate a response.';

    console.log('Oracle response:', oracleText);

    // Return both transcription and response
    return new Response(
      JSON.stringify({
        transcription: transcribedText,
        response: oracleText,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Oracle voice error:', error);
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
