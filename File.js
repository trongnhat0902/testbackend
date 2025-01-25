// File.js
class File {
    constructor(name, content, type) {
        this.name = name;
        this.content = content;
        this.type = type; // Loại tệp
    }

    // Phương thức lấy nội dung tệp
    getContent() {
        return this.content;
    }

    // Phương thức cập nhật nội dung tệp
    setContent(newContent) {
        this.content = newContent;
    }
}

module.exports = File;
