import type { KeyboardEvent } from 'react';

type KeyboardHandler = (event: KeyboardEvent<HTMLElement>) => void;

export const createKeyboardNavigation = (
  items: Array<{ id: string; disabled?: boolean }>,
  activeIndex: number,
  onSelect: (index: number) => void,
): {
  onKeyDown: KeyboardHandler;
} => {
  const onKeyDown: KeyboardHandler = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key)) {
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const first = items.findIndex((item) => !item.disabled);
      onSelect(first >= 0 ? first : 0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      let last = items.length - 1;
      while (last >= 0 && items[last].disabled) {
        last -= 1;
      }
      onSelect(last);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onSelect(activeIndex);
      return;
    }

    event.preventDefault();

    let next = event.key === 'ArrowDown' ? activeIndex + 1 : activeIndex - 1;

    while (next >= 0 && next < items.length && items[next].disabled) {
      next += event.key === 'ArrowDown' ? 1 : -1;
    }

    if (next >= 0 && next < items.length) {
      onSelect(next);
    }
  };

  return { onKeyDown };
};
