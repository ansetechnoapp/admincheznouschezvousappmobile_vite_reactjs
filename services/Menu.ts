import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { handleError } from "../utils/errorHandler";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Initialize Firebase Storage
const storage = getStorage();

export interface MenuItem {
  id?: string;
  name: string;
  images?: string[];
  description: string;
  price: number;
  categoryId: string;
  categoryName?: string;
}

export interface MenuItemInput {
  name: string;
  images: File[];
  description: string;
  price: number;
  categoryId: string;
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "menuItems"));
    const menuItems: MenuItem[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
    return menuItems;
  } catch (error) {
    handleError(error, "Failed to fetch menu items");
    throw error;
  }
};
export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    const docRef = doc(db, "menuItems", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MenuItem;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    handleError(error, `Failed to fetch menu item with id: ${id}`);
    return null;
  }
};


export const deleteMenuItem = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    // Récupérer le document pour accéder aux images
    const docRef = doc(db, "menuItems", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const menuItemData = docSnap.data() as MenuItem;

      // Supprimer les images associées si elles existent
      if (menuItemData.images && menuItemData.images.length > 0) {
        await deleteOldImages(menuItemData.images);
      }

      // Supprimer le document dans Firestore
      await deleteDoc(docRef);
      return { success: true };
    } else {
      console.error("No such document!");
      return { success: false };
    }
  } catch (error) {
    handleError(error, `Failed to delete menu item with id: ${id}`);
    return { success: false };
  }
};

export const addMenuItem = async (
  menuItemInput: MenuItemInput
): Promise<{ success: boolean; id?: string }> => {
  try {
    const { name, images = [], description, price, categoryId } = menuItemInput;

    if (!name || !price || !categoryId) {
      throw new Error("Name, price, and categoryId are required fields");
    }

    const imageUrls =
      images.length > 0 ? await uploadImages(images, "menuImages") : [];
    // console.log('Image URLs:', imageUrls);  // Log image URLs

    const menuItemData = {
      name,
      images: imageUrls, // Save image URLs here
      description,
      price,
      categoryId,
    };

    // console.log('Menu item to be added:', menuItemData);  // Log the menu item data

    const menuItemAdd = await addDoc(collection(db, "menuItems"), menuItemData);

    return { success: true, id: menuItemAdd.id };
  } catch (error) {
    handleError(error, "Failed to add menu item");
    return { success: false };
  }
};

export interface MenuItem {
  id?: string
  name: string
  images?: string[]
  mainImage?: string
  description: string
  price: number
  categoryId: string
  categoryName?: string
}

export interface MenuItemInput {
  name: string;
  images: File[];
  description: string;
  price: number;
  categoryId: string;
}

const uploadImages = async (
  images: File[],
  path: string
): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    return getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploadPromises);
};

const deleteOldImages = async (oldImageUrls: string[]) => {
  const deletePromises = oldImageUrls.map(async (url) => {
    const imageRef = ref(storage, url); // Créer une référence à l'URL de l'image
    return deleteObject(imageRef);
  });

  await Promise.all(deletePromises);
};

export const updateMenuItem = async (
  id: string,
  updatedMenuItem: Partial<MenuItem> & { images?: File[] }
): Promise<{ success: boolean; message?: string }> => {
  try {
    const menuItemRef = doc(db, "menuItems", id);
    const menuItemDoc = await getDoc(menuItemRef);

    if (!menuItemDoc.exists()) {
      throw new Error("Menu item does not exist");
    }

    const currentData = menuItemDoc.data() as MenuItem;
    const updatedData: Partial<MenuItem> = { ...updatedMenuItem };

    // Handle image updates
    if (updatedMenuItem.images && updatedMenuItem.images.length > 0) {
      const validImages = updatedMenuItem.images.filter(
        (image: File) => image instanceof File
      );
      if (validImages.length > 0) {
        // Supprimer les anciennes images
        if (currentData.images) {
          await deleteOldImages(currentData.images);
        }

        // Télécharger les nouvelles images
        const newImageUrls = await uploadImages(validImages, "menuImages");
        updatedData.images = newImageUrls; // Remplacer par les nouvelles images
      } else {
        console.error("Invalid image files.");
      }
    }

    // Assurez-vous que le prix est un nombre
    if (updatedData.price) {
      updatedData.price = Number(updatedData.price);
    }

    await updateDoc(menuItemRef, updatedData);

    return { success: true };
  } catch (error) {
    handleError(error, `Failed to update menu item with id: ${id}`);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update menu item",
    };
  }
};
