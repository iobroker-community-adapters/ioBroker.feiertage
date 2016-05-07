function main() {
    readSettings();
    readFeed(0); // Tipps
    setTimeout(function() {
        readFeed(1)
    }, 3000); // jetzt
    adapter.stop();
}
main();
