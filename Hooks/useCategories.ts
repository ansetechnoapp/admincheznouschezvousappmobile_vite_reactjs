import { useState, useEffect } from 'react';
import { getCategories } from "../services/Categories"; // replace with actual service

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  return { categories, error };
};

export default useCategories;
