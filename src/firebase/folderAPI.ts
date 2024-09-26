import {
    collection,
    doc,
    DocumentReference,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import FolderType from '../types/FolderType';
import { db } from './firebase-config';



export const updateModifiedAtFolder = async (folderRef: string | DocumentReference) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');
    const userid = data.userId;


    const _folderRef =
        typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;
    const _folderDoc = await getDoc(_folderRef);
    if (!_folderDoc.exists()) throw new Error('Folder is not found');
    // Check permission to update the folder (only the owner can update the folder)
    if (_folderDoc.data().userRef.id !== userid)
        throw new Error("You don't have permission to update this folder");

    // update folder, modifiedAt is updated automatically
    await updateDoc(_folderRef, {
        modifiedAt: Timestamp.now()
    });
}


export const getFolders = async (
    userId: string,
    startAt: number = 0,
    limit: number = 5,
    search: string = '',
    sortBy: 'nameLowercase' | 'modifiedAt' | 'createAt' = 'nameLowercase'
) => {
    if (!userId) throw new Error('User id is not provided');
    const userRef = doc(db, 'users', userId);
    let q;
    if (search) {
        q = query(
            collection(db, 'folders'),
            where('userRef', '==', userRef),
            where('nameLowercase', '>=', search.toLowerCase()),
            where('nameLowercase', '<=', search.toLowerCase() + '\uf8ff'),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    } else {
        q = query(
            collection(db, 'folders'),
            where('userRef', '==', userRef),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    }
    const querySnapshot = await getDocs(q);
    const folders: FolderType[] = [];
    if (limit === -1) {
        querySnapshot.docs.forEach((doc) => {
            const folder = doc.data() as FolderType;
            folder.folderId = doc.id;
            folders.push(folder);
        });
        return {
            folders: folders,
            numOfTotalFolders: querySnapshot.size
        };
    }
    querySnapshot.docs.slice(startAt, startAt + limit).forEach((doc) => {
        const folder = doc.data() as FolderType;
        folder.folderId = doc.id;
        folders.push(folder);
    });

    return {
        folders: folders,
        numOfTotalFolders: querySnapshot.size
    };
};
