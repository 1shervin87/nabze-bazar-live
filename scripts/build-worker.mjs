import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('public/index.html', 'utf8');
const allowed = new Set(['BTC-USD','ETH-USD','EURUSD=X','GC=F','AAPL','TSLA']);
const source = `const html = ${JSON.stringify(html)};
const allowed = new Set(${JSON.stringify([...allowed])});
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/market') {
      const symbol = url.searchParams.get('symbol');
      if (!allowed.has(symbol)) return Response.json({ error: 'Unsupported symbol' }, { status: 400 });
      const interval = url.searchParams.get('interval') || '15m';
      const range = url.searchParams.get('range') || '5d';
      const upstream = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) + '?interval=' + encodeURIComponent(interval) + '&range=' + encodeURIComponent(range) + '&includePrePost=false&events=div%2Csplits';
      const response = await fetch(upstream, { headers: { 'user-agent': 'Mozilla/5.0 MarketDashboard/1.0', 'accept': 'application/json' } });
      if (!response.ok) return Response.json({ error: 'Market provider unavailable' }, { status: response.status });
      return new Response(await response.text(), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=20' } });
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    return new Response('Not found', { status: 404 });
  }
};\n`;

mkdirSync('dist/server', { recursive: true });
writeFileSync('dist/server/index.js', source);
