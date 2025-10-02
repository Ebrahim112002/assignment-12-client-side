import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Send, UserCheck, AlertCircle } from 'lucide-react'; // icons
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const UserReqSend = ({ biodataId, biodata }) => {
  const { user, loading } = useContext(Authcontext);
  console.log('User from context:', user);
  console.log('User isPremium from context:', user?.isPremium);
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [requestStatus, setRequestStatus] = useState('none'); // 'none', 'pending', 'approved', 'rejected'
  const [fetching, setFetching] = useState(true);

  // Animation variants for button
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Sync isPremium with context
  useEffect(() => {
    if (user) {
      console.log('Syncing isPremium from context:', user.isPremium);
      setIsPremium(user.isPremium || false);
    }
  }, [user?.isPremium, user]);

  // Fetch only request status
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!user || !biodataId) {
        setFetching(false);
        return;
      }

      const token = user.accessToken || localStorage.getItem('token');
      console.log('Token used:', token ? 'Present' : 'Missing');
      if (!token) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);

        console.log('Using isPremium from context/state:', isPremium);

        // Fetch my contact requests to check status for this biodata
        console.log('Fetching contact requests...');
        const reqRes = await fetch('http://localhost:3000/my-contact-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Requests response status:', reqRes.status);
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          console.log('Fetched requests:', reqData);
          const currentReq = reqData.find((req) => req.requestedBiodataId === biodataId);
          console.log('Current request for biodataId', biodataId, ':', currentReq);
          if (currentReq) {
            setRequestStatus(currentReq.status);
            console.log('Set requestStatus to:', currentReq.status);
          } else {
            console.log('No current request found, status remains none');
          }
        }
      } catch (err) {
        console.error('Error fetching request data:', err);
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Fetch Error',
          text: 'Failed to load request data. Please try again.',
          timer: 2000,
          position: 'top-end',
          showConfirmButton: false,
          background: '#FFF8E1',
          color: '#212121',
        });
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchRequestData();
    }
  }, [user, biodataId]);

  // Handle send contact request
  const handleSendRequest = async () => {
    console.log('handleSendRequest called');
    console.log('Current isPremium:', isPremium);
    console.log('Current requestStatus:', requestStatus);
    if (!user || !biodataId) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Login Required',
        text: 'Please log in to send a request.',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
      });
      navigate('/login');
      return;
    }

    const token = user.accessToken || localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check premium status
    if (!isPremium) {
      console.log('User not premium, showing upgrade message');
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Upgrade to Premium',
        text: 'Only premium users can send contact requests. Upgrade now to unlock this feature!',
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
        footer: (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/checkout')}
            className="bg-[#D81B60] text-white px-4 py-2 rounded-xl hover:bg-[#FFD700] hover:text-[#212121] font-lato"
          >
            Upgrade Now
          </motion.button>
        ),
      });
      return;
    }

    // Handle existing statuses
    if (requestStatus === 'pending') {
      console.log('Request pending, showing wait message');
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Request Pending',
        text: 'Your contact request is already pending admin approval. Please wait until admin approves.',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
      });
      return;
    }

    if (requestStatus === 'approved') {
      console.log('Request approved, showing info');
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Request Approved',
        text: `Contact info for ${biodata?.name || 'this profile'} is available in your requests.`,
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
      });
      return;
    }

    if (requestStatus === 'rejected') {
      console.log('Request rejected, showing warning');
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Request Rejected',
        text: 'Your previous request was rejected. Please try another profile or contact support.',
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
      });
      return;
    }

    // Send the request
    console.log('Sending new request...');
    try {
      const res = await fetch('http://localhost:3000/contact-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ biodataId }),
      });

      console.log('Request response status:', res.status);
      const data = await res.json();
      console.log('Request response data:', data);

      if (res.ok) {
        setRequestStatus('pending');
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Request Sent',
          text: 'Your contact request has been sent successfully. Waiting for admin approval.',
          timer: 2000,
          position: 'top-end',
          showConfirmButton: false,
          background: '#FFF8E1',
          color: '#212121',
        });
      } else {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: data.error || 'Failed to Send',
          text: data.details || 'Could not send contact request. Please try again.',
          timer: 3000,
          position: 'top-end',
          showConfirmButton: false,
          background: '#FFF8E1',
          color: '#212121',
        });
      }
    } catch (err) {
      console.error('Error sending request:', err);
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Network Error',
        text: 'An error occurred while sending the request. Please check your connection.',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
        background: '#FFF8E1',
        color: '#212121',
      });
    }
  };

  console.log('Rendering UI - isPremium:', isPremium, 'requestStatus:', requestStatus);

  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 border-2 border-[#D81B60] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Render based on status
  const renderRequestUI = () => {
    const profileName = biodata?.name || 'this profile';
    console.log('renderRequestUI - isPremium:', isPremium, 'requestStatus:', requestStatus);
    if (!isPremium) {
      console.log('Rendering upgrade message');
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
        >
          <AlertCircle className="mx-auto h-6 w-6 text-yellow-500 mb-2" />
          <p className="text-sm text-yellow-800 font-lato">
            Upgrade to Premium to send contact requests and unlock full access to profiles like {profileName}.
          </p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/checkout')}
            className="mt-3 bg-[#D81B60] text-white px-4 py-2 rounded-xl hover:bg-[#FFD700] hover:text-[#212121] font-lato"
          >
            Upgrade to Premium
          </motion.button>
        </motion.div>
      );
    }

    if (requestStatus === 'approved') {
      console.log('Rendering approved message');
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <UserCheck className="mx-auto h-6 w-6 text-green-500 mb-2" />
          <p className="text-sm text-green-800 font-lato mb-2">Request Approved!</p>
          <p className="text-sm text-green-700 font-lato">
            <strong>Email:</strong> {biodata?.contactEmail || 'N/A'} |{' '}
            <strong>Phone:</strong> {biodata?.mobileNumber || 'N/A'}
          </p>
        </motion.div>
      );
    }

    if (requestStatus === 'pending') {
      console.log('Rendering pending message');
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center"
        >
          <Send className="mx-auto h-6 w-6 text-blue-500 mb-2" />
          <p className="text-sm text-blue-800 font-lato">
            Your request is pending admin approval. Please wait until admin approves.
          </p>
        </motion.div>
      );
    }

    if (requestStatus === 'rejected') {
      console.log('Rendering rejected message');
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-center"
        >
          <AlertCircle className="mx-auto h-6 w-6 text-red-500 mb-2" />
          <p className="text-sm text-red-800 font-lato">
            Your request was rejected. Please try another profile.
          </p>
        </motion.div>
      );
    }

    // Default: Send button for premium users with no prior request
    console.log('Rendering send button');
    return (
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleSendRequest}
        className="w-full bg-[#D81B60] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#212121] font-lato flex items-center justify-center gap-2"
      >
        <Send size={18} />
        Send Contact Request to {profileName}
      </motion.button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-[#D81B60] mb-4 text-center font-playfair">
        Contact Request
      </h3>
      {renderRequestUI()}
    </div>
  );
};

export default UserReqSend;