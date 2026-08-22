import { Link } from 'expo-router';

import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';

export default function NotFoundRoute() {
  return (
    <NorthScreen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <NorthText variant="title">This direction is not marked.</NorthText>
      <NorthText>Return to North and take the path from there.</NorthText>
      <Link href="/" replace asChild>
        <NorthButton label="Back to North" />
      </Link>
    </NorthScreen>
  );
}
