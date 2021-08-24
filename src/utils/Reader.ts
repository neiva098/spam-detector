import fs from 'fs';

export class Reader {
    public static getData(path: string) {
        const text_buffer = fs.readFileSync(path);

        return text_buffer.toString();
    }
}

export type DataInterface = {
    type: 'ham' | 'spam';
} & EmailInterface;

export interface EmailInterface {
    words: string[];
}

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
}
