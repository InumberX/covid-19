<?php

// ===============================================
// 初期設定
// ===============================================
mb_language('ja');
mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");

// Content-TypeをJSONに設定
header('Content-Type: application/json');

$result = new stdClass;

// データ取得先
$url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures';

// セッションを初期化
$ch = curl_init();

// リクエスト先urlをセット
curl_setopt($ch, CURLOPT_URL, $url);

// リクエストを実行
$result->data = curl_exec($ch);

// データの取得に失敗した場合
if (curl_exec($ch) === false) {
 $result->status = 'failed';
}
// 成功した場合
else {
 $result->status = 'success';
}

// セッションを閉じる
curl_close($ch);

echo json_encode(compact('result'));
