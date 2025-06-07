import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Purchases from '@revenuecat/purchases-web';

// Initialize RevenueCat with your API key
Purchases.configure({
  apiKey: 'sk_vVusOfNoMErkAvawBQEqCvJdSfVxB'
});

interface PaymentStore {
  isLoading: boolean;
  error: string | null;
  purchaseBook: (bookId: string, price: number) => Promise<void>;
  verifyPurchase: (bookId: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  isLoading: false,
  error: null,

  purchaseBook: async (bookId: string, price: number) => {
    try {
      set({ isLoading: true, error: null });

      // Create a package for the book
      const offering = {
        identifier: `book_${bookId}`,
        serverDescription: 'Book Purchase',
        product: {
          price: {
            amount: price,
            currency: 'USD'
          }
        }
      };

      // Make the purchase
      const { customerInfo } = await Purchases.purchasePackage(offering);

      // If purchase successful, add book to user's library
      if (customerInfo.entitlements.active[`book_${bookId}`]) {
        const { error: purchaseError } = await supabase
          .from('user_books')
          .insert({
            book_id: bookId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (purchaseError) throw purchaseError;
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  verifyPurchase: async (bookId: string) => {
    try {
      set({ isLoading: true, error: null });

      const customerInfo = await Purchases.getCustomerInfo();
      const hasAccess = customerInfo.entitlements.active[`book_${bookId}`] !== undefined;

      set({ isLoading: false });
      return hasAccess;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  }
}));