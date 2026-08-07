import type { ReactElement } from 'react';

import type { DashboardRisk } from '@features/dashboard/types';
import { Alert } from '@shared/ui/feedback/alert';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type RiskCardProps = {
  readonly risk: DashboardRisk;
  readonly className?: string;
};

export const RiskCard = ({ risk, className }: RiskCardProps): ReactElement => {
  return (
    <Alert
      variant={risk.severity === 'danger' ? 'danger' : 'warning'}
      title={risk.title}
      className={cn(className)}
      role="status"
    >
      <Text as="p" variant="body-sm" className="text-current/90">
        {risk.body}
      </Text>
    </Alert>
  );
};

export type { RiskCardProps };
