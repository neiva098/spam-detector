export type DataInterface = {
    type: EmailClassifications;
} & EmailInterface;

export interface EmailInterface {
    words: string[];
}

export enum EmailClassifications {
    SPAM = 'spam',
    HAM = 'ham',
}

export enum PredictionLabel {
    RIGHT = 'right',
    WRONG = 'wrong',
}
