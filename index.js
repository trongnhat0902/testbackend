// index.js
const inquirer = require('inquirer');
const File = require('./File');
const Folder = require('./Folder');

// Hàm kiểm tra phần mở rộng tệp hợp lệ
function isValidFileType(fileName, allowedExtensions) {
    const extension = fileName.split('.').pop(); // Lấy phần mở rộng tệp
    return allowedExtensions.includes(extension);
}

const rootFolder = new Folder("Root");

async function mainMenu() {
    while (true) {
        try {
            const { action } = await inquirer.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Chọn hành động:",
                    choices: [
                        "Hiển thị cây thư mục",
                        "Thêm tệp",
                        "Thêm thư mục",
                        "Tìm kiếm",
                        "Xóa tệp",
                        "Xóa thư mục",
                        "Thoát",
                    ],
                },
            ]);

            if (action === "Hiển thị cây thư mục") {
                console.log("\nCấu trúc cây thư mục:");
                rootFolder.displayTree();
            } else if (action === "Thêm tệp") {
                const allFolders = rootFolder.getAllFolders();
                const folderChoices = allFolders.map((folder) => folder.name);

                const { selectedFolder } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "selectedFolder",
                        message: "Chọn thư mục để thêm tệp vào:",
                        choices: folderChoices,
                    },
                ]);

                const folderToAddFile = allFolders.find(
                    (folder) => folder.name === selectedFolder
                );

                const { fileName, content, fileType } = await inquirer.prompt([
                    { type: "input", name: "fileName", message: "Tên tệp:" },
                    { type: "input", name: "content", message: "Nội dung tệp:" },
                    {
                        type: "list",
                        name: "fileType",
                        message: "Chọn loại tệp:",
                        choices: ["Văn bản", "Tài liệu"],
                    },
                ]);

                // Xác định các phần mở rộng hợp lệ cho từng loại
                const fileExtensions = {
                    "Văn bản": ["txt", "log"],
                    "Tài liệu": ["docx", "pdf"],
                };

                const allowedExtensions = fileExtensions[fileType];

                // Kiểm tra phần mở rộng tệp
                if (allowedExtensions.length > 0) {
                    if (!isValidFileType(fileName, allowedExtensions)) {
                        console.log(
                            `Tên tệp không hợp lệ! ${fileType} chỉ hỗ trợ các định dạng: ${allowedExtensions.join(
                                ", "
                            )}`
                        );
                        continue;
                    }
                }

                const newFile = new File(fileName, content, fileType);
                const success = folderToAddFile.addFile(newFile);
                if (success) {
                    console.log(
                        `Tệp "${fileName}" (Loại: ${fileType}) đã được thêm vào thư mục "${selectedFolder}".`
                    );
                }
            } else if (action === "Thêm thư mục") {
                const allFolders = rootFolder.getAllFolders();
                const folderChoices = allFolders.map((folder) => folder.name);

                const { selectedFolder } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "selectedFolder",
                        message: "Chọn thư mục để thêm thư mục con vào:",
                        choices: folderChoices,
                    },
                ]);

                const folderToAddFolder = allFolders.find(
                    (folder) => folder.name === selectedFolder
                );

                const { folderName } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "folderName",
                        message: "Tên thư mục con:",
                    },
                ]);

                const newFolder = new Folder(folderName);
                const success = folderToAddFolder.addFolder(newFolder);
                if (success) {
                    console.log(
                        `Thư mục "${folderName}" đã được thêm vào thư mục "${selectedFolder}".`
                    );
                }
            } else if (action === "Tìm kiếm") {
                const { searchType, searchName } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "searchType",
                        message: "Loại tìm kiếm:",
                        choices: ["Tệp", "Thư mục"],
                    },
                    {
                        type: "input",
                        name: "searchName",
                        message: "Tên cần tìm:",
                    },
                ]);

                if (searchType === "Tệp") {
                    const foundFiles = rootFolder.searchFile(searchName);
                    if (foundFiles.length > 0) {
                        console.log(`Tệp tìm thấy:`);
                        foundFiles.forEach(filePath =>
                            console.log(`- ${filePath}`)
                        );
                    } else {
                        console.log("Không tìm thấy tệp.");
                    }
                } else {
                    const foundFolders = rootFolder.searchFolder(searchName);
                    if (foundFolders.length > 0) {
                        console.log(`Thư mục tìm thấy:`);
                        foundFolders.forEach(folderPath =>
                            console.log(`- ${folderPath}`)
                        );
                    } else {
                        console.log("Không tìm thấy thư mục.");
                    }
                }
            } else if (action === "Xóa tệp") {
                const allFolders = rootFolder.getAllFolders();
                const folderChoices = allFolders.map((folder) => folder.name);

                const { selectedFolder } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "selectedFolder",
                        message: "Chọn thư mục để xóa tệp:",
                        choices: folderChoices,
                    },
                ]);

                const folderToDeleteFrom = allFolders.find(
                    (folder) => folder.name === selectedFolder
                );

                const { fileNameToDelete } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "fileNameToDelete",
                        message: "Nhập tên tệp cần xóa:",
                    },
                ]);

                folderToDeleteFrom.removeFile(fileNameToDelete);
            } else if (action === "Xóa thư mục") {
                const allFolders = rootFolder.getAllFolders();
                const folderChoices = allFolders.map((folder) => folder.name);

                const { selectedFolder } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "selectedFolder",
                        message: "Chọn thư mục để xóa:",
                        choices: folderChoices,
                    },
                ]);

                const folderToDelete = allFolders.find(
                    (folder) => folder.name === selectedFolder
                );

                folderToDelete.removeFolder(selectedFolder);
            } else if (action === "Thoát") {
                break;
            }
        } catch (error) {
            console.log("Đã có lỗi xảy ra:", error);
        }
    }
}

mainMenu();
