import { Github } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import type { OAuthProvider } from '@features/auth/types';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';

type OAuthButtonProps = {
  readonly provider: OAuthProvider;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

const providerLabels: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
  github: 'Continue with GitHub',
};

const GoogleMark = (): ReactElement => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15.68 8.18c0-.56-.05-1.1-.14-1.62H8v3.06h4.3a3.68 3.68 0 0 1-1.6 2.41v2h2.59c1.51-1.39 2.39-3.44 2.39-5.85Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.59-2a4.67 4.67 0 0 1-6.95-2.46H.99v2.07A8 8 0 0 0 8 16Z"
      fill="currentColor"
      opacity="0.75"
    />
    <path
      d="M3.75 9.6a4.8 4.8 0 0 1 0-3.2V4.33H.99a8 8 0 0 0 0 7.34L3.75 9.6Z"
      fill="currentColor"
      opacity="0.6"
    />
    <path
      d="M8 3.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.96 7.96 0 0 0 8 0 8 8 0 0 0 .99 4.33L3.75 6.4A4.76 4.76 0 0 1 8 3.18Z"
      fill="currentColor"
      opacity="0.8"
    />
  </svg>
);

const providerIcons: Record<OAuthProvider, ReactNode> = {
  google: <GoogleMark />,
  github: <Icon icon={Github} size="default" decorative />,
};

export const OAuthButton = ({
  provider,
  loading = false,
  disabled = false,
  onClick,
  className,
}: OAuthButtonProps): ReactElement => {
  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      leftIcon={loading ? undefined : providerIcons[provider]}
      className={cn('w-full border border-border-default', className)}
      aria-label={providerLabels[provider]}
    >
      {providerLabels[provider]}
    </Button>
  );
};

export type { OAuthButtonProps };
