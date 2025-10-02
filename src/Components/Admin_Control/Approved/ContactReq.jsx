import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const ContactReq = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('User token:', user?.accessToken); // Debug token
        // Fetch user data to check premium and admin status
        const userResponse = await axios.get(`https://matrimony-server-side-sigma.vercel.app/users/${user.email}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        console.log('User response:', userResponse.data); // Debug response
        const fetchedIsPremium = userResponse.data.isPremium || false;
        const fetchedIsAdmin = userResponse.data.role === 'admin';
        setIsPremium(fetchedIsPremium);
        setIsAdmin(fetchedIsAdmin);

        // Clear previous error if any
        setError(null);

        // Fetch contact requests based on user role
        let response;
        if (fetchedIsAdmin) {
          response = await axios.get('https://matrimony-server-side-sigma.vercel.app/contact-requests?status=pending', {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          setContactRequests(response.data);
        } else if (fetchedIsPremium) {
          response = await axios.get('https://matrimony-server-side-sigma.vercel.app/my-contact-requests', {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          setContactRequests(response.data);
        } else {
          // Non-premium non-admin: no fetch, will show upgrade message
          setContactRequests([]);
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.data); // Debug error
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required for this action.');
          // For non-admin trying admin endpoint, but since we check before fetch, shouldn't happen
          if (!isAdmin) {
            navigate('/unauthorized');
          }
        } else {
          setError(err.response?.data?.error || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchUserAndRequests();
    }
  }, [user, authLoading, navigate, isAdmin]);

  const handleApprove = async (requestId) => {
    if (!isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }
    try {
      await axios.patch(
        `https://matrimony-server-side-sigma.vercel.app/contact-requests/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      // Remove the approved request from the list since only pending are shown
      setContactRequests((prev) => prev.filter((req) => req._id !== requestId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    if (!isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }
    try {
      await axios.patch(
        `https://matrimony-server-side-sigma.vercel.app/contact-requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      // Remove the rejected request from the list since only pending are shown
      setContactRequests((prev) => prev.filter((req) => req._id !== requestId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    }
  };

  // Additional check after loading: redirect if unauthorized for admin view
  useEffect(() => {
    if (!loading && !authLoading && user) {
      if (!isAdmin && !isPremium) {
        navigate('/premium-members'); // or wherever appropriate
      }
    }
  }, [loading, authLoading, isAdmin, isPremium, user, navigate]);

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
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
          <h3 className="text-xl font-bold text-red-500 mb-4 font-lato">Error</h3>
          <p className="text-red-500 font-lato mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#D81B60] text-white py-3 px-6 rounded-xl hover:bg-[#9f1239] transition-colors font-lato"
          >
            Retry
          </button>
        </div>
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
          {isAdmin ? 'Pending Contact Requests (Admin Panel)' : 'My Contact Requests'}
        </h2>
        {contactRequests.length === 0 ? (
          <p className="text-[#212121] text-center font-lato">No {isAdmin ? 'pending ' : ''}contact requests found.</p>
        ) : (
          <div className="space-y-4">
            {contactRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-[#212121] font-lato">
                    <strong>Biodata ID:</strong> {request.requestedBiodataId}
                  </p>
                  {isAdmin && (
                    <>
                      <p className="text-[#212121] font-lato">
                        <strong>Requester:</strong> {request.requesterEmail}
                      </p>
                      <p className="text-[#212121] font-lato">
                        <strong>Requester Premium:</strong> {request.requester?.isPremium ? 'Yes' : 'No'}
                      </p>
                      <p className="text-[#212121] font-lato">
                        <strong>Biodata Name:</strong> {request.biodata?.name || 'N/A'}
                      </p>
                    </>
                  )}
                  {!isAdmin && request.biodata && (
                    <p className="text-[#212121] font-lato">
                      <strong>Profile Name:</strong> {request.biodata.name}
                    </p>
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
                    <strong>Status:</strong>{' '}
                    <span
                      className={`capitalize px-2 py-1 rounded-full text-xs ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </p>
                  <p className="text-[#212121] font-lato">
                    <strong>Created At:</strong>{' '}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin && request.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-colors font-lato w-full sm:w-auto"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors font-lato w-full sm:w-auto"
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