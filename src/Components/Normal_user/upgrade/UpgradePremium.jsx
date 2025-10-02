import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51S0d9yFZsZ0BJriPz0kTAWdwAGoRh2mjqiddhJdMNteRL1PoCjez03xEXeZMkTglA73ZM12r7Er22lAo3O9d55uw008jFdaRKB');

const CheckoutForm = ({ name, phone, email, setError, setSuccess, setLoading, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, token } = useContext(Authcontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('CheckoutForm: Stripe or Elements not loaded');
      setError('Stripe not initialized. Please try again.');
      return;
    }

    if (!user || !token) {
      console.log('CheckoutForm: No user or token, parent handles redirect');
      setError('Authentication required. Please ensure you are logged in.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    setLoading(true);
    setError('');

    try {
      console.log('CheckoutForm: Sending request to create-payment-intent with token:', token.substring(0, 10) + '...');
      const response = await fetch('https://matrimony-server-side-sigma.vercel.app/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CheckoutForm: Payment intent creation failed:', errorText);
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }
        throw new Error(errorText || 'Failed to create payment intent.');
      }

      const { client_secret } = await response.json();
      console.log('CheckoutForm: Received client_secret');

      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            phone,
          },
        },
      });

      if (error) {
        console.error('CheckoutForm: Stripe payment error:', error);
        setError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        console.log('CheckoutForm: Payment succeeded, sending to handle-payment-success');
        const successResponse = await fetch('https://matrimony-server-side-sigma.vercel.app/handle-payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ payment_intent: paymentIntent.id }),
        });

        const successData = await successResponse.json();
        if (successData.success) {
          console.log('CheckoutForm: Payment verification successful');
          setSuccess(true);
        } else {
          console.error('CheckoutForm: Payment verification failed:', successData.error);
          setError(successData.error || 'Payment verification failed');
        }
      }
    } catch (err) {
      console.error('CheckoutForm: Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || !name || !phone}
        className="w-full py-3.5 bg-blue-500 text-white rounded-lg font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          'Pay $10 Now'
        )}
      </button>
    </form>
  );
};

const UpgradePremium = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('UpgradePremium: Authcontext state:', { user, authLoading });
    if (authLoading) {
      console.log('UpgradePremium: Still loading authentication state...');
      return;
    }
    if (!user) {
      console.log('UpgradePremium: No user, redirecting to login');
      setError('You must be logged in to upgrade. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!user.name && !user.displayName) {
      console.log('UpgradePremium: No user data, waiting...');
      return;
    }
    console.log('UpgradePremium: Setting user info:', { email: user.email, name: user.name });
    setEmail(user.email || '');
    setName(user.name || user.displayName || 'Unnamed User');
    setPhone(user.phoneNumber || '');
  }, [user, authLoading, navigate]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setPhone(value);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-2">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
          <div className="text-6xl mb-5">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-5">Upgrade Successful!</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Wait until admin approves your request.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors mt-5"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (user.isPremium) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">You are Already Premium!</h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            You have an active premium subscription. Enjoy your exclusive features!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors mt-5"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
          <p className="text-red-500 text-lg mb-5">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">Upgrade to Premium</h1>
        <p className="text-base text-gray-600 mb-8 text-center leading-relaxed">
          Enjoy exclusive features like unlimited contact requests and priority support by upgrading to a premium account for just $10.
        </p>
        <div className="space-y-5 mb-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email (Pre-filled)</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 cursor-not-allowed focus:outline-none focus:border-blue-500"
              placeholder="Your email will be pre-filled"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number (11 digits)"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-5 text-center">{error}</p>}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            name={name}
            phone={phone}
            email={email}
            setError={setError}
            setSuccess={setSuccess}
            setLoading={setLoading}
            loading={loading}
          />
        </Elements>
        <p className="text-sm text-gray-600 text-center mt-5 leading-relaxed">
          Secure card payment. Your details will be reviewed by admin for approval after payment.
        </p>
      </div>
    </div>
  );
};

export default UpgradePremium;