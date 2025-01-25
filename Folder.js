// Folder.js
const File = require('./File');

class Folder {
    constructor(name) {
        this.name = name;
        this.files = [];
        this.folders = [];
    }

    addFile(file) {
        const existingFile = this.files.find(f => f.name === file.name);
        if (existingFile) {
            console.log(`Tệp "${file.name}" đã tồn tại trong thư mục này.`);
            return false;
        }
        this.files.push(file);
        return true;
    }

    addFolder(folder) {
        const existingFolder = this.folders.find(f => f.name === folder.name);
        if (existingFolder) {
            console.log(`Thư mục "${folder.name}" đã tồn tại trong thư mục này.`);
            return false;
        }
        this.folders.push(folder);
        return true;
    }

    removeFile(fileName) {
        const fileIndex = this.files.findIndex(file => file.name === fileName);
        if (fileIndex > -1) {
            this.files.splice(fileIndex, 1);
            console.log(`Tệp "${fileName}" đã bị xóa.`);
        } else {
            console.log(`Tệp "${fileName}" không tồn tại trong thư mục này.`);
        }
    }

    removeFolder(folderName) {
        const folderIndex = this.folders.findIndex(folder => folder.name === folderName);
        if (folderIndex > -1) {
            this.folders.splice(folderIndex, 1);
            console.log(`Thư mục "${folderName}" đã bị xóa.`);
        } else {
            console.log(`Thư mục "${folderName}" không tồn tại trong thư mục này.`);
        }
    }

    displayTree(indent = "") {
        console.log(`${indent}- ${this.name}`);
        this.files.forEach(file => console.log(`${indent}  * ${file.name} (Loại: ${file.type})`));
        this.folders.forEach(folder => folder.displayTree(indent + "  "));
    }

    searchFile(name, path = '') {
        let foundFiles = [];
        
        // Kiểm tra trong thư mục hiện tại
        if (this.files.some(file => file.name === name)) {
            foundFiles.push(path + '/' + this.name + '/' + name);
        }

        // Kiểm tra trong các thư mục con
        this.folders.forEach(folder => {
            foundFiles = foundFiles.concat(folder.searchFile(name, path + '/' + this.name));
        });

        return foundFiles;
    }

    searchFolder(name, path = '') {
        let foundFolders = [];
        
        // Kiểm tra thư mục hiện tại
        if (this.name === name) {
            foundFolders.push(path + '/' + this.name);
        }

        // Kiểm tra trong các thư mục con
        this.folders.forEach(folder => {
            foundFolders = foundFolders.concat(folder.searchFolder(name, path + '/' + this.name));
        });

        return foundFolders;
    }

    getAllFolders() {
        let folders = [this];
        this.folders.forEach(folder => {
            folders = folders.concat(folder.getAllFolders());
        });
        return folders;
    }
}

module.exports = Folder;
