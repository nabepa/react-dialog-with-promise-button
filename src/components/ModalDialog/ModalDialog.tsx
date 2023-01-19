import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import Button, { ButtonProps } from '../Button/Button';

export type ModalDialogHandler = {
  open: () => Promise<number>;
};

type Props = {
  title: string;
  content: string;
  buttons: ButtonProps[];
};

const PREFIX = 'modal-dialog-';

const ModalDialog = forwardRef<ModalDialogHandler, Props>(
  ({ title, content, buttons }, ref) => {
    if (buttons.length <= 0)
      throw new Error('ModalDialog needs at least one button.');
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          dialogRef.current?.showModal();
          const eventHandlers: Array<() => void> = [];
          return new Promise<number>((resolve) => {
            buttons.forEach((_, idx) => {
              const handler = () => {
                resolve(idx);
              };
              eventHandlers.push(handler);
              dialogRef.current?.addEventListener(`${PREFIX}${idx}`, handler);
            });
          }).finally(() => {
            buttons.forEach((_, idx) => {
              dialogRef.current?.removeEventListener(
                `${PREFIX}${idx}`,
                eventHandlers[idx]
              );
            });
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

    return (
      <dialog ref={dialogRef}>
        <h1>{title}</h1>
        <p>{content}</p>
        <fieldset disabled={isDelayed}>
          {buttons.map((button, idx) => (
            <Button
              key={idx}
              onClick={async (e) => {
                try {
                  if (button.onClick == null) return;
                  setIsDelayed(true);
                  await button.onClick(e);
                } finally {
                  setIsDelayed(false);
                  e.target.dispatchEvent(
                    new Event(`${PREFIX}${idx}`, { bubbles: true })
                  );
                }
              }}
            >
              {button.children}
            </Button>
          ))}
        </fieldset>
      </dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';

export default memo(ModalDialog);
