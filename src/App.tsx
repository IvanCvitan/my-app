import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

import * as legInterface from './interfaces'

function JsonTable() {
  const [data, setData] = useState<legInterface.Result[]>([]);
  const [billCount, setBillCount] = useState<number>();
  const [limit, setLimit] = useState<number>(50); // Initial limit
  const [filterText, setFilterText] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<{ shortTitleEn: string; shortTitleGa: string } | null>(null); // Track the selected row
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<number>(0); // 0 for All Bills, 1 for Favorite Bills

  useEffect(() => {
    // Function to fetch data based on the current limit and filter text
    const fetchData = () => {
      fetch(`/v1/legislation?limit=${limit}&bill_no=${filterText}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((jsonData) => {
          const resultsArray = jsonData.results;
          setData(resultsArray);
          const bc = jsonData.head.counts.billCount;
          setBillCount(bc);

        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    // Fetch data when the component mounts, the limit changes, or the filter text changes
    fetchData();
  }, [limit, filterText]);

  // Function to load the next 50 items
  const loadMore = () => {
    setLimit(limit + 50);
  };

  // Function to handle row click and open the modal
  const handleRowClick = (shortTitleEn: string, shortTitleGa: string) => {
    setSelectedRow({ shortTitleEn, shortTitleGa });
    setOpenModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedRow(null);
    setOpenModal(false);
  };

  // Function to toggle favorite status
  const toggleFavorite = (shortTitleEn: string) => {
    if (favorites.includes(shortTitleEn)) {
      // Unfavorite the bill
      const updatedFavorites = favorites.filter((favBillNo) => favBillNo !== shortTitleEn);
      setFavorites(updatedFavorites);
      console.log(`Unfavorite bill: ${shortTitleEn}`);
    } else {
      // Favorite the bill
      const updatedFavorites = [...favorites, shortTitleEn];
      setFavorites(updatedFavorites);
      console.log(`Favorite bill: ${shortTitleEn}`);
    }
  };

  // Function to check if a bill is favorite
  const isFavorite = (shortTitleEn: string) => favorites.includes(shortTitleEn);

  // Function to filter favorite bills
  const getFavoriteBills = () => {
    return data.filter((item) => isFavorite(item.bill.shortTitleEn));
  };

  return (
    <div>
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="All Bills"></Tab>
        <Tab label="Favorite Bills"></Tab>
      </Tabs>
      {tabValue === 0 && (
        <div>
          <TextField
            label="Filter by Bill Number"
            variant="outlined"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill number</TableCell>
                  <TableCell>Bill Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Sponsor</TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  
                data.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{item.bill.billNo}</TableCell>
                    <TableCell>{item.bill.billType}</TableCell>
                    <TableCell>{item.bill.status}</TableCell>
                    <TableCell>{item.bill.shortTitleEn}</TableCell>
                    <TableCell>{item.bill.sponsors[0].sponsor.as.showAs}</TableCell>
                    <TableCell>
                      <IconButton
                        color={isFavorite(item.bill.shortTitleEn) ? 'primary' : 'default'}
                        onClick={() => toggleFavorite(item.bill.shortTitleEn)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Tabs style={{ marginTop: '10px' }} centered>
            <Button variant="contained" color="primary" onClick={loadMore}>
              Load More
            </Button>
          </Tabs>
        </div>
      )}
      {tabValue === 1 && (
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill number</TableCell>
                  <TableCell>Bill Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Sponsor</TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFavoriteBills().map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{item.bill.billNo}</TableCell>
                    <TableCell>{item.bill.billType}</TableCell>
                    <TableCell>{item.bill.status}</TableCell>
                    <TableCell>{item.bill.shortTitleEn}</TableCell>
                    <TableCell>{item.bill.sponsors[0].sponsor.as.showAs}</TableCell>
                    <TableCell>
                      <IconButton
                        color={isFavorite(item.bill.shortTitleEn) ? 'primary' : 'default'}
                        onClick={() => toggleFavorite(item.bill.shortTitleEn)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Titles</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            English Title: {selectedRow && selectedRow.shortTitleEn}
          </Typography>
          <Typography variant="subtitle1">
            Gaelic Title: {selectedRow && selectedRow.shortTitleGa}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default JsonTable;
