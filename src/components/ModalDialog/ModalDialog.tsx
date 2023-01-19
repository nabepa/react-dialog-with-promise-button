import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import Button, { ButtonProps } from '../Button/Button';

export type ModalDialogHandler = {
  open: () => Promise<any>;
};

type Props = {
  title: string;
  content: string;
  primaryButton: ButtonProps;
  secondaryButton: ButtonProps;
};

const ModalDialog = forwardRef<ModalDialogHandler, Props>(
  ({ title, content, primaryButton, secondaryButton }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          dialogRef.current?.showModal();
          let resolvePrimary = () => {};
          let resolveSecondary = () => {};
          return new Promise((resolve) => {
            resolvePrimary = () => {
              resolve('primary');
            };
            resolveSecondary = () => {
              resolve('secondary');
            };

            dialogRef.current?.addEventListener('primary', resolvePrimary);
            dialogRef.current?.addEventListener('secondary', resolveSecondary);
          }).finally(() => {
            dialogRef.current?.removeEventListener('primary', resolvePrimary);
            dialogRef.current?.removeEventListener(
              'secondary',
              resolveSecondary
            );
            dialogRef.current?.close();
          });
        },
        close: () => {
          dialogRef.current?.close();
        },
      }),
      [dialogRef]
    );

    return (
      <dialog ref={dialogRef}>
        <h1>{title}</h1>
        <p>{content}</p>
        <Button
          onClick={async (e) => {
            try {
              if (primaryButton.onClick == null) return;
              await primaryButton.onClick(e);
            } finally {
              e.target.dispatchEvent(new Event('primary', { bubbles: true }));
            }
          }}
        >
          {primaryButton.children}
        </Button>
        <Button
          onClick={async (e) => {
            try {
              if (secondaryButton.onClick == null) return;
              await secondaryButton.onClick(e);
            } finally {
              e.target.dispatchEvent(new Event('secondary', { bubbles: true }));
            }
          }}
        >
          {secondaryButton.children}
        </Button>
      </dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';

export default memo(ModalDialog);
