import React, { useState, useEffect, useContext } from 'react';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import axios from 'axios';

const ManagePayments = () => {
  const { user } = useContext(Authcontext);
  const [payments, setPayments] = useState([]);
  const [premiumRequests, setPremiumRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      setError('Please log in to access this page');
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${user.email}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        if (response.data.role !== 'admin') {
          setError('Admin access required');
          setLoading(false);
          return;
        }
        fetchData();
      } catch (err) {
        setError('Failed to verify admin status: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    // Fetch payments and premium requests
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all payments
        const paymentsResponse = await axios.get('http://localhost:3000/payments', {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });

        // Fetch premium requests
        const requestsResponse = await axios.get('http://localhost:3000/premium-requests', {
          headers: { Authorization: `Bearer ${user.accessToken}` },
          params: { status: filterStatus },
        });

        setPayments(paymentsResponse.data);
        setPremiumRequests(requestsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, filterStatus]);

  // Handle approving a premium request
  const handleApprove = async (email) => {
    try {
      await axios.patch(
        `http://localhost:3000/premium-requests/email/${email}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      alert('Premium request approved successfully');
      // Refresh premium requests
      const requestsResponse = await axios.get('http://localhost:3000/premium-requests', {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        params: { status: filterStatus },
      });
      setPremiumRequests(requestsResponse.data);
    } catch (err) {
      alert(`Failed to approve request: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handle rejecting a premium request
  const handleReject = async (email) => {
    try {
      await axios.patch(
        `http://localhost:3000/premium-requests/email/${email}/reject`,
        {},
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      alert('Premium request rejected successfully');
      // Refresh premium requests
      const requestsResponse = await axios.get('http://localhost:3000/premium-requests', {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        params: { status: filterStatus },
      });
      setPremiumRequests(requestsResponse.data);
    } catch (err) {
      alert(`Failed to reject request: ${err.response?.data?.error || err.message}`);
    }
  };

  // Export payment history as CSV
  const exportPaymentsToCSV = () => {
    const headers = ['Email', 'Name', 'Amount (USD)', 'Status', 'Card Last 4', 'Date'];
    const rows = payments.map((payment) => [
      payment.email,
      payment.name,
      (payment.amount / 100).toFixed(2),
      payment.status,
      payment.cardLast4,
      new Date(payment.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'payment_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount / 100, 0);

  // Calculate incomplete payments
  const incompletePayments = payments.filter(
    (payment) => payment.status !== 'paid'
  ).length;

  // Filter premium requests by status
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  if (!user) {
    return <div className="text-center mt-10 text-red-500">Please log in to access this page</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Payments & Premium Requests</h1>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Revenue</p>
          <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Incomplete Payments</p>
          <p className="text-2xl">{incompletePayments}</p>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <button
          onClick={exportPaymentsToCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export Payment History
        </button>
      </div>

      {/* Payments Table */}
      <h2 className="text-xl font-semibold mb-2">Payment Transactions</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Amount (USD)</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Card Last 4</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentIntentId}>
                <td className="px-4 py-2 border">{payment.email}</td>
                <td className="px-4 py-2 border">{payment.name}</td>
                <td className="px-4 py-2 border">${(payment.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-2 border capitalize">{payment.status}</td>
                <td className="px-4 py-2 border">{payment.cardLast4}</td>
                <td className="px-4 py-2 border">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium Requests Table */}
      <h2 className="text-xl font-semibold mb-2">Premium Requests</h2>
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Amount (USD)</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Card Last 4</th>
              <th className="px-4 py-2 border">Request Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {premiumRequests.map((request) => (
              <tr key={request._id}>
                <td className="px-4 py-2 border">{request.email}</td>
                <td className="px-4 py-2 border">{request.user?.name || 'N/A'}</td>
                <td className="px-4 py-2 border">${(request.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-2 border capitalize">{request.status}</td>
                <td className="px-4 py-2 border">{request.payment?.cardLast4 || 'N/A'}</td>
                <td className="px-4 py-2 border">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.email)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.email)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments;