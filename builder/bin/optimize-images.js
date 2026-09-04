'use strict';

// 图片压缩脚本：源图 → WebP（限宽 1920px，质量 80）
// 用法：node bin/optimize-images.js
// 规则：源图保留，WebP 承接 URL 角色；文件名全部小写 kebab-case

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, '..', 'source', 'img');
const MAX_WIDTH = 1920;
const QUALITY = 80;

const JOBS = [
  ['DSC0047.jpg', 'cover-elsecode.webp'],
  ['DSC0039.jpg', 'cover-cplang.webp'],
  ['DSC0029.jpg', 'cover-dev-env.webp'],
  ['DSC0043.jpg', 'cover-blog-maintenance.webp'],
  ['background.jpg', 'site-background.webp'],
  ['Cover-About.jpg', 'cover-about.webp'],
  ['WhiteDove912-from-wikipedia.jpeg', 'cover-404.webp'],
  ['Cover-CPTT.jpg', 'cover-cptt.webp'],
  ['Cover-CUDA.jpeg', 'cover-cuda.webp'],
  ['Cover-I2CI.jpg', 'cover-i2ci.webp'],
  ['Cover-SPnQT.jpg', 'cover-spnqt.webp'],
  ['Cover-Shell-Image.png', 'cover-shell-image.webp'],
];

(async () => {
  let totalIn = 0;
  let totalOut = 0;
  for (const [src, out] of JOBS) {
    const srcPath = path.join(IMG_DIR, src);
    const outPath = path.join(IMG_DIR, out);
    if (!fs.existsSync(srcPath)) {
      console.error('SKIP (missing):', src);
      continue;
    }
    const inSize = fs.statSync(srcPath).size;
    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    const outSize = fs.statSync(outPath).size;
    totalIn += inSize;
    totalOut += outSize;
    console.log(
      `${src} -> ${out}  ${(inSize / 1024).toFixed(0)}KB -> ${(outSize / 1024).toFixed(0)}KB  (${Math.round((1 - outSize / inSize) * 100)}%)`
    );
  }
  console.log(
    `TOTAL: ${(totalIn / 1024).toFixed(0)}KB -> ${(totalOut / 1024).toFixed(0)}KB  (${Math.round((1 - totalOut / totalIn) * 100)}%)`
  );
})();