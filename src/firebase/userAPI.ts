import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { UserType } from '../types/UserType';



export const getUser = async (uid: string): Promise<UserType | undefined> => {
        const docRef = await getDoc(doc(db, 'users', uid));
        return docRef.data() as UserType;
}

