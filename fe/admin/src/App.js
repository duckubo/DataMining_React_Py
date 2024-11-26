import Topbar from './components/topbar/Topbar';
import Footer from './components/footer/Footer';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Statistics from './pages/statistics/Statistics';
import Analyst from './pages/analyst/Analyst';
import Predict from './pages/predict/Predict';
import DashBoard from './pages/dashboard/DashBoard';

function App() {

  return (
    <Router>
      <Switch>
        <>
          <Topbar />
          <div className='container'>
            <Route path='/'>
              <DashBoard />
            </Route>
            <Route path='/analyst'>
              <Analyst />
            </Route>
            <Route path='/statistics'>
              <Statistics />
            </Route>
            <Route path='/predict/:ticket'>
              <Predict />
            </Route>
          </div>
          <Footer />
        </>
      </Switch>
    </Router>
  );
}

export default App;