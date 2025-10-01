import React from 'react';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-[#D81B60] text-center mb-6 font-playfair">Upgrade to Premium</h2>
        <p className="text-[#212121] text-center mb-6 font-lato">Unlock unlimited contact requests and more features!</p>
        {/* Add payment integration here, e.g., Stripe */}
        <button className="w-full bg-[#D81B60] text-white py-3 rounded-xl hover:bg-[#9f1239] transition-colors font-lato">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;