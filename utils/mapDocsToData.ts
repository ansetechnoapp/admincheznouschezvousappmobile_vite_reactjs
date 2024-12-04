import { QuerySnapshot, DocumentData } from 'firebase/firestore';

export const mapDocsToData = <T>(snapshot: QuerySnapshot<DocumentData>): T[] => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  };
  