import path from 'path'
import axios from 'axios'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'



export async function download_file(url_file: string): Promise<string> {
    console.log("download_file сработал")
    const uploadsDir = path.join(process.cwd(), 'uploads')

    const url = new URL(url_file)
    const ext = path.extname(url.pathname)
    const fileName = `${uuidv4()}${ext}`

    const filePath = path.join(uploadsDir, fileName)
    //console.log(filePath)
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
