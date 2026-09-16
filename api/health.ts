import { supabaseRest } from '../services/commerce-api/src/adapters/supabase/SupabaseCommerceRepositories.js';

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.send(JSON.stringify(body));
}

export default async function handler(_req: any, res: any) {
  try {
    await supabaseRest<any[]>('products?select=id&limit=1');
    return json(res, 200, {
      status: 'ok',
      service: 'essentials-mart-api',
      dependencies: { supabase: 'ok' },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('health check failed', error);
    return json(res, 503, {
      status: 'degraded',
      service: 'essentials-mart-api',
      dependencies: { supabase: 'unavailable' },
      timestamp: new Date().toISOString(),
    });
  }
}
