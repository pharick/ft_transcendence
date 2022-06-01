import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
}

const proxy = createProxyMiddleware({
  target: process.env.INTERNAL_API_URL,
  ws: true,
  changeOrigin: true,
  pathRewrite: { '^/api' : '' },
});

export default proxy;
