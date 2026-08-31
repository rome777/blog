#!/usr/bin/env node
/**
 * 새 글 파일을 만들어 줍니다.
 *
 *   npm run new "넘파이 브로드캐스팅 정리"
 *   npm run new "제목" -- --slug numpy-broadcasting --category 데이터분석
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'blog');

// `--키 값` 은 옵션으로, 나머지는 제목으로 모읍니다.
const flags = {};
const words = [];
const argv = process.argv.slice(2);

for (let i = 0; i < argv.length; i += 1) {
  if (argv[i].startsWith('--')) flags[argv[i].slice(2)] = argv[(i += 1)];
  else words.push(argv[i]);
}

const title = words.join(' ').trim();

if (!title) {
  console.error('사용법: npm run new "글 제목" [-- --slug 영문슬러그 --category 카테고리]');
  process.exit(1);
}

const readFlag = (name) => flags[name];

/** 한글은 그대로 두고 공백/특수문자만 정리합니다. */
function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}

const slug = readFlag('slug') ?? slugify(title);
const category = readFlag('category') ?? '기타';

const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');

const file = join(POSTS_DIR, `${slug}.md`);

try {
  await access(file);
  console.error(`이미 있는 파일입니다: ${file}`);
  process.exit(1);
} catch {
  // 없으면 정상 — 계속 진행합니다.
}

const template = `---
title: ${title}
description:
pubDate: ${today}
category: ${category}
tags: []
draft: true
---

여기에 내용을 씁니다.

## 배운 것

## 막힌 부분

## 다음에 볼 것
`;

await mkdir(POSTS_DIR, { recursive: true });
await writeFile(file, template, 'utf8');

console.log(`새 글을 만들었습니다: src/content/blog/${slug}.md`);
console.log(`주소: /posts/${slug}`);
console.log('\n다 쓰면 frontmatter 의 draft: true 를 지우고 커밋하세요.');
