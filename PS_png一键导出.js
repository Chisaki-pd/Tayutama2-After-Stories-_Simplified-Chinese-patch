// =====================================================
// 批量PSD转PNG脚本
// 功能：遍历当前文件夹的所有PSD文件，自动导出为PNG
// 用法：在Photoshop中运行此脚本
// =====================================================

#target photoshop
#targetengine "main"

// 获取源文件夹
function getSourceFolder() {
    // 如果当前有打开的文档，使用其所在文件夹
    if (app.documents.length > 0) {
        var activeDocPath = app.activeDocument.path;
        if (activeDocPath && activeDocPath != "") {
            return Folder(activeDocPath);
        }
    }
    // 否则弹出选择对话框
    return Folder.selectDialog("请选择包含PSD文件的文件夹");
}

// PNG保存选项（默认参数）
var pngOptions = new PNGSaveOptions();
pngOptions.compression = 6;      // 压缩级别 6（适中）
pngOptions.interlaced = false;   // 不交错

function main() {
    var srcFolder = getSourceFolder();
    if (!srcFolder) {
        alert("未选择文件夹，脚本退出。");
        return;
    }

    // 获取所有PSD文件
    var psdFiles = srcFolder.getFiles(/\.(psd|PSD)$/);
    if (psdFiles.length === 0) {
        alert("文件夹中没有找到PSD文件。\n路径：" + srcFolder.fsName);
        return;
    }

    var count = 0;
    for (var i = 0; i < psdFiles.length; i++) {
        var psdFile = psdFiles[i];
        var doc = null;
        try {
            doc = app.open(psdFile);              // 打开PSD
            var pngFile = new File(psdFile.path + "/" + psdFile.name.replace(/\.(psd|PSD)$/i, "") + ".png");
            doc.saveAs(pngFile, pngOptions, true); // 保存为PNG
            doc.close(SaveOptions.DONOTSAVECHANGES);
            count++;
            $.writeln("已导出: " + pngFile.name);
        } catch (e) {
            if (doc) doc.close(SaveOptions.DONOTSAVECHANGES);
            $.writeln("处理失败: " + psdFile.name + " - " + e.toString());
        }
    }

    alert("批量导出完成！\n成功导出 " + count + " 个PNG文件。\n保存位置与PSD相同。");
}

// 运行主程序
main();