<?php
// ============================================================================
// NBIG Developments - Content Negotiation Markdown Handler (RFC Compliant)
// Serves semantic markdown to AI agents requesting Accept: text/markdown.
// Includes a server-side bilingual translation engine.
// ============================================================================

error_reporting(0);
ini_set('display_errors', 0);

// Set strict UTF-8 charset
mb_internal_encoding("UTF-8");

$allowed_files = [
    'index.html',
    'sky-hills.html',
    'zayed-hills.html',
    'lamar-residence.html',
    'cmc.html',
    'cmc-2.html',
    'new-cmc.html',
    'prime.html',
    'privacy-policy.html',
    'account-deletion.html'
];

$file = isset($_GET['file']) ? basename($_GET['file']) : 'index.html';

// 1. Security check: prevent Local File Inclusion (LFI)
if (!in_array($file, $allowed_files)) {
    header("HTTP/1.1 404 Not Found");
    header("Content-Type: text/plain; charset=utf-8");
    echo "Error 404: The requested page was not found.";
    exit;
}

$file_path = __DIR__ . '/' . $file;
if (!file_exists($file_path)) {
    header("HTTP/1.1 404 Not Found");
    header("Content-Type: text/plain; charset=utf-8");
    echo "Error 404: File not found.";
    exit;
}

$html = file_get_contents($file_path);

// 2. Bilingual Translation Extractor
$translations = ['en' => [], 'ar' => []];
if (preg_match('/const T\s*=\s*(\{.*?\});/s', $html, $matches)) {
    $js_content = $matches[1];
    
    // Resilient parse function for JS translation dictionary
    function parseTranslationBlock($block) {
        $trans = [];
        // Match key: 'value' or key: "value" with escapes
        preg_match_all('/([a-zA-Z0-9\-]+)\s*:\s*([\'"])(.*?)\2/s', $block, $pairs);
        foreach ($pairs[1] as $idx => $key) {
            $trans[$key] = $pairs[3][$idx];
        }
        return $trans;
    }
    
    // Extract en and ar sub-blocks
    if (preg_match('/en\s*:\s*\{(.*?)\}\s*,\s*ar\s*:\s*\{(.*?)\}\s*\}/s', $js_content, $sub_matches)) {
        $translations['en'] = parseTranslationBlock($sub_matches[1]);
        $translations['ar'] = parseTranslationBlock($sub_matches[2]);
    }
}

// 3. Determine Language Preference
$lang = 'en';
if (isset($_GET['lang']) && in_array($_GET['lang'], ['en', 'ar'])) {
    $lang = $_GET['lang'];
} else {
    // Parse Accept-Language header
    $accept_lang = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '';
    if (strpos($accept_lang, 'ar') !== false) {
        $lang = 'ar';
    }
}

// 4. HTML to Markdown Parser Class
class HtmlToMarkdown {
    private $dom;
    private $baseUrl = "https://new-build-egypt.com";
    private $lang;
    private $translations;

    public function __construct($html, $lang, $translations) {
        $this->lang = $lang;
        $this->translations = $translations;
        
        $this->dom = new DOMDocument();
        libxml_use_internal_errors(true);
        // Ensure proper encoding for multibyte/Arabic strings
        $this->dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
        libxml_clear_errors();
        
        $this->applyTranslations();
    }

    private function applyTranslations() {
        if (empty($this->translations[$this->lang])) {
            return;
        }
        
        $xpath = new DOMXPath($this->dom);
        $nodes = $xpath->query('//*[@data-t]');
        
        foreach ($nodes as $node) {
            $key = $node->getAttribute('data-t');
            if (isset($this->translations[$this->lang][$key])) {
                $val = $this->translations[$this->lang][$key];
                // Convert <br> tags to newlines, and strip other inline tags
                $val = str_ireplace(['<br>', '<br/>', '<br />'], "\n", $val);
                $val = strip_tags($val);
                
                // Clear existing child nodes
                while ($node->hasChildNodes()) {
                    $node->removeChild($node->firstChild);
                }
                
                // Set the translated text value
                $node->nodeValue = htmlspecialchars($val, ENT_QUOTES, 'UTF-8');
            }
        }
    }

    public function convert() {
        $body = $this->dom->getElementsByTagName('body')->item(0);
        if (!$body) {
            return "Error: No body element found in HTML.";
        }

        // Clean out noisy tags
        $this->stripTags($body, ['script', 'style', 'form', 'noscript', 'iframe']);

        $markdown = "# NBIG Developments - Machine Readable Content\n";
        $markdown .= "Language: " . strtoupper($this->lang) . " | Format: Markdown\n";
        $markdown .= "Source: " . $this->baseUrl . ($this->lang === 'ar' ? '?lang=ar' : '') . "\n\n";
        $markdown .= "========================================================================\n\n";

        $markdown .= $this->parseNode($body);
        
        // Append structured multilingual metadata block at the bottom
        $markdown .= "\n\n========================================================================\n";
        $markdown .= "## Multilingual Localization Dictionary\n\n";
        $markdown .= "| Key | English Translation | Arabic Translation |\n";
        $markdown .= "| --- | --- | --- |\n";
        
        $all_keys = array_unique(array_merge(array_keys($this->translations['en']), array_keys($this->translations['ar'])));
        sort($all_keys);
        
        foreach ($all_keys as $key) {
            $en_val = isset($this->translations['en'][$key]) ? str_replace("\n", " ", strip_tags($this->translations['en'][$key])) : '';
            $ar_val = isset($this->translations['ar'][$key]) ? str_replace("\n", " ", strip_tags($this->translations['ar'][$key])) : '';
            $markdown .= "| `{$key}` | {$en_val} | {$ar_val} |\n";
        }
        
        return $markdown;
    }

