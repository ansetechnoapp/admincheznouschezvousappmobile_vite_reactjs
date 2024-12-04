import { db } from './firebase';
import { collection, getDocs, addDoc, doc, query, where, runTransaction, updateDoc } from 'firebase/firestore';
import { mapDocsToData } from '../utils/mapDocsToData';
import { handleError } from '../utils/errorHandler';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

const storage = getStorage();

export interface Category {
  id?: string;
  name: string;
  description?: string;
  image?: File | string; 
}

export const addCategory = async (category: Category): Promise<{ success: boolean; id?: string; imageUrl?: string }> => {
  try {
    if (!category.name) {
      throw new Error('Category name is required');
    }

    if (!category.image) {
      throw new Error('Category image is required');
    }
    const categoryAdd = await addDoc(collection(db, 'categories'), {
      ...category,
      image: category.image,
    });
    return { success: true, id: categoryAdd.id };
  } catch (error) {
    handleError(error, 'Failed to add category');
    return { success: false };
  }
};

export const uploadImage = async (image: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${image.name}`);
  const snapshot = await uploadBytes(storageRef, image);
  return getDownloadURL(snapshot.ref);
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    return mapDocsToData<Category>(categoriesSnapshot);
  } catch (error) {
    handleError(error, 'Failed to get categories');
    return [];
  }
};

export const deleteCategory = async (categoryId: string, deleteAssociatedItems: boolean = false): Promise<{ success: boolean; message?: string }> => {
  try {
    const menuItemsSnapshot = await getDocs(query(collection(db, 'menuItems'), where('categoryId', '==', categoryId)));

    if (!menuItemsSnapshot.empty && !deleteAssociatedItems) {
      return {
        success: false,
        message: 'Category has associated menu items. Confirm deletion to proceed.',
      };
    }

    await runTransaction(db, async (transaction) => {
      menuItemsSnapshot.docs.forEach((menuItemDoc) => transaction.delete(menuItemDoc.ref));
      transaction.delete(doc(db, 'categories', categoryId));
    });

    return { success: true };
  } catch (error) {
    handleError(error, `Failed to delete category with id: ${categoryId}`);
    return {
      success: false,
      message: 'An error occurred while deleting the category.',
    };
  }
};

export const updateCategory = async (category: Category): Promise<{ success: boolean }> => {
  try {
    if (!category.id) {
      throw new Error('Category ID is required for update');
    }

    const categoryRef = doc(db, 'categories', category.id);
    await updateDoc(categoryRef, {
      ...category,
      image: category.image,
    });

    return { success: true };
  } catch (error) {
    handleError(error, 'Failed to update category');
    return { success: false };
  }
};
