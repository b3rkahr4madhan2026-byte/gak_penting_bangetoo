// Wrapper CommonJS untuk menjalankan module MJS
import('./generate_assets.mjs').catch(err => {
    console.error("ERROR:" + err.message);
    process.exit(1);
});
