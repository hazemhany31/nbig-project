<?php
// Dynamic self-updating sitemap generator for NBIG Developments
// Maps physical HTML files to clean URLs and uses filemtime for automatic lastmod dates.

header("Content-Type: application/xml; charset=utf-8");

$domain = "https://new-build-egypt.com";

// Mapping from files to clean URL paths
$pages = [
    'index.html' => '/',
    'sky-hills.html' => '/sky-hills',
    'zayed-hills.html' => '/zayed-hills',
    'lamar-residence.html' => '/lamar-residence',
    'cmc.html' => '/cmc',
    'cmc-2.html' => '/cmc-2',
    'new-cmc.html' => '/new-cmc',
    'prime.html' => '/prime',
    'privacy-policy.html' => '/privacy-policy',
    'account-deletion.html' => '/account-deletion',
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

foreach ($pages as $filename => $cleanPath) {
    $filePath = __DIR__ . '/' . $filename;
    
    if (file_exists($filePath)) {
        // Automatically get the last modified time from filesystem
        $lastmod = date('c', filemtime($filePath));
        $priority = ($filename === 'index.html') ? '1.0' : '0.8';
        $changefreq = ($filename === 'index.html') ? 'daily' : 'weekly';
        
        echo '  <url>' . PHP_EOL;
        echo '    <loc>' . $domain . $cleanPath . '</loc>' . PHP_EOL;
        echo '    <lastmod>' . $lastmod . '</lastmod>' . PHP_EOL;
        echo '    <changefreq>' . $changefreq . '</changefreq>' . PHP_EOL;
        echo '    <priority>' . $priority . '</priority>' . PHP_EOL;
        echo '  </url>' . PHP_EOL;
    }
}

echo '</urlset>' . PHP_EOL;
