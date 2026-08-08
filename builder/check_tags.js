const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, 'source', '_posts');

if (!fs.existsSync(postsDir)) {
  console.error(`❌ 目录 ${postsDir} 不存在，请确认路径。`);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(f => /\.(md|markdown)$/i.test(f));

if (files.length === 0) {
  console.log('⚠️ 没有找到任何 Markdown 文件。');
  process.exit(0);
}

console.log(`📂 共 ${files.length} 篇文章，开始检查...\n`);

let issueCount = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const parsed = matter(content);
    const tags = parsed.data.tags;

    if (tags !== undefined && !Array.isArray(tags)) {
      issueCount++;
      console.log(`❌ ${file}`);
      console.log(`   tags 类型: ${typeof tags}`);
      console.log(`   tags 内容: ${JSON.stringify(tags)}`);
      console.log(`   建议改为数组格式，例如：\n   tags:\n     - 标签1\n     - 标签2\n`);
    }
  } catch (err) {
    console.error(`❌ 解析 ${file} 时出错:`, err.message);
  }
});

if (issueCount === 0) {
  console.log('🎉 所有文章的 tags 都是数组格式，没有问题！');
} else {
  console.log(`📝 共发现 ${issueCount} 篇文章的 tags 格式异常，请根据上面的提示修复。`);
}
