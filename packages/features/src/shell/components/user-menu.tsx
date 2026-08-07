import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUserInitials } from '@features/auth/lib/post-auth-navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { AUTH_ROUTES } from '@features/auth/types';
import { toast } from '@shared/ui/feedback/toast';
import { cn } from '@shared/ui/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/overlays/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type UserMenuProps = {
  readonly className?: string;
};

export const UserMenu = ({ className }: UserMenuProps): ReactElement => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initials = getUserInitials(user?.fullName);
  const displayName = user?.fullName ?? 'Account';

  const handleSignOut = async (): Promise<void> => {
    await logout();
    navigate(AUTH_ROUTES.welcome, { replace: true });
  };

  const showComingSoon = (label: string): void => {
    toast.message(`${label} — Coming soon`);
  };

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="ghost"
                size="md"
                aria-label={`User menu: ${displayName}`}
                aria-haspopup="menu"
                className={cn('rounded-full p-0', className)}
              >
                <Avatar size="sm">
                  {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
                  <AvatarFallback initials={initials} />
                </Avatar>
              </IconButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            {displayName}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>
          <Text as="span" variant="body-sm" className="block truncate font-medium">
            {displayName}
          </Text>
          {user?.email ? (
            <Text as="span" variant="caption" muted className="block truncate">
              {user.email}
            </Text>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => showComingSoon('Profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => showComingSoon('Preferences')}>
          Preferences
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => showComingSoon('Keyboard shortcuts')}>
          Keyboard shortcuts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={() => void handleSignOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { UserMenuProps };
