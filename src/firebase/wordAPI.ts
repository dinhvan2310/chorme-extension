// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "./firebase-config";

import { arrayRemove, arrayUnion, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import FolderType from '../types/FolderType';
import { WordGlobalType } from '../types/WordGlobalType';
import { WordSetType } from '../types/WordSetType';
import { WordType } from '../types/WordType';
import { db } from './firebase-config';
import { updateModifiedAtFolder } from './folderAPI';
import { getSettings, setSettings } from '../apis/settings/settings';

export const addWord = async (wordSetId: string, word: WordType) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');
    // const userid = data.userId;

    

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);

    if (!wordSetDoc.exists()) {
        const settings = await getSettings();
        await setSettings(
            {
                ...settings,
                wordSetSave: ''
            }
        )
    }
    const wordSetData = wordSetDoc.data() as WordSetType;

    const wordRef = doc(db, 'words', `${wordSetId}_${word.name.trim().toLowerCase()}`);
    setDoc(wordRef, {
        contexts: word.contexts,
        meaning: word.meaning.trim(),
        imageURL: '',
        name: word.name.trim().toLowerCase(),
        wordSetRef: wordSetRef,
        wordId: `${wordSetId}_${word.name}`,
        createdAt: Timestamp.now(),
        learned: 'notLearned'
    });

    if (wordSetRef) updateDoc(wordSetRef, {
        words: arrayUnion(wordRef)
    })

    // updateWordGlobal(word);
    updateWordGlobal(word);
    if (typeof wordSetData.folderRef !== 'string') {
        updateModifiedAtFolder(wordSetData.folderRef.id);
    }

    return wordRef
};


export const getWords = async (
    wordSetId: string,
) => {
    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);

    if (!wordSetDoc.exists()) throw new Error('WordSet not found');

    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('wordSetRef', '==', wordSetRef));

    const querySnapshot = await getDocs(q);
    const words: WordType[] = [];
    querySnapshot.forEach((doc) => {
        const wordData = doc.data() as WordType;
        words.push({
            ...wordData,
            wordId: doc.id,
        });
    });
    return words;
};

export const updateWordGlobal = async (word: WordType) => {

    const wordGlobalRef = doc(db, 'wordGlobals', word.name.trim().toLowerCase());
    const wordGlobalDoc = await getDoc(wordGlobalRef);

    if (!wordGlobalDoc.exists()) {
        setDoc(wordGlobalRef, {
            name: word.name.trim().toLowerCase(),
            meanings: [
                {
                    meaning: word.meaning.trim(),
                    lastUsedAt: Timestamp.now(),
                    usageCount: 1
                }
            ],
            contexts: word.contexts,
        })
    } else {
        const wordGlobalData = wordGlobalDoc.data() as WordGlobalType;

        let isUsedMeaning = false;
        const _meanings = wordGlobalData.meanings.map(meaning => {
            if (meaning.meaning.trim().toLowerCase() === word.meaning.trim().toLowerCase()){
                isUsedMeaning = true;
                return {
                    meaning: meaning.meaning,
                    lastUsedAt: Timestamp.now(),
                    usageCount: meaning.usageCount + 1
                }
            }
            return meaning
        });
        if (!isUsedMeaning) {
            _meanings.push({
                meaning: word.meaning.trim(),
                lastUsedAt: Timestamp.now(),
                usageCount: 1
            })
        }

        const _contexts = wordGlobalData.contexts.concat(word.contexts).filter((value, index, self) => self.indexOf(value) === index);

    

        updateDoc(wordGlobalRef, {
            meanings: _meanings,
            contexts: _contexts,
        })
    }
}

export const getWordFromUser = async () => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) return [];
    const userid = data.userId;

    const userRef = doc(db, 'users', userid);
    if (!userRef) throw new Error('User not found');
    
    const q = query(collection(db, 'wordSets'), where('userRef', '==', userRef));
    const querySnapshot = await getDocs(q);

    const wordSetRefs: DocumentReference[] = [];
    querySnapshot.forEach((doc) => {
        wordSetRefs.push(doc.ref);
    });

    if (wordSetRefs.length === 0) return [];
    const q2 = query(collection(db, 'words'), where('wordSetRef', 'in', wordSetRefs));
    const querySnapshot2 = await getDocs(q2);

    const words: WordType[] = [];
    querySnapshot2.forEach((doc) => {
        const wordData = doc.data() as WordType;
        words.push({
            ...wordData,
            wordId: doc.id,
        });
    });

    return words.map(word => {
        return word.name
    });
}

