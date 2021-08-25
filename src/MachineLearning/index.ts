import { DataProcessor } from '../Data';
import { EmailClassifications, PredictionLabel } from '../Data/interfaces';

export default class NaiveBayesClassifier {
    private PriorH: number = 0.0;
    private PriorS: number = 0.0;
    private S_True_Positive: number = 0;
    private S_False_Negative: number = 0;
    private H_True_Negative: number = 0;
    private H_False_Positive: number = 0;
    private result: Record<
        string,
        [
            predictedClass: EmailClassifications,
            scoreHam: number,
            scoreSpam: number,
            actualClass: EmailClassifications,
            label: PredictionLabel,
        ]
    > = {};

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

    public fit() {
        return this.data.getVocabulary();
    }

    public getClassificationResult() {
        return this.result;
    }

    private addClassificationResult(
        document: string,
        predicted: EmailClassifications,
        scoreHam: number,
        scoreSpam: number,
        actualClass: EmailClassifications,
        label: PredictionLabel,
    ) {
        this.result[document] = [predicted, scoreHam, scoreSpam, actualClass, label];
    }

    public predict(
        document: string,
        actualClass: EmailClassifications,
        words: string[],
    ) {
        let scoreHam = this.getPriorHam();
        let scoreSpam = this.getPriorSpam();
        let predictedClass: EmailClassifications;
        let label: PredictionLabel;

        for (const word in words) {
            const vocabulary = this.fit();
            if (vocabulary[word]) {
                const hamProb = vocabulary[word][1];
                const spamProb = vocabulary[word][3];
                scoreHam += Math.log10(hamProb);
                scoreSpam += Math.log10(spamProb);
            }
        }

        if (scoreHam > scoreSpam) predictedClass = EmailClassifications.HAM;
        else predictedClass = EmailClassifications.SPAM;

        if (predictedClass === actualClass) label = PredictionLabel.RIGHT;
        else label = PredictionLabel.WRONG;

        this.addClassificationResult(
            document,
            predictedClass,
            scoreHam,
            scoreSpam,
            actualClass,
            label,
        );

        this.setConfusionMatrix(actualClass, predictedClass);
    }

    public getAccuracy() {
        const total =
            this.S_True_Positive +
            this.H_True_Negative +
            this.S_False_Negative +
            this.H_False_Positive;

        return (this.S_True_Positive + this.H_True_Negative) / total;
    }

    public getPrecision() {
        return this.S_True_Positive / (this.S_True_Positive + this.H_False_Positive);
    }

    public getRecall() {
        return this.S_True_Positive / (this.S_True_Positive + this.S_False_Negative);
    }

    public getF1Measure() {
        const precision = this.getPrecision();
        const recall = this.getRecall();

        return 2 * ((precision * recall) / (precision + recall));
    }

    public printConfusionMatrix() {
        console.log('          CONFUSION_MATRIX         ');

        const message = `
        +-----------------------+----------------------+
        |   (Predicted) SPAM    |   (Predicted) HAM    |
        +------------------+-----------------------+----------------------+"
        | (Actual) SPAM         |          "${this.S_True_Positive}"         |         "${this.S_False_Negative}"           |
        |  (Actual) HAM         |          "${this.H_False_Positive}"         |         "${this.H_True_Negative}"         |
        +------------------+-----------------------+----------------------+
        `;

        console.log(message);

        return message;
    }
}
