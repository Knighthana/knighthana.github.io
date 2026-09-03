'use strict';

// pandoc --mathjax 会把所有数学分隔符归一为 \( \) 与 \[ \]
// 在 pandoc 渲染完成后检测这些分隔符,只为真正含公式的文章启用 MathJax
// priority 4 早于 hexo-filter-mathjax 的 5;显式 mathjax: false 会被尊重
hexo.extend.filter.register('after_post_render', data => {
  if (data.mathjax == null && /\\\(|\\\[/.test(data.content)) {
    data.mathjax = true;
  }
  return data;
}, 4);
