const fs = require('fs');
const path = require('path');

const ARTICLE_DIR = path.resolve(__dirname, '../article');

// Function to remove views and comments section from article HTML
function removeViewsAndComments(htmlContent) {
  // Remove the views and comments counts display (icon + number)
  htmlContent = htmlContent.replace(
    /<div class="d-flex align-items-center">\s*<span class="ml-3"><i class="far fa-eye mr-2"><\/i>[^<]*<\/span>\s*<span class="ml-3"><i class="far fa-comment mr-2"><\/i>[^<]*<\/span>\s*<\/div>/g,
    ''
  );

  // Remove the entire Comment List section
  htmlContent = htmlContent.replace(
    /<!-- Comment List Start -->[\s\S]*?<!-- Comment List End -->/g,
    ''
  );

  return htmlContent;
}

(async function() {
  try {
    console.log('🧹 Cleaning views and comments from article files...');
    
    const files = fs.readdirSync(ARTICLE_DIR).filter(f => f.endsWith('.html'));
    console.log(`📁 Found ${files.length} HTML files`);

    let cleaned = 0;
    let skipped = 0;

    for (const file of files) {
      const filePath = path.join(ARTICLE_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if file contains views/comments
      if (content.includes('fa-eye') || content.includes('Comment List Start')) {
        const cleanedContent = removeViewsAndComments(content);
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        console.log(`✅ Cleaned: ${file}`);
        cleaned++;
      } else {
        skipped++;
      }
    }

    console.log(`\n📋 Summary:`);
    console.log(`   ✨ Cleaned: ${cleaned}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`✅ Done!`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
