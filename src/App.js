import './App.css';
import Calendar from './components/Calendar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        women monkey
      </header>
      <div>calendar</div>
      <div className='container'><Calendar /></div>
    </div>
  );
}

export default App;
