import { createProxyServer } from "http-proxy";
import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = 'http://localhost:3000'
const proxy = createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
}

export default (request: NextApiRequest, response: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    request.url = request.url?.replace(/^\/api/, '');

    proxy.web(request, response, {
      target: API_URL,
      autoRewrite: false,
      ws: true,
    });
  });
}
