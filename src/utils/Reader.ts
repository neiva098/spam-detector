import fs from 'fs';

export class Reader {
    private trainData!: string;
    private testData!: string;

    constructor(path: string, fractionTrain: number) {
        this.setData(path, fractionTrain);
    }

    public getTrain() {
        return this.trainData;
    }

    public getTest() {
        return this.testData;
    }

    private static getData(path: string) {
        const text_buffer = fs.readFileSync(path);

        return text_buffer.toString();
    }

    protected setData(path: string, fractionTrain: number) {
        const totalOfEmails = Reader.getData(path).split('\n');

        const slice = Number(
            Number(fractionTrain * totalOfEmails.length).toFixed(0),
        );

        this.trainData = totalOfEmails.slice(0, slice).join('\n');
        this.testData = totalOfEmails.slice(slice).join('\n');
    }
}
