import { collection, getDocs } from 'firebase/firestore';
import { db as firestore } from './firebase';
import { UserData } from './Auth';


export const fetchAllUsers = async (): Promise<UserData[]> => {
  const usersCollectionRef = collection(firestore, 'users');
  const usersSnapshot = await getDocs(usersCollectionRef);
  const usersList: UserData[] = usersSnapshot.docs.map(doc => doc.data() as UserData);
  return usersList;
};