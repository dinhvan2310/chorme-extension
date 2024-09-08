export interface License {
    name: string;
    url: string;
}

export interface Phonetic {
    audio: string;
    sourceUrl?: string;
    text?: string;
    license?: License;
}

export interface Definition {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
}

export interface WordEntry {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: License;
    sourceUrls: string[];
    phonetic: string;
}