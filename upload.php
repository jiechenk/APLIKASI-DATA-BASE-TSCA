<?php
$targetDir = "assets/pdf/"; // ganti ke photos/ jika upload foto
$fileName = basename($_FILES["uploadFile"]["name"]);
$targetFile = $targetDir . $fileName;

if (move_uploaded_file($_FILES["uploadFile"]["tmp_name"], $targetFile)) {
    echo "Berhasil diupload: " . $targetFile;
} else {
    echo "Upload gagal.";
}
?>
