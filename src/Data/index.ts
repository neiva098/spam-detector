import { DataInterface, EmailClassifications, EmailInterface } from './interfaces';

export class DataProcessor {
    private wordFrequency: Record<string, number> = {};
    private wordsHam: Record<string, number> = {};
    private wordsSpam: Record<string, number> = {};
    private vocabulary: Record<string, number[]> = {};
    private spams: EmailInterface[] = [];
    private hams: EmailInterface[] = [];

    private readonly delta = 0.5;

    constructor(dbText: string) {
        this.setData(DataProcessor.buildData(dbText));
    }

    public getSpamsCount() {
        return this.spams.length;
    }

    public getHamsCount() {
        return this.hams.length;
    }

    public getEmailsCount() {
        return this.getHamsCount() + this.getSpamsCount();
    }

    private pushEmail(data: DataInterface) {
        if (data.type === 'ham') return this.hams.push({ words: data.words });

        return this.spams.push({ words: data.words });
    }

    private setData(dataArray: DataInterface[]) {
        dataArray.forEach(data => this.pushEmail(data));

        return { spams: this.spams, hams: this.hams };
    }

    public static buildData(dbText: string) {
        const buildedData: DataInterface[] = [];

        dbText.split('\n').forEach(data => {
            const [type, ...splitedTabEmail] = data.split('\t');

            const words = splitedTabEmail.join('\t').split(' ');

            buildedData.push({
                type: type as DataInterface['type'],
                words,
            });
        });

        return buildedData;
    }

    public getSpams() {
        return [...this.spams];
    }

    public getHams() {
        return [...this.hams];
    }

    public buildVocabulary() {
        const sortedCorpus = Object.keys(this.wordFrequency).sort((a, b) =>
            a.toLowerCase() > b.toLowerCase() ? 1 : -1,
        );

        for (const key in sortedCorpus) {
            this.setVocabulary(key, [0, 0.0, 0, 0.0]);

            if (this.wordsHam[key]) {
                this.setFreqHam(key, this.wordsHam[key]);
                const probability = this.calcConditionalProb(
                    this.wordsHam[key],
                    EmailClassifications.HAM,
                );
                this.setConditinalProbHam(key, probability);
            } else {
                this.setFreqHam(key, 0);
                const probability = this.calcConditionalProb(
                    0,
                    EmailClassifications.HAM,
                );
                this.setConditinalProbHam(key, probability);
            }

            if (this.wordsSpam[key]) {
                this.setFreqHam(key, this.wordsSpam[key]);
                const probability = this.calcConditionalProb(
                    this.wordsSpam[key],
                    EmailClassifications.SPAM,
                );
                this.setConditinalProbSpam(key, probability);
            } else {
                this.setFreqSpam(key, 0);
                const probability = this.calcConditionalProb(
                    0,
                    EmailClassifications.SPAM,
                );
                this.setConditinalProbSpam(key, probability);
            }
        }

        return undefined;
    }

    private recordWordCount(word: string) {
        if (this.wordFrequency[word]) return this.wordFrequency[word]++;

        return (this.wordFrequency[word] = 1);
    }

    private recordWordsCount(words: string[]) {
        for (const word in words) {
            if (word == '') continue;

            this.recordWordCount(word.toLowerCase());
        }
    }

    private recordWordClassFrequency(word: string, type: EmailClassifications) {
        if (type === EmailClassifications.HAM) {
            if (this.wordsHam[word]) return this.wordsHam[word]++;

            return (this.wordsHam[word] = 1);
        }

        if (this.wordsSpam[word]) return this.wordsSpam[word]++;

        return (this.wordsSpam[word] = 1);
    }

    private updateWordFrequencyInClass(words: string[], type: EmailClassifications) {
        for (const word in words)
            this.recordWordClassFrequency(word.toLowerCase(), type);
    }

    private calcConditionalProb(freqWord: number, type: EmailClassifications) {
        const sizeOfCorpus = Object.keys(this.wordFrequency).length;
        const totalNoOfWords =
            type == EmailClassifications.HAM
                ? Object.values(this.wordsHam).reduce((a, b) => a + b, 0)
                : Object.values(this.wordsSpam).reduce((a, b) => a + b, 0);

        return (
            (freqWord + this.delta) / (totalNoOfWords + this.delta * sizeOfCorpus)
        );
    }

    public getVocabulary() {
        return this.vocabulary;
    }

    private setVocabulary(word: string, result: number[]) {
        this.vocabulary[word] = result;
    }

    private setFreqHam(word: string, freq: number) {
        this.vocabulary[word][0] = freq;
    }

    private setFreqSpam(word: string, freq: number) {
        this.vocabulary[word][2] = freq;
    }

    private setConditinalProbHam(word: string, freq: number) {
        this.vocabulary[word][1] = freq;
    }

    private setConditinalProbSpam(word: string, freq: number) {
        this.vocabulary[word][3] = freq;
    }
}
