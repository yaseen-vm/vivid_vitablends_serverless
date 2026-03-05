import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from root .env file first
const rootEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnvPath });

// Also load from backend .env if it exists (for overrides)
const backendEnvPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: backendEnvPath });
