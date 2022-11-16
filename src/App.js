import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import Sidenav from './Components/Sidenav';
import Explore from "./Pages/Explore";
import TokenStatistics from "./Pages/TokenStatistics";
import WalletStatistics from "./Pages/WalletStatistics";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Grid container spacing={2} className="layout-container">
        <div sm={2} className='left-side-bar'>
          <Sidenav />
        </div>
        <div className="content-container" sm={10} style={{ width: '90%', display: 'block', justifyContent: 'center' }}>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/token_analysis" element={<TokenStatistics />} />
            <Route path="/wallet_analysis" element={<WalletStatistics />} />
          </Routes>
        </div>
      </Grid>

    </div>
  );
}

export default App;