    private function stripTags($node, $tagNames) {
        foreach ($tagNames as $tag) {
            $elements = $node->getElementsByTagName($tag);
            for ($i = $elements->length - 1; $i >= 0; $i--) {
                $el = $elements->item($i);
                $el->parentNode->removeChild($el);
            }
        }
    }

    private function parseNode($node) {
        $markdown = "";
        foreach ($node->childNodes as $child) {
            $markdown .= $this->parseChild($child);
        }
        return $markdown;
    }

    private function parseChild($node) {
        if ($node->nodeType === XML_TEXT_NODE) {
            $text = $node->nodeValue;
            // Clean spacing
            $text = preg_replace('/\s+/', ' ', $text);
            return $text;
        }

        if ($node->nodeType !== XML_ELEMENT_NODE) {
            return "";
        }

        $tagName = strtolower($node->nodeName);
        
        // Ignore loader overlay, mobile close buttons, reCAPTCHA tags, and WhatsApp floating widgets
        if ($node->getAttribute('id') === 'loader' || 
            $node->getAttribute('class') === 'ss' || 
            $node->getAttribute('class') === 'ss hidden' ||
            $node->getAttribute('id') === 'loader-overlay' ||
            $node->getAttribute('class') === 'mc' ||
            $node->getAttribute('class') === 'mt') {
            return "";
        }

        switch ($tagName) {
            case 'h1':
                return "\n\n# " . trim($this->parseNode($node)) . "\n\n";
            case 'h2':
                return "\n\n## " . trim($this->parseNode($node)) . "\n\n";
            case 'h3':
                return "\n\n### " . trim($this->parseNode($node)) . "\n\n";
            case 'h4':
                return "\n\n#### " . trim($this->parseNode($node)) . "\n\n";
            case 'h5':
                return "\n\n##### " . trim($this->parseNode($node)) . "\n\n";
            case 'h6':
                return "\n\n###### " . trim($this->parseNode($node)) . "\n\n";
            case 'p':
                return "\n\n" . trim($this->parseNode($node)) . "\n\n";
            case 'br':
                return "\n";
            case 'strong':
            case 'b':
                return "**" . $this->parseNode($node) . "**";
            case 'em':
            case 'i':
                return "*" . $this->parseNode($node) . "*";
            case 'ul':
                return "\n" . $this->parseNode($node) . "\n";
            case 'ol':
                return "\n" . $this->parseNode($node) . "\n";
            case 'li':
                $liText = trim($this->parseNode($node));
                return empty($liText) ? "" : "* " . $liText . "\n";
            case 'a':
                $href = $node->getAttribute('href');
                $text = trim($this->parseNode($node));
                if (empty($text)) $text = "Link";
                if ($href) {
                    if (strpos($href, 'http') !== 0 && strpos($href, 'mailto') !== 0 && strpos($href, 'tel') !== 0 && strpos($href, '#') !== 0) {
                        // Make absolute canonical URL
                        $href = $this->baseUrl . '/' . ltrim($href, './');
                    }
                    return " [{$text}]({$href}) ";
                }
                return $text;
            case 'img':
                $src = $node->getAttribute('src');
                $alt = $node->getAttribute('alt');
                if (empty($alt)) $alt = "Image";
                if ($src) {
                    if (strpos($src, 'http') !== 0) {
                        $src = $this->baseUrl . '/' . ltrim($src, './');
                    }
                    return "\n![{$alt}]({$src})\n";
                }
                return "";
            case 'section':
                return "\n\n---\n\n" . $this->parseNode($node) . "\n\n---\n\n";
            case 'div':
            case 'span':
            case 'header':
            case 'footer':
            case 'nav':
                return $this->parseNode($node);
            default:
                return $this->parseNode($node);
        }
    }
}

// 5. Convert and Generate Response
$converter = new HtmlToMarkdown($html, $lang, $translations);
$markdown_output = $converter->convert();

// Standardize redundant newlines and clean up output formatting
$markdown_output = preg_replace("/\n{3,}/", "\n\n", $markdown_output);

// 6. Token Count Calculation for x-markdown-tokens
// Average English token = 0.75 words, average Arabic token = 0.5 words.
// We estimate total tokens based on character/word breakdown.
$word_count = str_word_count(strip_tags($markdown_output));
$estimated_tokens = (int)($word_count * 1.4);

// 7. Output Headers and Markdown payload
header("HTTP/1.1 200 OK");
header("Content-Type: text/markdown; charset=utf-8");
header("x-markdown-tokens: " . $estimated_tokens);
header("Content-Signal: ai-train=no, search=yes, ai-input=yes");
header("Cache-Control: public, max-age=86400"); // Cache for 24h

echo $markdown_output;
