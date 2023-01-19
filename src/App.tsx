import { useRef, useState } from 'react';
import './App.css';
import Button from './components/Button/Button';
import ModalDialog, {
  ModalDialogHandler,
} from './components/ModalDialog/ModalDialog';
import { sleep } from './utils/sleep';

function App() {
  const modalRef = useRef<ModalDialogHandler>(null);

  const [buttonIdx, setButtonIdx] = useState<number>(-1);

  return (
    <div className='App'>
      {buttonIdx !== -1 ? (
        <h1>{`Button ${buttonIdx} is clicked!`}</h1>
      ) : (
        <h1>Click the button to open the modal dialog.</h1>
      )}
      <Button
        onClick={async () => {
          const clickedButton = await modalRef.current?.open();
          if (clickedButton == null) return;
          setButtonIdx(clickedButton);
        }}
      >
        open
      </Button>
      <ModalDialog
        ref={modalRef}
        title='TITLE'
        content='HELLO WORLD!'
        buttons={[
          {
            children: '0',
            onClick: () => {},
          },
          {
            children: '1',
            onClick: () => {
              return sleep(1000);
            },
          },
          {
            children: '2',
            onClick: () => {
              return sleep(2000);
            },
          },
          {
            children: '3',
            onClick: () => {
              return sleep(3000);
            },
          },
        ]}
      />
    </div>
  );
}

export default App;
