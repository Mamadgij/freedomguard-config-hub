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
            // Recreate the response to add CORS headers
            const headers = new Headers(response.headers);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            // Forward the original response body, status, and modified headers
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers,
            });
        } catch (error) {
            console.error(`[PROXY ERROR] Failed to fetch ${url}:`, error);
            return c.json({ success: false, error: 'Internal proxy error' }, 500);
        }
    });
}