import { ChevronRight, Command, Search } from 'lucide-react';

import {
  Accordion,
  Alert,
  AppIcon,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Combobox,
  CommandMenu,
  Container,
  ContextMenu,
  Divider,
  DropdownMenu,
  EmptyState,
  Grid,
  Heading,
  Inline,
  Input,
  LoadingIndicator,
  Modal,
  Pagination,
  Popover,
  Progress,
  Radio,
  ScrollArea,
  SearchInput,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  Surface,
  Switch,
  Tabs,
  Text,
  Textarea,
  Toast,
  Tooltip,
} from '@shared';

export default function App() {
  return (
    <div className="min-h-screen bg-app text-text-primary">
      <Container className="py-6">
        <Stack gap={24}>
          <Stack gap={8}>
            <Heading as="h1">Primordial Task Design System Foundation</Heading>
            <Text tone="secondary">
              Phase 3 baseline preview only. No feature modules or business pages are implemented.
            </Text>
          </Stack>

          <Divider />

          <Grid columns={2} gap={16}>
            <Card>
              <CardHeader>
                <Heading as="h3">Typography</Heading>
              </CardHeader>
              <CardBody>
                <Text variant="display">Display</Text>
                <Text variant="h2">Heading 2</Text>
                <Text variant="body-medium">Body medium text</Text>
                <Text variant="caption" tone="muted">
                  Caption and metadata
                </Text>
                <Text variant="mono">const design = 'system';</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h3">Buttons & Status</Heading>
              </CardHeader>
              <CardBody>
                <Inline>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </Inline>
                <Inline>
                  <Badge>Neutral</Badge>
                  <Badge tone="success">Success</Badge>
                  <Badge tone="warning">Warning</Badge>
                  <Badge tone="danger">Danger</Badge>
                  <Badge tone="info">Info</Badge>
                </Inline>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h3">Form Controls</Heading>
              </CardHeader>
              <CardBody>
                <Input placeholder="Input" />
                <SearchInput placeholder="Search" value="" />
                <Textarea placeholder="Textarea" />
                <Select
                  label="Select"
                  options={[
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                  ]}
                  defaultValue="a"
                />
                <Combobox
                  label="Combobox"
                  value=""
                  onChange={() => {
                    return;
                  }}
                  options={[
                    { label: 'One', value: 'one' },
                    { label: 'Two', value: 'two' },
                  ]}
                />
                <Inline>
                  <Checkbox label="Checkbox" />
                  <Radio label="Radio" name="demo-radio" />
                  <Switch label="Switch" checked />
                </Inline>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h3">Feedback</Heading>
              </CardHeader>
              <CardBody>
                <Alert title="Neutral alert" description="Monochrome alert style" />
                <Alert tone="success" title="Success alert" description="Operation complete" />
                <Inline>
                  <Spinner />
                  <LoadingIndicator label="Syncing..." />
                </Inline>
                <Progress value={62} label="Build Progress" />
                <Skeleton className="h-8 w-full" />
                <Toast title="Toast" description="Background task done." />
                <EmptyState title="No content" description="Create something to begin." />
              </CardBody>
            </Card>
          </Grid>

          <Card>
            <CardHeader>
              <Heading as="h3">Navigation & Overlays</Heading>
            </CardHeader>
            <CardBody>
              <Breadcrumb
                items={[
                  { id: 'a', label: 'Workspace' },
                  { id: 'b', label: 'Design System' },
                ]}
              />
              <Tabs
                tabs={[
                  { id: 'tokens', label: 'Tokens', content: <Text>Token surfaces</Text> },
                  {
                    id: 'components',
                    label: 'Components',
                    content: <Text>Component catalog</Text>,
                  },
                ]}
              />
              <Accordion
                items={[
                  {
                    id: 'one',
                    title: 'Accessibility',
                    content: <Text>Keyboard and ARIA defaults.</Text>,
                  },
                  { id: 'two', title: 'Motion', content: <Text>Subtle transitions only.</Text> },
                ]}
              />
              <Pagination page={1} pageCount={4} onChange={() => undefined} />
              <Inline>
                <DropdownMenu
                  items={[
                    { id: '1', label: 'Action A' },
                    { id: '2', label: 'Delete', danger: true },
                  ]}
                />
                <ContextMenu
                  items={[
                    { id: '1', label: 'Open' },
                    { id: '2', label: 'Remove', danger: true },
                  ]}
                />
              </Inline>
              <CommandMenu
                query=""
                onQueryChange={() => undefined}
                items={[
                  { id: '1', label: 'Open Command Palette', hint: 'Ctrl+K' },
                  { id: '2', label: 'Go to Workspace', hint: 'G W' },
                ]}
              />
              <Inline>
                <Tooltip text="Search">
                  <Button variant="ghost" leadingIcon={<AppIcon icon={Search} />}>
                    Tooltip Trigger
                  </Button>
                </Tooltip>
                <Popover open>
                  <Text variant="body-small">Popover foundation</Text>
                </Popover>
              </Inline>
              <Modal open={false} onClose={() => undefined} title="Modal">
                <Text>Hidden modal foundation</Text>
              </Modal>
            </CardBody>
          </Card>

          <Surface tone="sidebar" border className="rounded-lg p-4">
            <Inline align="center" justify="between">
              <Inline>
                <Avatar name="Primordial Studio" size="md" status="online" />
                <Text>Design System Ready</Text>
              </Inline>
              <Inline>
                <AppIcon icon={Command} />
                <AppIcon icon={ChevronRight} />
              </Inline>
            </Inline>
            <Separator className="my-3" />
            <ScrollArea className="max-h-24">
              <Text variant="body-small" tone="secondary">
                This shell exists only to verify component rendering and architecture wiring for
                Phase 3.
              </Text>
            </ScrollArea>
          </Surface>
        </Stack>
      </Container>
    </div>
  );
}
