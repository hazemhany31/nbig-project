<?php
// API Catalog endpoint - RFC 9727 and RFC 9264 compliant
// Describes primary service access endpoints, documentation, OpenAPI, and status channels.

header("Content-Type: application/linkset+json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

$catalog = [
    "linkset" => [
        [
            "anchor" => "https://new-build-egypt.com/api",
            "service-desc" => [
                [
                    "href" => "https://new-build-egypt.com/openapi.json",
                    "type" => "application/openapi+json"
                ]
            ],
            "service-doc" => [
                [
                    "href" => "https://new-build-egypt.com/#contact",
                    "type" => "text/html"
                ]
            ],
            "status" => [
                [
                    "href" => "https://new-build-egypt.com/.well-known/mcp/server-card.json",
                    "type" => "application/json"
                ]
            ]
        ]
    ]
];

echo json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
