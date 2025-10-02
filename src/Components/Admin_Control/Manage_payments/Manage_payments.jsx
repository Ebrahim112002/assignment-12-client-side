import React, { useContext, useEffect, useState } from 'react';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import axios from 'axios';

const Manage_payments = () => {
  const { user } = useContext(Authcontext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserAndPayments = async () => {
      if (!user || !user.email) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        // Fetch user details to check if they are an admin
        const userResponse = await axios.get(`http://localhost:3000/users/${user.email}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (userResponse.data.role !== 'admin') {
          setError('You do not have permission to view this page');
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch premium requests (includes payment details)
        const paymentsResponse = await axios.get('http://localhost:3000/premium-requests', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        setPayments(paymentsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to fetch payment details');
        setLoading(false);
      }
    };

    fetchUserAndPayments();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!isAdmin) {
    return <div className="text-center mt-8 text-red-500">Access Denied: Admin privileges required</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Payments</h1>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Pay At</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Customer ID</th>
                <th className="py-2 px-4 border-b">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{payment.email}</td>
                  <td className="py-2 px-4 border-b">
                    {payment.payment?.createdAt
                      ? new Date(payment.payment.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">{payment.payment?.status || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{payment.payment?.customerId || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{payment.payment?.paymentIntentId || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Manage_payments;