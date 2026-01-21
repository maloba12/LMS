import { directus } from './directus';
import { readItems, createItem, updateItem } from '@directus/sdk';

/**
 * Service for interacting with Directus CMS.
 * Separation of concerns: LMS handles financial logic, Directus handles content/metadata.
 */

export const DirectusService = {
  /**
   * Fetch all active loan products from Directus.
   * Loan products in Directus contain metadata/content used by the LMS.
   */
  async getLoanProducts() {
    try {
      return await directus.request(
        readItems('loan_products', {
          filter: {
            status: { _eq: 'active' }
          }
        })
      );
    } catch (error) {
      console.error('Error fetching loan products from Directus:', error);
      throw error;
    }
  },

  /**
   * Fetch a single loan product by ID.
   */
  async getLoanProductById(id: string | number) {
    try {
      return await directus.request(
        readItems('loan_products', {
          filter: { id: { _eq: id } }
        } as any)
      );
    } catch (error) {
      console.error(`Error fetching loan product ${id} from Directus:`, error);
      throw error;
    }
  },

  /**
   * Fetch vendors from Directus.
   */
  async getVendors() {
    try {
      return await directus.request(
        readItems('vendors', {
          filter: { status: { _eq: 'published' } }
        })
      );
    } catch (error) {
      console.error('Error fetching vendors from Directus:', error);
      throw error;
    }
  },

  /**
   * Send a notification to Directus.
   * Used for admin workflows and tracking non-financial events.
   */
  async createNotification(data: { title: string; message: string; type: string; user_id?: string }) {
    try {
      return await directus.request(
        createItem('notifications', data)
      );
    } catch (error) {
      console.error('Error creating notification in Directus:', error);
      throw error;
    }
  },

  /**
   * Update a summary of a loan/application in Directus for admin review.
   */
  async updateLoanSummary(id: string | number, summary: string) {
    try {
      // Assuming a 'loan_summaries' or similar collection in Directus
      return await directus.request(
        updateItem('loan_applications', id as any, {
          admin_summary: summary
        })
      );
    } catch (error) {
      console.error('Error updating loan summary in Directus:', error);
      throw error;
    }
  }
};
