<?php
if(mail('your@email.com', 'Test', 'Test message', 'From: info@new-build-egypt.com')) {
    echo "Mail sent!";
} else {
    echo "Mail failed!";
}
?>