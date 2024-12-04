import React, { useState } from 'react';
import { Category } from '../../services/Categories';
import { modifyCategory } from '../../Redux/Slices/CategorySlice';
import { useAppDispatch } from '../../Redux/store';

interface UpdateCategoryProps {
  category: Category;
  onClose: () => void;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ category, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');
  const [image, setImage] = useState<File | string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCategory: Category = {
      id: category.id,
      name,
      description,
      image: image || category.image,
    };

    dispatch(modifyCategory(updatedCategory)).then(() => {
      onClose();
    });
  }; 

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <button type="submit">Update Category</button>
    </form>
  );
};

export default UpdateCategory;
