import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import type { Editor, Range } from '@tiptap/react';
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactElement,
} from 'react';
import tippy, { type Instance as TippyInstance, type Props as TippyProps } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { SLASH_COMMAND_GROUPS } from '@features/notes/constants';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

export type SlashCommandBlock = (typeof SLASH_COMMAND_GROUPS)[number]['commands'][number]['block'];

export type SlashCommandItem = {
  readonly id: string;
  readonly label: string;
  readonly block: SlashCommandBlock;
  readonly groupId: string;
  readonly groupLabel: string;
};

export type SlashCommandListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

type SlashCommandListProps = {
  readonly items: readonly SlashCommandItem[];
  readonly command: (item: SlashCommandItem) => void;
};

const ALL_SLASH_ITEMS: readonly SlashCommandItem[] = SLASH_COMMAND_GROUPS.flatMap((group) =>
  group.commands.map((command) => ({
    id: command.id,
    label: command.label,
    block: command.block,
    groupId: group.id,
    groupLabel: group.label,
  })),
);

export const filterSlashCommands = (query: string): SlashCommandItem[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...ALL_SLASH_ITEMS];
  }
  return ALL_SLASH_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(normalized) ||
      item.id.toLowerCase().includes(normalized) ||
      item.block.toLowerCase().includes(normalized),
  );
};

export const insertSlashBlock = (editor: Editor, block: SlashCommandBlock): void => {
  const chain = editor.chain().focus();

  switch (block) {
    case 'paragraph':
      chain.setParagraph().run();
      break;
    case 'heading_1':
      chain.setHeading({ level: 1 }).run();
      break;
    case 'heading_2':
      chain.setHeading({ level: 2 }).run();
      break;
    case 'heading_3':
      chain.setHeading({ level: 3 }).run();
      break;
    case 'bullet_list':
      chain.toggleBulletList().run();
      break;
    case 'ordered_list':
      chain.toggleOrderedList().run();
      break;
    case 'checklist':
      chain.toggleTaskList().run();
      break;
    case 'quote':
      chain.toggleBlockquote().run();
      break;
    case 'code_block':
      chain.toggleCodeBlock().run();
      break;
    case 'divider':
      chain.setHorizontalRule().run();
      break;
    case 'table':
      chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      break;
    default:
      chain.setParagraph().run();
      break;
  }
};

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(
  function SlashCommandList({ items, command }, ref): ReactElement {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = useCallback(
      (index: number): void => {
        const item = items[index];
        if (item) {
          command(item);
        }
      },
      [command, items],
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps): boolean => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((current) => (current + items.length - 1) % Math.max(items.length, 1));
          return true;
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((current) => (current + 1) % Math.max(items.length, 1));
          return true;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          selectItem(selectedIndex);
          return true;
        }
        if (event.key === 'Escape') {
          return true;
        }
        return false;
      },
    }));

    const grouped = useMemo(() => {
      const map = new Map<string, { label: string; items: SlashCommandItem[] }>();
      for (const item of items) {
        const existing = map.get(item.groupId);
        if (existing) {
          existing.items.push(item);
        } else {
          map.set(item.groupId, { label: item.groupLabel, items: [item] });
        }
      }
      return [...map.values()];
    }, [items]);

    if (items.length === 0) {
      return (
        <div
          className="min-w-[220px] rounded-md border border-border-default bg-surface-elevated p-3 shadow-popover"
          role="listbox"
          aria-label="Slash commands"
        >
          <Text variant="caption" muted>
            No commands
          </Text>
        </div>
      );
    }

    let flatIndex = 0;

    return (
      <div
        className="max-h-[280px] min-w-[240px] overflow-y-auto rounded-md border border-border-default bg-surface-elevated p-1 shadow-popover motion-reduce:transition-none"
        role="listbox"
        aria-label="Slash commands"
      >
        {grouped.map((group) => (
          <div key={group.label} className="mb-1 last:mb-0" role="group" aria-label={group.label}>
            <div className="px-2 py-1.5">
              <Text variant="caption" muted className="uppercase tracking-wide">
                {group.label}
              </Text>
            </div>
            {group.items.map((item) => {
              const index = flatIndex;
              flatIndex += 1;
              const selected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={item.label}
                  className={cn(
                    'flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary',
                    'ds-transition-fast motion-reduce:transition-none',
                    'hover:bg-state-hover focus-visible:bg-state-hover focus-visible:outline-none',
                    selected && 'bg-state-selected',
                  )}
                  onClick={() => selectItem(index)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

type SlashSuggestionRenderer = {
  component: ReactRenderer<SlashCommandListRef, SlashCommandListProps> | null;
  popup: TippyInstance[] | null;
};

const createSlashSuggestionRender = () => {
  const state: SlashSuggestionRenderer = {
    component: null,
    popup: null,
  };

  return {
    onStart: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => {
      state.component = new ReactRenderer(SlashCommandList, {
        props: {
          items: props.items,
          command: props.command,
        },
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      state.popup = tippy('body', {
        getReferenceClientRect: props.clientRect as TippyProps['getReferenceClientRect'],
        appendTo: () => document.body,
        content: state.component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        animation: false,
        offset: [0, 6],
      });
    },

    onUpdate: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => {
      state.component?.updateProps({
        items: props.items,
        command: props.command,
      });

      if (!props.clientRect) {
        return;
      }

      state.popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect as TippyProps['getReferenceClientRect'],
      });
    },

    onKeyDown: (props: SuggestionKeyDownProps) => {
      if (props.event.key === 'Escape') {
        state.popup?.[0]?.hide();
        return true;
      }
      return state.component?.ref?.onKeyDown(props) ?? false;
    },

    onExit: () => {
      state.popup?.[0]?.destroy();
      state.component?.destroy();
      state.popup = null;
      state.component = null;
    },
  };
};

export type SlashCommandsOptions = {
  readonly suggestion: Partial<{
    char: string;
    startOfLine: boolean;
  }>;
};

/** TipTap extension: `/` slash command menu (tippy + suggestion). */
export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem, SlashCommandItem>({
        editor: this.editor,
        char: this.options.suggestion.char ?? '/',
        startOfLine: this.options.suggestion.startOfLine ?? false,
        allowSpaces: false,
        items: ({ query }) => filterSlashCommands(query),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          insertSlashBlock(editor, props.block);
        },
        render: createSlashSuggestionRender,
      }),
    ];
  },
});

export const createSlashCommandsExtension = (): Extension => SlashCommands;

/** @deprecated Use SlashCommands / createSlashCommandsExtension — kept for compositional naming. */
export const SlashMenu = SlashCommandList;

export type SlashMenuProps = SlashCommandListProps;

/** Helper for tests / imperative insert at a range. */
export const runSlashCommand = (editor: Editor, range: Range, block: SlashCommandBlock): void => {
  editor.chain().focus().deleteRange(range).run();
  insertSlashBlock(editor, block);
};
