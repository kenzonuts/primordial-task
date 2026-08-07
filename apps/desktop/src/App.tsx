import { Stack } from '@shared/ui/layout/stack';
import { Surface } from '@shared/ui/layout/surface';
import { Text } from '@shared/ui/typography/text';

export default function App() {
  return (
    <Surface
      variant="base"
      className="grid min-h-screen place-items-center bg-[var(--bg-app)] p-[var(--space-24)]"
    >
      <Stack gap={16} align="center">
        <Text as="h1" variant="h1">
          Primordial Task
        </Text>
        <Text as="p" variant="body-md" muted>
          Design system initialized.
        </Text>
      </Stack>
    </Surface>
  );
}
