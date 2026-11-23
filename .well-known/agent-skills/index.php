<?php
// Agent Skills Discovery RFC v0.2.0 compliant endpoint.
// Exposes reusable scripts, prompts, and tool instructions for AI agents.

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

// Calculate actual sha256 of the markdown_handler.php file if available
$handler_path = dirname(__DIR__) . '/markdown_handler.php';
$handler_sha = file_exists($handler_path) 
    ? hash_file('sha256', $handler_path)
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

// Calculate actual sha256 of the main js script
$js_path = dirname(dirname(__DIR__)) . '/js/main.js';
$js_sha = file_exists($js_path)
    ? hash_file('sha256', $js_path)
    : "8f7b322a36bcf811904a43b18d2b71fa14b8aefbd9ee664b22c71fb2c2628de3";

$skills = [
    "\$schema" => "https://agent-skills.org/draft-02/schema.json",
    "skills" => [
        [
            "name" => "markdown-content-negotiation",
            "type" => "extractor",
            "url" => "https://new-build-egypt.com/markdown_handler.php",
            "description" => "Extracts beautiful multilingual semantic markdown representation of landing pages and clean urls.",
            "sha256" => $handler_sha
        ],
        [
            "name" => "webmcp-client-integration",
            "type" => "mcp-client-module",
            "url" => "https://new-build-egypt.com/js/main.js",
            "description" => "Client-side Model Context Protocol tools injection for browser-based AI agents.",
            "sha256" => $js_sha
        ]
    ]
];

echo json_encode($skills, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
