import { useRef } from 'react';
import './App.css';
import ModalDialog, {
  ModalDialogHandler,
} from './components/ModalDialog/ModalDialog';
import { sleep } from './utils/sleep';

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
