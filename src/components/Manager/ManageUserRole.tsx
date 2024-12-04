import  { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db as firestore } from '../../../services/firebase';

const ManageUserRole = ({ isAdmin }: { isAdmin: boolean }) => {
    const [users, setUsers] = useState<{ id: string; email?: string; }[]>([]);
    const [selectedUser, setSelectedUser] = useState<{ id: string } | null>(null);
    const [newRole, setNewRole] = useState('');
  
    useEffect(() => {
      const fetchUsers = async () => {
        const usersCollectionRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        setUsers(usersList);
      };
  
      fetchUsers();
    }, []);
  
    const handleRoleChange = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isAdmin) {
        alert('Only admin can change roles');
        return;
      }
  
      try {
        if (selectedUser) {
          const userDoc = doc(firestore, 'users', selectedUser?.id);
          await updateDoc(userDoc, { role: newRole });
          alert('Role updated successfully');
        } else {
          console.error('No user selected');
        }
      } catch (error) {
        console.error('Error updating role: ', error);
      }
    };
  
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage User Roles</h2>
        <select 
          onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}
          className="w-full p-2 mb-4 border rounded-md"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={JSON.stringify(user)}>
              {user.email}
            </option>
          ))}
        </select>
        {selectedUser && (
          <form onSubmit={handleRoleChange} className="space-y-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="New Role"
              required
              className="w-full p-2 border rounded-md"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Update Role
            </button>
          </form>
        )}
      </div>
    );
  };
  
  export default ManageUserRole;