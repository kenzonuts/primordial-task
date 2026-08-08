import { describe, expect, it } from 'vitest';

import type { NoteDocumentJson } from '@features/notes/types';
import {
  docToMarkdown,
  excerptFromDoc,
  markdownToDoc,
  sanitizePlainText,
  wouldCreateDocCycle,
  wouldCreateFolderCycle,
  wordCountFromDoc,
} from '@features/notes/utils/content-utils';

describe('notes content utils', () => {
  it('sanitizes plain text for safe display', () => {
    expect(sanitizePlainText(`<script>"x"&'y'</script>`)).toBe(
      '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;',
    );
  });

  it('extracts excerpts and word counts from docs', () => {
    const doc: NoteDocumentJson = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world from Primordial' }],
        },
      ],
    };
    expect(excerptFromDoc(doc)).toContain('Hello world');
    expect(wordCountFromDoc(doc)).toBe(4);
  });

  it('round-trips simple markdown headings and paragraphs', () => {
    const markdown = '# Title\n\nBody line';
    const doc = markdownToDoc(markdown);
    const back = docToMarkdown(doc);
    expect(back).toContain('# Title');
    expect(back).toContain('Body line');
  });

  it('detects circular folder and doc moves', () => {
    const folders = [
      { id: 'a', parentId: null },
      { id: 'b', parentId: 'a' },
      { id: 'c', parentId: 'b' },
    ];
    expect(wouldCreateFolderCycle(folders, 'a', 'c')).toBe(true);
    expect(wouldCreateFolderCycle(folders, 'c', 'a')).toBe(false);
    expect(wouldCreateFolderCycle(folders, 'a', null)).toBe(false);

    const notes = [
      { id: 'n1', parentDocId: null },
      { id: 'n2', parentDocId: 'n1' },
    ];
    expect(wouldCreateDocCycle(notes, 'n1', 'n2')).toBe(true);
    expect(wouldCreateDocCycle(notes, 'n2', null)).toBe(false);
  });
});
