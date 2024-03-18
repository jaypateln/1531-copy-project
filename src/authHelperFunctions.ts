import request from 'sync-request-curl';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// Initiates a POST request to the admin authentication registration endpoint
// The function registers a new user by sending their details to the server
export const requestAdminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: { email, password, nameFirst, nameLast }
    }
  );
  return JSON.parse(res.body.toString());
};
