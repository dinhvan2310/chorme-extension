import {
    collection,
    doc,
    DocumentReference,
    getDoc,
    getDocs,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import FolderType from '../types/FolderType';
import { WordSetType } from '../types/WordSetType';
import { db } from './firebase-config';



export const getWordSet = async (wordSetId: string) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');


    const wordSetDoc = await getDoc(doc(db, 'wordSets', wordSetId));
    if (!wordSetDoc.exists()) return null;

    const folderDoc = await getDoc(wordSetDoc.data().folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');


    return {
        ...wordSetDoc.data(),
        wordsetId: wordSetDoc.id
    } as WordSetType;
};

export const getWordSets = async (
    folderRef: string | DocumentReference | undefined,
    startAt: number = 0,
    limit: number = 10,
    sortBy: 'nameLowercase' | 'createAt' | 'modifiedAt' = 'nameLowercase'
) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');

    if (!folderRef) throw new Error('Folder reference is not provided');
    const _folderRef = typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;

    const folderDoc = await getDoc(_folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');

    const q = query(
            collection(db, 'wordSets'),
            where('folderRef', '==', _folderRef),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );


    const querySnapshot = await getDocs(q);
    const wordSets: WordSetType[] = [];
    querySnapshot.docs.slice(startAt, startAt + limit).forEach((doc) => {
        const wordSet = doc.data() as WordSetType;
        wordSet.wordsetId = doc.id;
        wordSets.push(wordSet);
    });

    return {
        wordSets,
        numOfTotalWordSets: querySnapshot.size
    };
};


export const getTreeStructure = async () => {

    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');
    const userid = data.userId;

    const userRef = doc(db, 'users', userid);
    const folderQuerySnapshot = await getDocs(
        query(collection(db, 'folders'), where('userRef', '==', userRef))
    );
    const foldersData: FolderType[] = [];
    folderQuerySnapshot.forEach((doc) => {
        const folder = doc.data() as FolderType;
        folder.folderId = doc.id;
        foldersData.push(folder);
    });

    const rs = await Promise.all(foldersData.map(async(folder) => {
        return {
            title: folder.name,
            value: folder.folderId,
            selectable: false,
            children: await Promise.all(folder.wordSets.map(async(wordSet) => {
                const wordSetData = await getWordSet(wordSet.id);
                return {
                    title: wordSetData?.name,
                    value: wordSetData?.wordsetId
                }
            }))
        }
    }))

    return rs
}