import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * Endpoint to receive webhooks from Directus.
 * Directus uses webhooks to notify LMS about admin actions like approvals or configuration changes.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, collection, payload, keys } = body;

    console.log(`Received Directus Webhook: ${event} on ${collection}`);

    // Handle different collections and events
    switch (collection) {
      case 'loan_applications':
        if (event === 'items.update' && payload.status) {
          // If status updated in Directus (e.g. approved), update local LMS DB
          // Note: This assumes 'keys' contains the IDs of updated items
          const status = payload.status;
          for (const id of keys) {
            // Map Directus ID to LMS ID if they differ, or use as is
            await pool.query(
              'UPDATE loan_applications SET status = ?, updated_at = NOW() WHERE id = ?',
              [status, id]
            );
          }
        }
        break;

      case 'loan_products':
        // Handle product updates if needed (e.g. invalidating cache)
        console.log('Loan product updated in Directus');
        break;

      default:
        console.log(`Unhandled collection webhook: ${collection}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Directus Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
