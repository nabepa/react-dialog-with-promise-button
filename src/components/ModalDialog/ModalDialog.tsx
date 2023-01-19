import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
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

    const [isDelayed, setIsDelayed] = useState<boolean>(false);
    const f = useCallback(
      async (
        e: MouseEvent<HTMLButtonElement>,
        key: string,
        handleClick: ButtonProps['onClick']
      ) => {
        try {
          if (handleClick == null) return;
          setIsDelayed(true);
          await handleClick(e);
        } finally {
          setIsDelayed(false);
          e.target.dispatchEvent(new Event(key, { bubbles: true }));
        }
      },
      [isDelayed]
    );

    return (
      <dialog ref={dialogRef}>
        <h1>{title}</h1>
        <p>{content}</p>
        <fieldset disabled={isDelayed}>
          <Button
            onClick={async (e) => {
              await f(e, 'primary', primaryButton.onClick);
            }}
          >
            {primaryButton.children}
          </Button>
          <Button
            onClick={async (e) => {
              await f(e, 'secondary', secondaryButton.onClick);
            }}
          >
            {secondaryButton.children}
          </Button>
        </fieldset>
      </dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';

export default memo(ModalDialog);
