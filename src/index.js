import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { connectMongoDB } from './db/connectMongoDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await connectMongoDB();
  setupServer();
};

bootstrap();
