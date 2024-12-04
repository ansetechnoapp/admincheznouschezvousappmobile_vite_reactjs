import { db } from "./firebase";
import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { handleError } from "../utils/errorHandler";

/**
 * Type definition for restaurant information.
 */
interface RestaurantInfo {
    name: string;
    city: string;
    address: string;
    zip: number;
    phone: number;
  }
  
  const COLLECTION_NAME = "restaurantInfo";
  const DOCUMENT_ID = "info";
  
  /**
   * Update restaurant information.
   * @param name - The name of the restaurant.
   * @param city - The city of the restaurant.
   * @param address - The address of the restaurant.
   * @param zip - The zip code of the restaurant.
   * @param phone - The phone number of the restaurant.
   * @returns A promise that resolves to an object indicating success.
   */
  export const updateRestaurantInfo = async (
    name: string,
    city: string,
    address: string,
    zip: number,
    phone: number
  ): Promise<{ success: boolean }> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await updateDoc(docRef, { name, city, address, zip, phone });
      return { success: true };
    } catch (error) {
      handleError(error, "Failed to update restaurant info");
      return { success: false };
    }
  };

/**
 * Fetch restaurant information.
 * @returns A promise that resolves to an object containing restaurant information.
 */
export const getRestaurantInfo = async (): Promise<RestaurantInfo | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as RestaurantInfo;
      } else {
        throw new Error("No such document for restaurant info!");
      }
    } catch (error) {
      handleError(error, "Failed to get restaurant info");
    }
  };