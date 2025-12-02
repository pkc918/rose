---
title: 关于遇到的latex渲染与转化的问题
date: 2025-12-02
---

## Q?
今天遇到一个BUG：将latex文本内容使用mathjax渲染在一个编辑器中，在编辑器中编辑内容后，需要将新的内容存储，但此时的内容中 latex不再是单纯的文本语法，而是渲染成了很多很多dom元素，直接存储是不合适的。

## A!
首先，MathJax 的HTML是不可逆的，所以需要在render前，自己做到存储的操作。其次，在保存编辑后的内容时，需要将 MathJax 的HTML转回为latex语法

- 在渲染之前做一个字符串替换操作，将识别到的公式信息，替换成一个 span 标签，在标签中给一个 data-latex 的属性，将latex文本信息放入其中，这样可以让latex render在我们自定义的标签中渲染
- 实现一个恢复操作的函数，读取我们自定义的标签，将data-latex属性值全量替换对应的span标签即可

```bash
input: 你好\(\frac{1}{2}\) 
render: 你好<span class="latex-node" data-latex="\(\frac{1}{2}\)">一些mathjax渲染的html</span>
modify: 你好<span class="latex-node" data-latex="\(\frac{1}{2}\)">一些mathjax渲染的html</span> 哈哈哈
result：你好\(\frac{1}{2}\) 哈哈哈
```

部分代码
```typescript
// 预处理 HTML，将 LaTeX 公式包装为 span 标签
// 支持格式：
// - inlineMath: \(...\) 和 $...$
// - displayMath: $$...$$ 和 \[...\]
function preprocessHtml(html: string | undefined): string | undefined {
  if (!html)
    return html

  let result = html

  // 先处理 display math（需要先处理，避免与 inline math 冲突）
  // 匹配 $$...$$ 格式（display math）
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, content) => {
    const latex = `$$${content}$$`
    return `<span class="latex-node" data-latex="${latex}">${latex}</span> `
  })

  // 匹配 \[...\] 格式（display math）
  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (match, content) => {
    const latex = `\\[${content}\\]`
    return `<span class="latex-node" data-latex="${latex}">${latex}</span> `
  })

  // 再处理 inline math
  // 匹配 \(...\) 格式（inline math）
  result = result.replace(/\\\(([\s\S]+?)\\\)/g, (match, content) => {
    const latex = `\\(${content}\\)`
    return `<span class="latex-node" data-latex="${latex}">${latex}</span> `
  })

  // 匹配 $...$ 格式（inline math）
  // 注意：由于已经先处理了 $$...$$，所以这里匹配的 $ 应该是 inline math
  // 使用更兼容的方式：通过检查前后文来避免匹配到 HTML 标签内的内容
  result = result.replace(/\$([^$<>\n]+)\$/g, (match, content, offset, string) => {
    // 检查匹配位置前后是否有 <span> 标签，如果有则跳过（可能是已经处理过的）
    const beforeMatch = string.substring(Math.max(0, offset - 50), offset)
    const afterMatch = string.substring(offset + match.length, Math.min(string.length, offset + match.length + 50))

    // 如果前后有 <span class="latex-node"，说明可能是已经处理过的，跳过
    if (beforeMatch.includes('<span class="latex-node"') || afterMatch.includes('</span>')) {
      return match
    }

    // 检查内容中是否包含 HTML 标签，如果有则跳过
    if (content.includes('<') || content.includes('>')) {
      return match
    }

    const latex = `$${content}$`
    return `<span class="latex-node" data-latex="${latex}">${latex}</span> `
  })

  return result
}

function reversePreprocessHtml(html: string): string {
  // 使用 DOM 方式将 latex-node 元素替换为对应的 data-latex 值
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 查找所有 latex-node 元素
  const latexNodes = tempDiv.querySelectorAll('span.latex-node')
  latexNodes.forEach((node) => {
    const dataLatex = node.getAttribute('data-latex')
    if (dataLatex) {
      // 创建文本节点替换整个元素
      const textNode = document.createTextNode(dataLatex)
      node.parentNode?.replaceChild(textNode, node)
    }
  })

  return tempDiv.innerHTML
}
```