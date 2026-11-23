<?php
// Model Context Protocol (MCP) Server Card - SEP-1649 emerging standards.
// Exposes website capability metadata and client-side or server-side tools for AI agents.

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

$card = [
    "serverInfo" => [
        "name" => "NBIG-Developments-MCP-Server",
        "description" => "Exposes real estate portfolio lookup, contact submission, and booking tools.",
        "version" => "1.0.0"
    ],
    "version" => "0.1.0",
    "transport" => [
        "type" => "sse",
        "endpoint" => "https://new-build-egypt.com/api/mcp/sse"
    ],
    "capabilities" => [
        "tools" => [
            "listChanged" => false
        ],
        "resources" => [
            "subscribe" => false
        ]
    ],
    "tools" => [
        [
            "name" => "search",
            "description" => "Search projects, services, or locations by keyword on the NBIG developments site.",
            "inputSchema" => [
                "type" => "object",
                "properties" => [
                    "query" => [
                        "type" => "string",
                        "description" => "Search query term (e.g. 'CMC', 'medical', 'October', 'Zayed')."
                    ]
                ],
                "required" => ["query"]
            ]
        ],
        [
            "name" => "project_lookup",
            "description" => "Retrieve complete details, brochure paths, and statistics of specific NBIG real estate developments.",
            "inputSchema" => [
                "type" => "object",
                "properties" => [
                    "projectId" => [
                        "type" => "string",
                        "enum" => ["sky-hills", "zayed-hills", "lamar-residence", "cmc", "cmc-2", "cmc-3", "prime"],
                        "description" => "The unique project identifier slug."
                    ]
                ],
                "required" => ["projectId"]
            ]
        ],
        [
            "name" => "contact_form",
            "description" => "Submit inquiries or send messages to the NBIG Developments management team.",
            "inputSchema" => [
                "type" => "object",
                "properties" => [
                    "name" => [
                        "type" => "string",
                        "description" => "Sender full name."
                    ],
                    "email" => [
                        "type" => "string",
                        "format" => "email",
                        "description" => "Sender email address."
                    ],
                    "phone" => [
                        "type" => "string",
                        "description" => "Sender phone number (with country code)."
                    ],
                    "message" => [
                        "type" => "string",
                        "description" => "Detail of inquiry."
                    ]
                ],
                "required" => ["name", "email", "phone"]
            ]
        ]
    ]
];

echo json_encode($card, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
