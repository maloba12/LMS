import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testDirectus() {
  const url = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;

  if (!url || !token) {
    console.error('DIRECTUS_URL or DIRECTUS_TOKEN missing');
    return;
  }

  console.log(`Connecting to ${url}...`);

  const directus = createDirectus(url)
    .with(staticToken(token))
    .with(rest());

  try {
    console.log('Fetching items from "loan_products"...');
    const items = await directus.request(readItems('loan_products'));
    console.log('Successfully fetched loan products!');
    console.log(JSON.stringify(items, null, 2));
  } catch (error: any) {
    console.error('Static token failed:', error.message);
    
    console.log('Trying to login with ADMIN_EMAIL/ADMIN_PASSWORD...');
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    
    if (email && password) {
       try {
         // Note: login is not in rest(), it's a separate component but usually available
         // Alternatively use fetch
         const response = await fetch(`${url}/auth/login`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password })
         });
         const data = await response.json();
         if (data.data && data.data.access_token) {
           const newToken = data.data.access_token;
           console.log('Login successful! Fetching data...');
           
           const newDirectus = createDirectus(url)
             .with(staticToken(newToken))
             .with(rest());
             
           console.log('Listing collections...');
           const { readCollections } = await import('@directus/sdk');
           const collections = await newDirectus.request(readCollections());
           console.log('Available collections:', collections.map((c: any) => c.collection).join(', '));
         } else {
           console.error('Login failed:', data);
         }
       } catch (loginError: any) {
         console.error('Login error:', loginError.message);
       }
    }
  }
}

testDirectus();
