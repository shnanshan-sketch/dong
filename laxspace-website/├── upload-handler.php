<?php
// 素材上传处理脚本 (PHP版本)
header('Content-Type: application/json');

// 允许跨域请求（仅在开发环境使用）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '方法不允许']);
    exit;
}

// 检查文件是否上传
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => '没有文件上传']);
    exit;
}

$file = $_FILES['file'];
$uploadDir = 'uploads/';

// 创建上传目录（如果不存在）
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 验证文件类型
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => '不支持的文件类型']);
    exit;
}

// 验证文件大小（5MB限制）
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => '文件大小超过限制']);
    exit;
}

// 生成唯一文件名
$fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
$fileName = uniqid() . '.' . $fileExtension;
$filePath = $uploadDir . $fileName;

// 移动上传的文件
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // 返回成功响应
    echo json_encode([
        'success' => true,
        'file' => [
            'name' => $fileName,
            'url' => $filePath,
            'size' => $file['size'],
            'type' => $file['type']
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => '文件上传失败']);
}
?>