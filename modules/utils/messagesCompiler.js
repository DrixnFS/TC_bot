const fs = require('fs');
module.exports = (path, extension = "") => {
    var fileArr = fs.readdirSync(path).filter(function (file) {
        if (extension == "") {
            return fs.statSync(path + '/' + file).isFile();
        } else {
            return fs.statSync(path + '/' + file).isFile() && (path.extname(path + '/' + file) == "." + extension);
        }
    });
    var resultObj = {};
    for(let i = 0; i < fileArr.length; i++){
        let name = fileArr[i].split('.');
        name = name[0];
        resultObj[name] = require(`${path}/${fileArr[i]}`);
    }
    return resultObj;
};