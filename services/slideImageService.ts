import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

export const uploadImageToFirebase = async (image: File, imageId: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `slideImages/${imageId}`);
  const snapshot = await uploadBytes(storageRef, image);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const saveImageUrlToFirestore = async (imageUrl: string, imageId: string): Promise<void> => {
  // Use setDoc with merge option to update specific entry
  await setDoc(doc(db, "slideImage", imageId), {
    imageUrl: imageUrl,
  }, { merge: true });
};

export const fetchImageUrlsFromFirestore = async (): Promise<Record<string, string>> => {
  const querySnapshot = await getDocs(collection(db, "slideImage"));
  const imageUrls: Record<string, string> = {};

  querySnapshot.forEach((doc) => {
    imageUrls[doc.id] = doc.data().imageUrl;
  });
  return imageUrls;
};