import fs from 'fs';

export class Reader {
    public static getData(path: string) {
        const text_buffer = fs.readFileSync(path);

        return text_buffer.toString();
    }
}
