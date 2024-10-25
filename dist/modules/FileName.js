import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { dirname } from 'path';
const ensureDirectoryExists = (filePath, isWrite) => {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
        if (isWrite) {
            try {
                mkdirSync(dir, { recursive: true });
                return true;
            }
            catch (error) {
                return false;
            }
        }
        return false;
    }
    return true;
};
export const FileOperations = {
    writeFile: (filePath, data) => {
        if (!ensureDirectoryExists(filePath, true)) {
            return false;
        }
        try {
            writeFileSync(filePath, data, 'utf8');
            return true;
        }
        catch (error) {
            return false;
        }
    },
    readFile: (filePath) => {
        if (!ensureDirectoryExists(filePath, false)) {
            return null;
        }
        try {
            return readFileSync(filePath, 'utf8');
        }
        catch (error) {
            return null;
        }
    },
    deleteFile: (filePath) => {
        if (!existsSync(filePath)) {
            return false;
        }
        try {
            unlinkSync(filePath);
            return true;
        }
        catch (error) {
            return false;
        }
    },
    updateFile: (filePath, data) => {
        return FileOperations.writeFile(filePath, data);
    }
};
