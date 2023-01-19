import { forwardRef, memo, useImperativeHandle, useRef } from 'react';

export type ModalDialogHandler = {
  open: () => Promise<any>;
};

type Button = {
  text: string;
  onClick: () => void;
};

type Props = {
  title: string;
  content: string;
  primaryButton: Button;
  secondaryButton: Button;
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
        <button
          onClick={(e) => {
            e.target.dispatchEvent(new Event('primary', { bubbles: true }));
          }}
        >
          {primaryButton.text}
        </button>
        <button
          name='secondary'
          onClick={(e) => {
            e.target.dispatchEvent(new Event('secondary', { bubbles: true }));
          }}
        >
          {secondaryButton.text}
        </button>
      </dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';

export default memo(ModalDialog);
