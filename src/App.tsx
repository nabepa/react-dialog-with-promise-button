import { useRef } from 'react';
import './App.css';
import Button from './components/Button/Button';
import ModalDialog, {
  ModalDialogHandler,
} from './components/ModalDialog/ModalDialog';

function App() {
  const modalRef = useRef<ModalDialogHandler>(null);

  return (
    <div className='App'>
      <button
        onClick={async () => {
          const clickedButton = await modalRef.current?.open();
          console.log(`${clickedButton} button is clicked`);
        }}
      >
        open
      </button>
      <ModalDialog
        ref={modalRef}
        title='TITLE'
        content='HELLO WORLD!'
        primaryButton={{
          children: 'PRIMARY',
          onClick: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            });
          },
        }}
        secondaryButton={{
          children: 'SECONDARY',
          onClick: () => {},
        }}
      />
    </div>
  );
}

export default App;
