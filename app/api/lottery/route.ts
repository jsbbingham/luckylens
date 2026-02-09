// app/api/lottery/route.ts
// Edge function to proxy Magayo API requests (avoids CORS issues)

export const runtime = 'edge';

const MAGAYO_API_KEY = process.env.MAGAYO_API_KEY || 'rtAf5eNS3BGdVXh8fr';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  
  if (!game) {
    return new Response(
      JSON.stringify({ error: 'Missing game parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const response = await fetch(
      `https://www.magayo.com/api/results.php?api_key=${MAGAYO_API_KEY}&game=${game}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Magayo API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch lottery results',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
