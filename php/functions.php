<?php
// ファイルの更新日時を取得する処理
function getFileUpdateDate($path)
{
 $updateDate = '';
 $file = dirname(__FILE__) . '/..' . $path;
 // ファイルが存在する場合
 if (file_exists($file)) {
  //タイムスタンプ取得
  $updateDate = filemtime($file);

  //書式整形
  $updateDate = date('YmdHis', $updateDate);
 }
 return $updateDate;
}

// エスケープを行う処理
function h($str)
{
 return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
