import { DocumentReference } from "firebase/firestore";

export interface WordType {

    imageURL?: string | File;
    meaning: string;
    contexts: string[];
    name: string;

    learned?: 'notLearned' | 'learning' | 'mastered';

    wordSetRef?: DocumentReference;
    wordId?: string;
}

