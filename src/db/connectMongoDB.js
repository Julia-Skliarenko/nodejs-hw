import dns from 'node:dns';
import mongoose from 'mongoose';

// Принудительно задаём DNS-серверы Google для работы SRV-записей
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectMongoDB = async () => {
  try {
    const { MONGO_URL } = process.env;
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};
