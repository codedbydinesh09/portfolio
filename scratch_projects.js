import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const envVars = Object.fromEntries(
  env.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
);

const supabaseUrl = envVars.VITE_SUPABASE_URL?.trim();
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  console.log('Projects:', data, 'Error:', error);
}

main();
