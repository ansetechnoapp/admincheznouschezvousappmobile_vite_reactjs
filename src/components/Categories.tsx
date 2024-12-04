import React, { useState } from 'react';
import { Category } from '../../services/Categories';
import Modal from './Modal';
import UpdateCategory from './UpdateCategory';
import { useCategoryManagement } from '../../Hooks/useCategoryManagement';
import AddCategoryForm from './AddCategoryForm';

export const DisplayCategories: React.FC = () => {
  const { categories, loading, error, deleteCategory } = useCategoryManagement(); 
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const handleDelete = (categoryId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      deleteCategory(categoryId, true);
    }
  };

  const handleOpenUpdateModal = (category: Category) => {
    setCurrentCategory(category);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setCurrentCategory(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Categories Management</h1>
      
      <div className="mb-8">
        <AddCategoryForm />
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {category.image && (
                <img 
                  src={category.image as string} 
                  alt={category.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => handleDelete(category.id as string)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => handleOpenUpdateModal(category)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showUpdateModal} onClose={handleCloseUpdateModal}>
        {currentCategory && (
          <UpdateCategory category={currentCategory} onClose={handleCloseUpdateModal} />
        )}
      </Modal>
    </div>
  );
};