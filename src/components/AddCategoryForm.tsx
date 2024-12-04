import React, { useState } from 'react';
import { createCategory } from '../../Redux/Slices/CategorySlice';
import { Category } from '../../services/Categories';
import { useAppDispatch } from '../../Redux/store';

const AddCategoryForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    image: '',
  });
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewCategory((prev) => ({ ...prev, image: file }));
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!newCategory.name || !newCategory.description || !newCategory.image) {
      setAddCategoryError('All fields are required.');
      return;
    }
  
    setAddCategoryError(null);
    setAddingCategory(true);
  
    try {
      const result = await dispatch(createCategory(newCategory)).unwrap();
  
      if (result) {
        setNewCategory({ name: '', description: '', image: '' });
        // Optionally, you can dispatch an action to update the category list
        // dispatch(fetchCategories());
      }
    } catch (error: unknown) {
      setAddCategoryError(error instanceof Error ? error.message : 'Failed to add category.');
    } finally {
      setAddingCategory(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h2>
      <form onSubmit={handleAddCategory} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            placeholder="Enter category name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newCategory.description}
            onChange={handleInputChange}
            placeholder="Enter category description"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={addingCategory}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            addingCategory ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {addingCategory ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      {addCategoryError && (
        <p className="mt-4 text-sm text-red-600">{addCategoryError}</p>
      )}
    </div>
  );
};

export default AddCategoryForm;