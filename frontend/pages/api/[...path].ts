import { createProxyServer } from "http-proxy";
import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const proxy = createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
}

const proxyPage = (request: NextApiRequest, response: NextApiResponse) => {
  return new Promise(() => {
    request.url = request.url?.replace(/^\/api/, '');

    proxy.web(request, response, {
      target: API_URL,
      autoRewrite: false,
    });
  });
};

export default proxyPage;
