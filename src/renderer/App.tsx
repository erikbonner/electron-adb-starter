import { Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import {useState} from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AndroidIcon from '@mui/icons-material/Android';
import './App.css';

const Hello = () => {

  const [packages, setPackages] = useState<string[]>([])

  async function doAdbListPackages() {
    const result = await window.electron.listPackages()
    console.log(result)
    setPackages(result)
  }

  return (
    <div className="container">
      <Button onClick={doAdbListPackages} variant="contained">List installed apps</Button>

      { packages.length > 0 &&
        <List sx={{
          maxHeight: "50%",
          overflowX: "hidden",
          overflowY: "scroll",
          marginTop: "1rem"
        }}>
            {
            packages.map(result => {
              return (
                <ListItem disablePadding key={result}>
                  <ListItemButton>
                    <ListItemIcon>
                      <AndroidIcon />
                    </ListItemIcon>
                    <ListItemText primary={result} />
                  </ListItemButton>
              </ListItem>
              )
            })
            }
        </List>
      }
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

