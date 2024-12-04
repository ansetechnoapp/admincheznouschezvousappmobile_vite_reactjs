import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../../../services/usersManager';
import AddUser from './AddUser';
import ManageUserRole from './ManageUserRole';
import { subscribeToAuthChanges } from "../../../services/Auth";

interface UserData {
  email: string;
  role: 'user' | 'admin';
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
 
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((role) => {
      setRole(role);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchAllUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users List</h1>
      <ul className="bg-white shadow-md rounded-lg overflow-hidden">
        {users.map((user, index) => (
          <li key={index} className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50">
            <span className="font-semibold">{user.email}</span> - <span className="text-gray-600">{user.role}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        {role === 'admin' ? (
          <div className="space-y-8">
            <AddUser isAdmin={role === 'admin'} />
            <ManageUserRole isAdmin={role === 'admin'} />
          </div>
        ) : (
          <p className="text-red-500">You must be an admin to access this page.</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;