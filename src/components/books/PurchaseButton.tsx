import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { usePaymentStore } from '../../stores/usePaymentStore';

interface PurchaseButtonProps {
  bookId: string;
  price: number;
  onSuccess?: () => void;
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({ bookId, price, onSuccess }) => {
  const { purchaseBook, isLoading } = usePaymentStore();

  const handlePurchase = async () => {
    try {
      await purchaseBook(bookId, price);
      onSuccess?.();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Buy Now (${price.toFixed(2)})
        </>
      )}
    </button>
  );
};

export default PurchaseButton;