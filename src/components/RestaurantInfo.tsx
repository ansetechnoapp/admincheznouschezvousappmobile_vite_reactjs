import React, { useState,useEffect } from 'react';
import { updateRestaurantInfo,getRestaurantInfo } from '../../services/RestaurantInfo'; // Assurez-vous que cet import est correct



const AddRestaurantInfo: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zip, setZip] = useState<number>(0);
  const [phone, setPhone] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurantInfo();
        if (data) {
          setName(data.name || '');
          setCity(data.city || '');
          setAddress(data.address || '');
          setZip(data.zip || 0);
          setPhone(data.phone || 0);
        }
      } catch (error) {
        setError('Failed to fetch restaurant information.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await updateRestaurantInfo(name,city, address,zip, phone);
    if (result.success) {
      setMessage('Restaurant information updated successfully!');
    } else {
      setMessage('Failed to update restaurant information.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div>
      <h1>Update Restaurant Information</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            ville:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            code zip:
            <input
              type="number"
              value={zip}
              onChange={(e) => setZip(parseInt(e.target.value, 10))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(parseInt(e.target.value, 10))}
              required
            />
          </label>
        </div>
        <button type="submit">Update Info</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </>
  );
};


export default AddRestaurantInfo;
