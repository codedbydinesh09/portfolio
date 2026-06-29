import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://omisfqtadohvdixuqpwc.supabase.co', 'sb_publishable_nKsuX7OZMCreEImJoa1Z4g_iKxRoJbv');

async function test() {
  const { data, error } = await supabase.from('skills').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('No data, inserting a dummy row to see schema errors...');
      const { error: insertErr } = await supabase.from('skills').insert([{ name: 'test', category: 'test' }]);
      console.log('Insert error:', insertErr);
    }
  }
}

test();
