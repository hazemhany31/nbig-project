<?php
// OpenID Connect Discovery 1.0 and RFC 8414 compliant authorization metadata configuration.
// Extensible placeholder config for future auth integrations.

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

$config = [
    "issuer" => "https://new-build-egypt.com",
    "authorization_endpoint" => "https://new-build-egypt.com/oauth/authorize",
    "token_endpoint" => "https://new-build-egypt.com/oauth/token",
    "jwks_uri" => "https://new-build-egypt.com/oauth/jwks",
    "userinfo_endpoint" => "https://new-build-egypt.com/oauth/userinfo",
    "scopes_supported" => ["openid", "profile", "email", "offline_access", "api:write"],
    "response_types_supported" => ["code", "token", "id_token"],
    "grant_types_supported" => ["authorization_code", "client_credentials", "refresh_token"],
    "token_endpoint_auth_methods_supported" => ["client_secret_post", "client_secret_basic"],
    "claims_supported" => ["iss", "sub", "aud", "exp", "iat", "name", "email"],
    "id_token_signing_alg_values_supported" => ["RS256"]
];

echo json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
