import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const ContactReq = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        setLoading(true);
        console.log('User token:', user?.token); // Debug token
        // Fetch user data to check premium and admin status
        const userResponse = await axios.get(`http://localhost:3000/users/${user.email}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('User response:', userResponse.data); // Debug response
        setIsPremium(userResponse.data.isPremium || false);
        setIsAdmin(userResponse.data.role === 'admin');

        // Fetch contact requests based on user role
        if (isAdmin) {
          const response = await axios.get('http://localhost:3000/contact-requests', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setContactRequests(response.data);
        } else if (isPremium) {
          const response = await axios.get('http://localhost:3000/my-contact-requests', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setContactRequests(response.data);
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.data); // Debug error
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchUserAndRequests();
    }
  }, [user, authLoading]);

  const handleApprove = async (requestId) => {
    try {
      await axios.patch(
        `http://localhost:3000/contact-requests/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContactRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: 'approved', approvedAt: new Date() } : req
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(
        `http://localhost:3000/contact-requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setContactRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: 'rejected', rejectedAt: new Date() } : req
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] flex items-center justify-center">
        <p className="text-[#212121] font-lato">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] flex items-center justify-center">
        <p className="text-red-500 font-lato">Please log in to view contact requests.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] flex items-center justify-center">
        <p className="text-red-500 font-lato">{error}</p>
      </div>
    );
  }

  if (!isPremium && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
          <h2 className="text-3xl font-bold text-[#D81B60] mb-6 font-playfair">Premium Membership Required</h2>
          <p className="text-[#212121] mb-6 font-lato">
            You need a premium membership to view and send contact requests.
          </p>
          <Link
            to="/checkout"
            className="w-full bg-[#D81B60] text-white py-3 rounded-xl hover:bg-[#9f1239] transition-colors font-lato inline-block"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#D81B60] text-center mb-8 font-playfair">
          {isAdmin ? 'All Contact Requests' : 'My Contact Requests'}
        </h2>
        {contactRequests.length === 0 ? (
          <p className="text-[#212121] text-center font-lato">No contact requests found.</p>
        ) : (
          <div className="space-y-4">
            {contactRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-[#212121] font-lato">
                    <strong>Biodata ID:</strong> {request.requestedBiodataId}
                  </p>
                  {isAdmin && (
                    <>
                      <p className="text-[#212121] font-lato">
                        <strong>Requester:</strong> {request.requesterEmail}
                      </p>
                      <p className="text-[#212121] font-lato">
                        <strong>Biodata Name:</strong> {request.biodata?.name || 'N/A'}
                      </p>
                    </>
                  )}
                  {request.status === 'approved' && request.biodata && (
                    <>
                      <p className="text-[#212121] font-lato">
                        <strong>Contact Email:</strong> {request.biodata.contactEmail}
                      </p>
                      <p className="text-[#212121] font-lato">
                        <strong>Mobile:</strong> {request.biodata.mobileNumber || 'N/A'}
                      </p>
                    </>
                  )}
                  <p className="text-[#212121] font-lato">
                    <strong>Status:</strong> {request.status}
                  </p>
                  <p className="text-[#212121] font-lato">
                    <strong>Created At:</strong>{' '}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin && request.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-colors font-lato"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors font-lato"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactReq;