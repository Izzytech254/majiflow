'use client';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Container className="flex min-h-screen flex-col items-center justify-center gap-4 py-24 text-center">
          <h1 className="font-display text-3xl">Something went wrong</h1>
          <p className="text-muted-foreground">An unexpected error occurred.</p>
          <Button onClick={() => reset()}>Try again</Button>
        </Container>
      </body>
    </html>
  );
}
