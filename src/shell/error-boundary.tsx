import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { NorthButton } from '@/components/ui/north-button';

export class AppErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { console.warn('North render failed', error); }
  render() {
    if (this.state.failed) return <NorthScreen>
      <NorthText variant="title">Something went wrong.</NorthText>
      <NorthText>Your Journey is saved on this phone.</NorthText>
      <NorthButton label="Try again" onPress={() => this.setState({ failed: false })} />
    </NorthScreen>;
    return this.props.children;
  }
}
