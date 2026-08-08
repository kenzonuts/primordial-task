import { EMPTY_DOC } from '@features/notes/constants';
import type { NoteDocumentJson } from '@features/notes/types';

/** Sanitize plain text for safe display — never render unsanitized HTML. */
export const sanitizePlainText = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};

export const excerptFromDoc = (doc: NoteDocumentJson, max = 160): string => {
  const parts: string[] = [];
  const walk = (nodes: readonly Record<string, unknown>[] | undefined): void => {
    if (!nodes) {
      return;
    }
    for (const node of nodes) {
      if (typeof node.text === 'string') {
        parts.push(node.text);
      }
      if (Array.isArray(node.content)) {
        walk(node.content as readonly Record<string, unknown>[]);
      }
    }
  };
  walk(doc.content);
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export const wordCountFromDoc = (doc: NoteDocumentJson): number => {
  const excerpt = excerptFromDoc(doc, Number.MAX_SAFE_INTEGER);
  if (!excerpt) {
    return 0;
  }
  return excerpt.split(/\s+/).filter(Boolean).length;
};

export const docToMarkdown = (doc: NoteDocumentJson): string => {
  const lines: string[] = [];

  const renderInline = (nodes: readonly Record<string, unknown>[] | undefined): string => {
    if (!nodes) {
      return '';
    }
    return nodes
      .map((node) => {
        if (node.type === 'hardBreak') {
          return '\n';
        }
        let text = typeof node.text === 'string' ? node.text : '';
        const marks = Array.isArray(node.marks)
          ? (node.marks as readonly { type: string; attrs?: Record<string, unknown> }[])
          : [];
        for (const mark of marks) {
          if (mark.type === 'bold') {
            text = `**${text}**`;
          }
          if (mark.type === 'italic') {
            text = `*${text}*`;
          }
          if (mark.type === 'code') {
            text = `\`${text}\``;
          }
          if (mark.type === 'strike') {
            text = `~~${text}~~`;
          }
          if (mark.type === 'link' && mark.attrs?.href) {
            text = `[${text}](${String(mark.attrs.href)})`;
          }
        }
        if (Array.isArray(node.content)) {
          return renderInline(node.content as readonly Record<string, unknown>[]);
        }
        return text;
      })
      .join('');
  };

  const walk = (nodes: readonly Record<string, unknown>[] | undefined, depth = 0): void => {
    if (!nodes) {
      return;
    }
    for (const node of nodes) {
      const type = String(node.type ?? '');
      const content = node.content as readonly Record<string, unknown>[] | undefined;
      if (type === 'paragraph') {
        lines.push(renderInline(content));
        lines.push('');
      } else if (type === 'heading') {
        const level = Number((node.attrs as { level?: number } | undefined)?.level ?? 1);
        lines.push(`${'#'.repeat(Math.min(3, Math.max(1, level)))} ${renderInline(content)}`);
        lines.push('');
      } else if (type === 'bulletList') {
        walk(content, depth);
      } else if (type === 'orderedList') {
        walk(content, depth);
      } else if (type === 'listItem') {
        lines.push(`${'  '.repeat(depth)}- ${renderInline(content)}`);
      } else if (type === 'taskList') {
        walk(content, depth);
      } else if (type === 'taskItem') {
        const checked = Boolean((node.attrs as { checked?: boolean } | undefined)?.checked);
        lines.push(`${'  '.repeat(depth)}- [${checked ? 'x' : ' '}] ${renderInline(content)}`);
      } else if (type === 'blockquote') {
        const body = renderInline(content);
        lines.push(
          ...body
            .split('\n')
            .map((line) => `> ${line}`)
            .concat(['']),
        );
      } else if (type === 'codeBlock') {
        const lang = String((node.attrs as { language?: string } | undefined)?.language ?? '');
        lines.push(`\`\`\`${lang}`);
        lines.push(renderInline(content));
        lines.push('```');
        lines.push('');
      } else if (type === 'horizontalRule') {
        lines.push('---');
        lines.push('');
      } else if (content) {
        walk(content, depth);
      }
    }
  };

  walk(doc.content);
  return lines.join('\n').trim();
};

/** Minimal markdown → TipTap JSON (paragraph-oriented foundation for import). */
export const markdownToDoc = (markdown: string): NoteDocumentJson => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const content: Record<string, unknown>[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    if (line.startsWith('### ')) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: line.slice(4) }],
      });
    } else if (line.startsWith('## ')) {
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: line.slice(3) }],
      });
    } else if (line.startsWith('# ')) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: line.slice(2) }],
      });
    } else if (line.startsWith('> ')) {
      content.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: line.slice(2) }],
          },
        ],
      });
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }
      content.push({
        type: 'codeBlock',
        attrs: { language: lang || null },
        content: codeLines.length ? [{ type: 'text', text: codeLines.join('\n') }] : [],
      });
    } else if (line === '---') {
      content.push({ type: 'horizontalRule' });
    } else if (line.trim() === '') {
      // skip
    } else if (/^[-*] /.test(line)) {
      content.push({
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: line.replace(/^[-*] /, '') }],
              },
            ],
          },
        ],
      });
    } else {
      content.push({
        type: 'paragraph',
        content: line ? [{ type: 'text', text: line }] : [],
      });
    }
    index += 1;
  }

  return content.length > 0 ? { type: 'doc', content } : { ...EMPTY_DOC };
};

export const wouldCreateFolderCycle = (
  folders: readonly { id: string; parentId: string | null }[],
  folderId: string,
  nextParentId: string | null,
): boolean => {
  if (nextParentId == null) {
    return false;
  }
  if (nextParentId === folderId) {
    return true;
  }
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  let cursor: string | null = nextParentId;
  const seen = new Set<string>();
  while (cursor) {
    if (cursor === folderId) {
      return true;
    }
    if (seen.has(cursor)) {
      return true;
    }
    seen.add(cursor);
    cursor = byId.get(cursor)?.parentId ?? null;
  }
  return false;
};

export const wouldCreateDocCycle = (
  notes: readonly { id: string; parentDocId: string | null }[],
  noteId: string,
  nextParentId: string | null,
): boolean =>
  wouldCreateFolderCycle(
    notes.map((note) => ({ id: note.id, parentId: note.parentDocId })),
    noteId,
    nextParentId,
  );
