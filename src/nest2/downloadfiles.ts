import path from 'path'
import axios from 'axios'
import * as fs from 'fs'



export async function download_file(url_file: string): Promise<string> {

    const uploadsDir = path.join(process.cwd(), 'uploads')

    const fileName = path.basename(url_file)

    const filePath = path.join(uploadsDir, fileName)

    const writer = fs.createWriteStream(filePath)

    const response = await axios({
        method: 'GET',
        url: url_file,
        responseType: 'stream',

    });
    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(fileName));
        writer.on('error', reject);
    });

    return fileName
}
