import { DataInterface, EmailInterface } from './interfaces';

export class DataProcessor {
    private spams: EmailInterface[] = [];
    private hams: EmailInterface[] = [];

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

    private static buildData(dbText: string) {
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
        return undefined;
    }
}
