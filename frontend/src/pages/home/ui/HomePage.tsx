import { Page } from 'shared/ui';
import { DrawingSheet } from 'widgets/drawing-sheet';
import { SectionIndex } from 'widgets/section-index';

export function HomePage() {
  return (
    <>
      <DrawingSheet />
      <Page>
        <SectionIndex />
      </Page>
    </>
  );
}
