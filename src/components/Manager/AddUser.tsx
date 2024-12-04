import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db as firestore } from '../../../services/firebase';

const AddUser = ({ isAdmin }: { isAdmin: boolean }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [role, setRole] = useState('');
  
    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isAdmin) {
        alert('Only admin can add users');
        return;
      }
  
      try {
        await addDoc(collection(firestore, 'users'), {
          email,
          role,
        });
        setEmail('');
        setPassword('');
        setRole('');
        alert('User added successfully');
      } catch (error) {
        console.error('Error adding user: ', error);
      }
    };
  
    return (
      <form onSubmit={handleAddUser} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          required
          className="w-full p-2 border rounded-md"
        />
        <button 
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Add User
        </button>
      </form>
    );
  };
  
  export default AddUser;