import * as fs from 'fs';

export class FileLoader {
  static loadFileAsString(filePath: string): string {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return fileContent;
    } catch (err) {
      console.error(`Error reading file from ${filePath}: ${err.message}`);
      throw err;
    }
  }
}