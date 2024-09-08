import { WordEntry } from "../../types/WordDefinitionFreeType";

export const getWordDefinition = async (word: string) => {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        const data = (await response.json()) as WordEntry[];
        
        if(!Array.isArray(data)) {
            return null;
        }
        return data;
    } catch {
        return null;
    }
}