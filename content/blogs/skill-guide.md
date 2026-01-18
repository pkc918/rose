---
theme: z-blue
highlight: agate
title: How to write a SKILL.md
date: 2026-01-18
---

see[技能创作最佳实践](https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices)

## Skill 结构与内容规范

每个Skill都需要一个带有YAML前置数据的`SKILL.md`文件：

```markdown
---
name: your-skill-name
description: 简要描述此 Skill 的功能以及何时使用它
---

# 您的 Skill 名称

## 指令
[Claude 要遵循的清晰、分步指导]

## 示例
[使用此 Skill 的具体示例]
```
### Required fields

- name
    - 最大字符数64
    - 只能包含小写字母、数字和连字符
    - 不能包含XML标签
    - 不能包含保留字：【anthropic】、【claude】

- description
    - 必须非空
    - 最多1024个字符
    - 不能包含XML标签

## 核心原则

**默认假设**：Claude已经非常聪明

**好的例子**：简洁（大约50个令牌）：
````markdown
## 提取 PDF 文本

使用 pdfplumber 进行文本提取：

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**不好的例子**：过于冗长（大约150个令牌）：
```markdown
## 提取 PDF 文本

PDF（便携式文档格式）文件是一种常见的文件格式，包含
文本、图像和其他内容。要从 PDF 中提取文本，您需要
使用一个库。有许多库可用于 PDF 处理，但我们
建议使用 pdfplumber，因为它易于使用且能处理大多数情况。
首先，您需要使用 pip 安装它。然后您可以使用下面的代码...
```
简洁版本假设 Claude 知道什么是 PDF 以及库如何工作。

## 自由度

### 高自由度（基于文本的说明）：
- 多种方法都有效
- 决策取决与上下文
- 启发式方法知道方法

示例：
```markdown
## 代码审查流程

1. 分析代码结构和组织
2. 检查潜在的错误或边界情况
3. 建议改进可读性和可维护性
4. 验证是否遵守项目约定
```

### 中等自由度（伪代码或带参数的脚本）：
- 存在首选模式
- 某些变化是可以接受的
- 配置影响行为

示例：
````markdown
## 生成报告

使用此模板并根据需要自定义：

```python
def generate_report(data, format="markdown", include_charts=True):
    # 处理数据
    # 以指定格式生成输出
    # 可选地包含可视化
```
````

### 低自由度（特定脚本、很少或没有参数）：
- 操作脆弱且容易出错
- 一致性至关重要
- 必须遵守特定的序列

示例：
````markdown
## 数据库迁移

运行完全相同的脚本：

```bash
python scripts/migrate.py --verify --backup
```

不要修改命令或添加其他标志。
````

## 命名约定

官方建议对名称使用 **动名词形式**（动词+ing），因为这清楚描述了技能提供的活动或能力。

**好的命名示例（动名词形式）**：

- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**可接受的替代方案**：

- 名词短语：`pdf-processing`、`spreadsheet-analysis`
- 面向行动：`process-pdfs`、`analyze-spreadsheets`

**避免**：
- 模糊的名称：`helper`、`utils`、`tools`
- 过于通用：`documents`、`data`、`files`
- 保留字：`anthropic-helper`、`claude-tools`
- 技能集合中的不一致模式

一致的命名使以下操作更容易：
- 在文档和对话中引用技能
- 一目了然地理解技能的功能
- 组织和搜索多个技能
- 维护专业、统一的技能库

## Description的重要性
`description`字段启用技能发现，应包括技能的功能和使用时机。

> [!Warning]
> 始终用第三人称编写。描述被注入到系统提示中，不一致的视角可能会导致发现问题。

**具体并包含关键术语**。包括技能的功能和使用它的具体触发器/上下文。

每个技能恰好有一个描述字段。描述对于技能选择至关重要：Claude 使用它从可能的 100+ 个可用技能中选择正确的技能。您的描述必须提供足够的细节，以便 Claude 知道何时选择此技能，而 SKILL.md 的其余部分提供实现细节。****

