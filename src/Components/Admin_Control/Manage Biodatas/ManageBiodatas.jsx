import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaCrown, FaTrash, FaSearch, FaSort, FaEdit } from 'react-icons/fa';

const ManageBiodatas = () => {
  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBiodata, setSelectedBiodata] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem('token');

  const fetchBiodatas = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:3000/biodatas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBiodatas(response.data);
    } catch (error) {
      console.error('Error fetching biodatas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch biodatas.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiodatas();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedBiodatas = [...biodatas].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'age') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBiodatas = sortedBiodatas.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.permanentDivision.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserEmailFromToken = () => {
    if (!token) return null;
    try {
      const payloadStr = token.split('.')[1];
      const payload = JSON.parse(atob(payloadStr));
      return payload.email;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const email = getUserEmailFromToken();
    if (email && token) {
      axios.get(`http://localhost:3000/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        setIsAdmin(response.data.role === 'admin');
      }).catch((error) => {
        console.error('Error fetching current user:', error);
      });
    }
  }, [token]);

  const createUserIfNotExists = async (userEmail, name) => {
    try {
      await axios.post('http://localhost:3000/users', {
        name,
        photoURL: '',
        role: 'user',
        isPremium: false,
        targetEmail: userEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User created successfully');
    } catch (createError) {
      if (createError.response?.status !== 409) { // 409 means already exists
        console.error('Error creating user:', createError);
      }
    }
  };

  const handleTogglePremium = async (biodata) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Admin privileges required.',
      });
      return;
    }
    const userEmail = biodata.email || biodata.contactEmail;
    if (!userEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User email is missing. Cannot toggle premium.',
      });
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/users/${userEmail.toLowerCase()}/premium`,
        { isPremium: !biodata.isPremium },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Premium status toggled to ${!biodata.isPremium ? 'Premium' : 'Normal'}.`,
      });
      fetchBiodatas(); // Refetch to update list
    } catch (error) {
      if (error.response?.status === 404) {
        // User not found, create it
        await createUserIfNotExists(userEmail, biodata.name);
        // Retry toggle
        try {
          await axios.patch(
            `http://localhost:3000/users/${userEmail.toLowerCase()}/premium`,
            { isPremium: !biodata.isPremium },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `User created and premium status toggled to ${!biodata.isPremium ? 'Premium' : 'Normal'}.`,
          });
          fetchBiodatas();
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to toggle premium after creating user.',
          });
        }
      } else {
        console.error('Error toggling premium:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to toggle premium status.',
        });
      }
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Admin privileges required to delete.',
      });
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This biodata will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D81B60',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/biodatas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Biodata has been deleted.', 'success');
        fetchBiodatas();
      } catch (error) {
        console.error('Error deleting biodata:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete biodata.',
        });
      }
    }
  };

  const openModal = (biodata) => {
    setSelectedBiodata(biodata);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBiodata(null);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData._id) return;
    setUpdating(true);
    try {
      // Exclude _id from update payload
      const { _id, ...updatePayload } = editData;
      await axios.patch(`http://localhost:3000/biodatas/${editData._id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Updated!', 'Biodata has been updated.', 'success');
      closeEditModal();
      fetchBiodatas();
    } catch (error) {
      console.error('Error updating biodata:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update biodata.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (showModal) closeModal();
      if (showEditModal) closeEditModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D81B60]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4">You do not have admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#D81B60]">Manage Biodatas</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, occupation, division..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60] w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D81B60]"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="age-asc">Age (Low-High)</option>
              <option value="age-desc">Age (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBiodatas.map((biodata) => (
          <div
            key={biodata._id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 ${
              biodata.isPremium
                ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-white'
                : 'border border-gray-200'
            }`}
          >
            <img
              src={biodata.profileImage}
              alt={biodata.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{biodata.name}</h3>
                {biodata.isPremium && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">Age: {biodata.age}</p>
              <p className="text-sm text-gray-600 mb-1">Division: {biodata.permanentDivision}</p>
              <p className="text-sm text-gray-600 mb-1">Occupation: {biodata.occupation}</p>
              <p className="text-sm text-gray-600 mb-1">Status: {biodata.maritalStatus}</p>
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(biodata)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                    title="View Details"
                  >
                    <FaEye className="text-sm" />
                  </button>
                
                  <button
                    onClick={() => handleTogglePremium(biodata)}
                    className={`p-2 rounded flex items-center justify-center transition-colors ${
                      biodata.isPremium
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    title={biodata.isPremium ? 'Downgrade to Normal' : 'Upgrade to Premium'}
                  >
                    <FaCrown className="text-sm" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(biodata._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                  title="Delete"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Modal */}
      {showModal && selectedBiodata && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#D81B60] mb-4">{selectedBiodata.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p><strong>Date of Birth:</strong> {selectedBiodata.dob}</p>
                  <p><strong>Age:</strong> {selectedBiodata.age}</p>
                  <p><strong>Height:</strong> {selectedBiodata.height}</p>
                  <p><strong>Weight:</strong> {selectedBiodata.weight}</p>
                  <p><strong>Occupation:</strong> {selectedBiodata.occupation}</p>
                  <p><strong>Race:</strong> {selectedBiodata.race}</p>
                  <p><strong>Father's Name:</strong> {selectedBiodata.fatherName}</p>
                  <p><strong>Mother's Name:</strong> {selectedBiodata.motherName}</p>
                </div>
                <div>
                  <p><strong>Permanent Division:</strong> {selectedBiodata.permanentDivision}</p>
                  <p><strong>Present Division:</strong> {selectedBiodata.presentDivision}</p>
                  <p><strong>Marital Status:</strong> {selectedBiodata.maritalStatus}</p>
                  <p><strong>Expected Partner Age:</strong> {selectedBiodata.partnerAge}</p>
                  <p><strong>Expected Partner Height:</strong> {selectedBiodata.partnerHeight}</p>
                  <p><strong>Expected Partner Weight:</strong> {selectedBiodata.partnerWeight}</p>
                  <p><strong>Contact Email:</strong> {selectedBiodata.contactEmail}</p>
                  <p><strong>Mobile Number:</strong> {selectedBiodata.mobileNumber}</p>
                </div>
              </div>
              <img
                src={selectedBiodata.profileImage}
                alt={selectedBiodata.name}
                className="w-full max-w-xs mx-auto mt-4 rounded-lg"
              />
              <button
                onClick={closeModal}
                className="mt-4 bg-[#D81B60] text-white px-4 py-2 rounded hover:bg-[#ad1457] w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default ManageBiodatas;