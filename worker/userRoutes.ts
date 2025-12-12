import { Hono } from "hono";
import { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Test route
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
    // Proxy route to bypass CORS for fetching subscription files
    app.get('/api/proxy', async (c) => {
        const url = c.req.query('url');
        if (!url) {
            return c.json({ success: false, error: 'URL parameter is required' }, 400);
        }
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'FreedomGuard/1.0',
                },
            });
            if (!response.ok) {
                return c.json({ success: false, error: `Failed to fetch from upstream: ${response.statusText}` }, response.status);
            }
            const body = await response.text();
            const headers = new Headers();
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Content-Type', 'text/plain; charset=utf-8');
            return new Response(body, { headers });
        } catch (error) {
            console.error(`[PROXY ERROR] Failed to fetch ${url}:`, error);
            return c.json({ success: false, error: 'Internal proxy error' }, 500);
        }
    });
}