export const getWordNotLearned = async () => {

    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) return [];
    const userid = data.userId;

    console.log('userid - getWordNotLearn', userid);

    const userRef = doc(db, 'users', userid);
    if (!userRef) return [];
    
    const q = query(collection(db, 'wordSets'), where('userRef', '==', userRef));
    const querySnapshot = await getDocs(q);

    const wordSetRefs: DocumentReference[] = [];
    querySnapshot.forEach((doc) => {
        wordSetRefs.push(doc.ref);
    });

    if (wordSetRefs.length === 0) return [];
    const q2 = query(collection(db, 'words'), where('wordSetRef', 'in', wordSetRefs), where('learned', '==', 'notLearned'));
    const querySnapshot2 = await getDocs(q2);

    const words: WordType[] = [];
    querySnapshot2.forEach((doc) => {
        const wordData = doc.data() as WordType;
        words.push({
            ...wordData,
            wordId: doc.id,
        });
    });

    const q3 = query(q2, where('learned', '==', 'learning'), 
        where('createdAt', '<', Timestamp.fromDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7))) // 7 days
    );
    const querySnapshot3 = await getDocs(q3);
    querySnapshot3.forEach((doc) => {
        const wordData = doc.data() as WordType;
        words.push({
            ...wordData,
            wordId: doc.id,
        });
    });

    return words;
}

export const updateWord = async (wordId: string, learned: 'notLearned' | 'learning' | 'mastered') => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');
    // const userid = data.userId;

    if (!wordId) throw new Error('WordId is not defined');

    const wordDoc = await getDoc(doc(db, 'words', wordId));
    if (!wordDoc.exists()) throw new Error('Word not found');


    updateDoc(doc(db, 'words', wordId), {
        learned: learned
    })
}

export const checkCurrentUserIsHaveWord = async (word: string, wordSetId?: string) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) return [];
    const uid = data.userId;


    const userRef = doc(db, 'users', uid);
    if (!userRef) throw new Error('User not found');
    const q = query(collection(db, 'folders'), where('userRef', '==', userRef));
    const querySnapshot = await getDocs(q);
    const wordSetRefs: Array<{
        folderName: string,
        wordSetRef: DocumentReference
    }> = [];
    querySnapshot.forEach((doc) => {
        const folder = doc.data() as FolderType;
        for (const wordSet of folder.wordSets) {
            wordSetRefs.push({
                folderName: folder.name,
                wordSetRef: wordSet
            });
        }
    });

    const rs = [];
    for (const {folderName, wordSetRef} of wordSetRefs) {
        const wordRef = doc(db, 'words', `${wordSetRef.id}_${word.trim().toLowerCase()}`);
        const wordDoc = await getDoc(wordRef);
        const wordSetData = ((await getDoc(doc(db, 'wordSets', wordSetRef.id))).data()) as WordType

        if (wordSetId === wordSetRef.id) {
            continue;
        } else if (wordDoc.exists()) {
            rs.push({
                folderName: folderName,
                wordSetName: wordSetData.name
            })
        }
    }
    if (rs.length > 0) {
        return rs
    }
    return [];

}

export const removeWord = async (wordId: string) => {
    const data =  await chrome.storage.local.get('userId');
    if (!data.userId) throw new Error('User is not logged in');
    // const userid = data.userId;

    const wordRef = doc(db, 'words', wordId);
    const wordDoc = await getDoc(wordRef);
    if (!wordDoc.exists()) throw new Error('Word not found');

    const wordData = wordDoc.data() as WordType;
    const wordSetRef = wordData.wordSetRef;

    if (wordSetRef) updateDoc(wordSetRef, {
        words: arrayRemove(wordRef)
    })

    return deleteDoc(wordRef);
}