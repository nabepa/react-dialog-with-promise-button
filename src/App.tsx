import { useRef } from 'react';
import './App.css';
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
          text: 'PRIMARY',
          onClick: () => {},
        }}
        secondaryButton={{
          text: 'SECONDARY',
          onClick: () => {},
        }}
      />
    </div>
  );
}

export default App;
