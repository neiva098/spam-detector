import { DataProcessor } from '../Data';
import { EmailClassifications } from '../Data/interfaces';

export default class NaiveBayesClassifier {
    private PriorH: number = 0.0;
    private PriorS: number = 0.0;
    private S_True_Positive: number = 0;
    private S_False_Negative: number = 0;
    private H_True_Negative: number = 0;
    private H_False_Positive: number = 0;

    private data: DataProcessor;

    constructor(data: DataProcessor) {
        this.data = data;
    }

    private getPriorHam() {
        return this.PriorH;
    }

    public setPriorHam() {
        this.PriorH = Math.log10(
            this.data.getHamsCount() / this.data.getEmailsCount(),
        );
    }

    private getPriorSpam() {
        return this.PriorS;
    }

    public setPriorSpam() {
        this.PriorS = Math.log10(
            this.data.getSpamsCount() / this.data.getEmailsCount(),
        );
    }

    private setConfusionMatrix(
        target: EmailClassifications,
        predicted: EmailClassifications,
    ) {
        if (
            target == EmailClassifications.SPAM &&
            predicted == EmailClassifications.SPAM
        )
            return this.S_True_Positive++;

        if (
            target == EmailClassifications.SPAM &&
            predicted == EmailClassifications.HAM
        )
            return this.S_False_Negative++;

        if (
            target == EmailClassifications.HAM &&
            predicted == EmailClassifications.HAM
        )
            return this.H_True_Negative++;

        return this.H_False_Positive++;
    }

    public fit() {}
}
