// lib/db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import Redis from "ioredis";
import * as schema from "./schema";

// Initialize Neon PostgreSQL client
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Initialize Redis client
const redisClient = new Redis(process.env.REDIS_URL!);

// Redis helper functions
export const redis = {
  // Set with expiration in seconds
  async set(key: string, value: any, expireSeconds?: number) {
    const serialized =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    if (expireSeconds) {
      await redisClient.set(key, serialized, "EX", expireSeconds);
    } else {
      await redisClient.set(key, serialized);
    }
  },

  // Get and parse if JSON
  async get(key: string) {
    const data = await redisClient.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  },

  // Delete key
  async del(key: string) {
    await redisClient.del(key);
  },

  // Check if key exists
  async exists(key: string) {
    const result = await redisClient.exists(key);
    return result === 1;
  },
};
