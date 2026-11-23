<?php
// OAuth Protected Resource Metadata - RFC 9728 compliant configuration.
// Describes protected API resource boundaries and authorization rules.

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

$metadata = [
    "resource_identifier" => "https://new-build-egypt.com/api",
    "authorization_servers" => [
        "https://new-build-egypt.com"
    ],
    "scopes_supported" => [
        "openid",
        "profile",
        "email",
        "api:write"
    ]
];

echo json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
