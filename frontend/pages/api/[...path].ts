import { createProxyServer } from "http-proxy";
import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = process.env.INTERNAL_API_URL;
const proxy = createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (request: NextApiRequest, response: NextApiResponse) => {
  return new Promise(() => {
    request.url = request.url?.replace(/^\/api/, '');

    proxy.web(request, response, {
      target: API_URL,
      autoRewrite: false,
      ws: true,
    });
  });
}
