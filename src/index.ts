import { DataProcessor } from './Data';
import NaiveBayesClassifier from './MachineLearning';
import { Reader } from './utils/Reader';

const main = () => {
    const db = new Reader('static/SMSSpamCollection', Number(process.argv[2]));

    const trainData = db.getTrain();
    const testData = db.getTest();

    const dataProcessor = new DataProcessor(trainData);
    dataProcessor.buildVocabulary();

    const classifier = new NaiveBayesClassifier(dataProcessor);

    classifier.fit();
    classifier.setPriorHam();
    classifier.setPriorSpam();

    const emails = DataProcessor.buildData(testData);

    for (let i = 0; i < emails.length; i++) {
        classifier.predict(
            emails[i].words.join(' '),
            emails[i].type,
            emails[i].words,
        );
    }

    classifier.printConfusionMatrix();

    console.log(`recall measure:    ${classifier.getRecall().toFixed(2)}`);
    console.log(`f1-measure:        ${classifier.getF1Measure().toFixed(2)}`);
    console.log(`Accuracy measure:  ${classifier.getAccuracy().toFixed(2)}`);
    console.log(`Precision measure: ${classifier.getPrecision().toFixed(2)}`);
};

main();
