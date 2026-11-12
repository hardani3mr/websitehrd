<?php
/**
 * Website signups → Kit (kit.com).
 *
 * The secret Kit key is NOT in this file. It is read from kit-config.php,
 * which sits one folder ABOVE public_html (so nobody can open it from the web).
 */

header('Content-Type: application/json; charset=utf-8');

function respond($data, $status = 200) {
  http_response_code($status);
  echo json_encode($data);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'Method not allowed'], 405);

$configFile = dirname(__DIR__) . '/kit-config.php';
$key = is_file($configFile) ? trim((string) include $configFile) : '';
if ($key === '') respond(['error' => 'Missing Kit key'], 500);

$FORM_ID = 10178666; // Kit form "Newsletter site"
$TAGS = [
  'guide'   => 25746489, // Guide: Digital Transformation
  'blog'    => 25746490, // Blog updates
  'ar'      => 25746491, // Lang: Arabic
  'en'      => 25746492, // Lang: English
  'website' => 25746493, // Source: Website
];

// Spam trap: real people never fill this hidden field.
if (!empty($_POST['company'])) respond(['ok' => true]);

$email = strtolower(trim((string) ($_POST['email'] ?? '')));
$name  = mb_substr(trim((string) ($_POST['name'] ?? '')), 0, 100);
$list  = (($_POST['form-name'] ?? '') === 'blog') ? 'blog' : 'guide';
$lang  = (($_POST['lang'] ?? '') === 'en') ? 'en' : 'ar';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['error' => 'Invalid email'], 400);

function kit($path, $body, $key) {
  $ch = curl_init('https://api.kit.com/v4' . $path);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Kit-Api-Key: ' . $key],
    CURLOPT_POSTFIELDS => json_encode($body),
  ]);
  curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return $status;
}

$subscriber = ['email_address' => $email];
if ($name !== '') $subscriber['first_name'] = $name;
$status = kit('/subscribers', $subscriber, $key);
if ($status < 200 || $status >= 300) respond(['error' => 'Subscribe failed'], 502);

kit('/forms/' . $FORM_ID . '/subscribers', ['email_address' => $email, 'referrer' => $_SERVER['HTTP_REFERER'] ?? ''], $key);
foreach ([$TAGS[$list], $TAGS[$lang], $TAGS['website']] as $tagId) {
  kit('/tags/' . $tagId . '/subscribers', ['email_address' => $email], $key);
}

respond(['ok' => true]);
