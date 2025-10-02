import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Authcontext } from '../Authicantion/Auth/Authcontext';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch all users and check if current user is admin
  useEffect(() => {
    // If auth is still loading or user is null, wait
    if (authLoading || !user || !user.email) {
      if (!authLoading && !user) {
        // Redirect to login if user is not authenticated
        navigate('/login');
      }
      return;
    }

    const fetchUsers = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get('https://matrimony-server-side-sigma.vercel.app/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(usersResponse.data);

        // Check if current user is admin
        const userResponse = await axios.get(`https://matrimony-server-side-sigma.vercel.app/users/${user.email}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setIsAdmin(userResponse.data.role === 'admin');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch users.',
          confirmButtonColor: '#D81B60',
        });
      }
    };

    fetchUsers();
  }, [user, authLoading, navigate]);

  // Handle role toggle
  const handleRoleToggle = async (userEmail, currentRole) => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  try {
    const response = await axios.patch(
      `https://matrimony-server-side-sigma.vercel.app/users/${userEmail}/role`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    // Only update state if backend confirms success
    if (response.status === 200) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === userEmail ? { ...u, role: response.data.updatedRole } : u
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `User role updated to ${newRole} successfully`,
        confirmButtonColor: '#D81B60',
      });
    }
  } catch (error) {
    console.error('Error updating user role:', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.error || 'Failed to update user role.',
      confirmButtonColor: '#D81B60',
    });
  }
};


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D81B60]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#D81B60] font-[Playfair Display]">All Users</h1>
      {!isAdmin ? (
        <div className="text-red-500 text-lg">
          Access Denied: You must be an admin to view and manage users.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-[#D81B60] text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 capitalize">{u.role}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRoleToggle(u.email, u.role)}
                      disabled={u.email === user.email}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        u.email === user.email
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#D81B60] hover:bg-[#9f1239]'
                      }`}
                    >
                      {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default User;