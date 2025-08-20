import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentData
} from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
}

export interface Design {
  id: string;
  userId: string;
  image: string;
  style: string;
  roomType: string;
  description?: string;
  liked: boolean;
  saved: boolean;
  createdAt: Date;
}

// User Operations
export const createUserProfile = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  const now = new Date();
  
  await setDoc(userRef, {
    ...data,
    id: userId,
    createdAt: now,
    updatedAt: now,
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  return userSnap.data() as User;
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  });
};

// Design Operations
export const createDesign = async (userId: string, designData: Partial<Design>) => {
  const designsRef = collection(db, 'designs');
  const designDoc = doc(designsRef);
  const now = new Date();
  
  await setDoc(designDoc, {
    ...designData,
    id: designDoc.id,
    userId,
    createdAt: now,
    liked: false,
    saved: false,
  });
  
  return designDoc.id;
};

export const getUserDesigns = async (userId: string): Promise<Design[]> => {
  const designsRef = collection(db, 'designs');
  const q = query(
    designsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Design);
};

export const updateDesign = async (designId: string, data: Partial<Design>) => {
  const designRef = doc(db, 'designs', designId);
  await updateDoc(designRef, data);
};

export const deleteDesign = async (designId: string) => {
  const designRef = doc(db, 'designs', designId);
  await deleteDoc(designRef);
};

// Get saved designs
export const getSavedDesigns = async (userId: string): Promise<Design[]> => {
  const designsRef = collection(db, 'designs');
  const q = query(
    designsRef,
    where('userId', '==', userId),
    where('saved', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Design);
};
