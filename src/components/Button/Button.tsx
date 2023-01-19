import {
  forwardRef,
  memo,
  MouseEvent,
  MouseEventHandler,
  useState,
} from 'react';

type OnClick =
  | MouseEventHandler<HTMLButtonElement>
  | ((e: MouseEvent<HTMLButtonElement>) => Promise<void>);

export type ButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onClick'
> & {
  onClick?: OnClick | undefined;
};

const Button: React.FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, disabled, onClick, ...attributes }, ref) => {
  const [isDelayed, setIsDelayed] = useState<boolean>(false);
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (onClick == null) return;
    try {
      setIsDelayed(true);
      await onClick(e);
    } finally {
      setIsDelayed(false);
    }
  };

  return (
    <button
      disabled={disabled || isDelayed}
      onClick={handleClick}
      ref={ref}
      {...attributes}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default memo(Button);
