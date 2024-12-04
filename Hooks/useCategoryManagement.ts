import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { fetchCategories, createCategory, modifyCategory, removeCategory } from '../Redux/Slices/CategorySlice';
import { Category } from '../services/Categories';
import { useEffect } from 'react'; 

export const useCategoryManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    return dispatch(createCategory(category)).unwrap();
  };

  const updateCategory = (categoryId: string, updatedCategory: Partial<Category>) => {
    const category: Category = { 
      id: categoryId, 
      name: updatedCategory.name ?? '', // provide a default value if name is undefined
      ...updatedCategory 
    };
    return dispatch(modifyCategory(category)).unwrap();
  };
  

  const deleteCategory = (categoryId: string, deleteAssociatedItems: boolean = false) => {
    return dispatch(removeCategory({ categoryId, deleteAssociatedItems })).unwrap();
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
