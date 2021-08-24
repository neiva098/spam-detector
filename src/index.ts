import { DataProcessor } from './Data';
import { Reader } from './utils/Reader';

const main = () => {
    const textFile = Reader.getData('static/SMSSpamCollection');

    const data = new DataProcessor(textFile);

    data.getSpams().forEach(email => console.log(email));

    data.getHams().forEach(email => console.log(email));
};

main();
