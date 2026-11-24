import type { OpenAction, Outcome } from '@/domains/actions/action';

// The web preview has no notifications. The check-in still works in the app.
export type CheckInResponse =
  | { instanceId: string; kind: 'answered'; outcome: Outcome }
  | { instanceId: string; kind: 'opened' };

export function configureCheckIns(): void {}

export async function allowCheckIns(): Promise<boolean> {
  return false;
}

export async function scheduleCheckIn(_action: OpenAction): Promise<void> {}

export async function cancelCheckIns(): Promise<void> {}

export function listenForCheckIns(_handle: (response: CheckInResponse) => void): () => void {
  return () => {};
}
