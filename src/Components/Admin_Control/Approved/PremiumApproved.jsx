import React, { useState, useEffect, useContext } from 'react';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PremiumApproved = () => {
  const { user, token, loading: authLoading } = useContext(Authcontext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PremiumApproved useEffect - Authcontext state:', { user, authLoading });
    if (authLoading) {
      console.log('Still loading authentication state...');
      return;
    }
    if (!user) {
      console.log('No user, redirecting to login');
      setError('You must be logged in to view this page. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!user.role) {
      console.log('No user role data, waiting...');
      return;
    }
    if (user.role !== 'admin') {
      console.log('User is not an admin, setting error');
      setError('You must be an admin to view this page.');
      setLoading(false);
      return;
    }

    const fetchPremiumRequests = async () => {
      try {
        console.log('Fetching premium requests with token:', token.substring(0, 10) + '...');
        const response = await fetch('http://localhost:3000/premium-requests?status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch premium requests');
        }

        const data = await response.json();
        console.log('Fetched premium requests:', data);
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching premium requests:', err);
        setError('Failed to load premium requests. Please try again.');
        setLoading(false);
      }
    };

    fetchPremiumRequests();
  }, [user, token, authLoading, navigate]);

  const handleApprove = async (email) => {
    try {
      console.log('Approving request for email:', email);
      const response = await fetch(`http://localhost:3000/premium-requests/email/${email}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to approve request');
      }

      setRequests(requests.filter((req) => req.email !== email));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Premium request approved successfully',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Error approving request:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve request. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleReject = async (email) => {
    try {
      console.log('Rejecting request for email:', email);
      const response = await fetch(`http://localhost:3000/premium-requests/email/${email}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to reject request');
      }

      setRequests(requests.filter((req) => req.email !== email));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Premium request rejected successfully',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Error rejecting request:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reject request. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  if (authLoading || loading) {
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

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5 font-sans">
        <div className="text-center bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">No Pending Requests</h1>
          <p className="text-lg text-gray-700 mb-8">There are no pending premium requests to review.</p>
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
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-5 text-center">Manage Premium Requests</h1>
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">User: {req.user?.name || 'Unknown'}</p>
                <p className="text-gray-600">Email: {req.email}</p>
                <p className="text-gray-600">Amount: ${(req.amount / 100).toFixed(2)}</p>
                <p className="text-gray-600">Card Last 4: {req.payment?.cardLast4 || 'N/A'}</p>
                <p className="text-gray-600">Status: {req.status}</p>
                <p className="text-gray-600">Created: {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(req.email)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.email)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PremiumApproved;