import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tab,
  Tabs,
  Pagination,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import * as legInterface from './interfaces';
import './App.css';
import Logo from './logo.svg';

function JsonTable() {
  const [data, setData] = useState<legInterface.Result[]>([]);
  const [billCount, setBillCount] = useState<number>();
  const [page, setPage] = useState<number>(0); // Current page
  const itemsPerPage = 40;
  const [filterText, setFilterText] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<{ shortTitleEn: string; shortTitleGa: string } | null>(
    null
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState<number>(0);
  const [tabValue2, setTabValue2] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // State for selected status filter
  
  useEffect(() => {
    // Function to fetch data based on the current page, items per page, filter text, and status filter
    const fetchData = () => {
      // Construct the API URL with the selected status filter
      const apiUrl = `/v1/legislation?limit=${itemsPerPage}&skip=${page * itemsPerPage}&bill_no=${filterText}&status=${selectedStatus}`;

      fetch(apiUrl, {
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

    // Fetch data when the component mounts, the page number changes, or the filter text or status filter changes
    fetchData();
  }, [page, filterText, selectedStatus]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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

  // Function to filter bills based on status
  const filterBillsByStatus = (bills: legInterface.Result[]) => {
    if (!selectedStatus) {
      // If no status filter is selected, return all bills
      return bills;
    }
    // Filter bills based on the selected status
    return bills.filter((bill) => bill.bill.status === selectedStatus);
  };

  // Function to get favorite bills
const getFavoriteBills = () => {
  return data.filter((item) => isFavorite(item.bill.shortTitleEn));
};

const handleDialogTabChange = (event:React.SyntheticEvent<Element, Event>, newValue:number) => {
  setTabValue2(newValue);
};

<DialogTitle>Titles
  <Tabs value={tabValue} onChange={handleDialogTabChange}>
    <Tab label="English" />
    <Tab label="Gaelic" />
  </Tabs>
</DialogTitle>

  return (
    <div className='Background'>
        <div className="header">
          <div className="logo-container">
          <a href="https://www.oireachtas.ie" target="_blank" rel="noopener noreferrer">
            <img src={Logo} alt="Logo"/>
          </a>
          </div>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            centered
            indicatorColor="primary"
            className='Bills'
          >
            <Tab label="All Bills" sx={{ '&.MuiTab-root': { color: 'white' } }}></Tab>
            <Tab label="Favorite Bills" sx={{ '&.MuiTab-root': { color: 'white' } }}></Tab>
          </Tabs>
        </div>
      {tabValue === 0 && (
        <div>
          <TextField
            label="Filter by Bill Number"
            variant="outlined"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ marginLeft: '15%', marginTop: '7px', marginBottom: '7px', width:'15%' }}
          />
          <TableContainer component={Paper} className='table'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill number</TableCell>
                  <TableCell>Bill Type</TableCell>
                  <TableCell>Status  
                    <Select
                       variant="outlined"
                       value={selectedStatus}
                       onChange={(e) => setSelectedStatus(e.target.value as string)}
                       renderValue={() => ""}
                       sx={{
                        "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent"
                        }
                      }} 
                    >   
                       <MenuItem value="">All Status</MenuItem>
                       <MenuItem value="Current">Current</MenuItem>
                       <MenuItem value="Lapsed">Lapsed</MenuItem>
                       <MenuItem value="Defeated">Defeated</MenuItem>
                       <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                       <MenuItem value="Enacted">Enacted</MenuItem>
                       <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                 
                  {/* <TableCell>Title</TableCell> */}
                  <TableCell>Sponsor</TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterBillsByStatus(data).map((item , index) =>  (
                  <TableRow>
                    <TableCell 
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.billNo}</TableCell>
                    <TableCell 
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.billType}</TableCell>
                    <TableCell key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.status}</TableCell>
                    {/* <TableCell>{item.bill.shortTitleEn}</TableCell> */}
                    <TableCell key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.sponsors.length > 0 ? (
                        item.bill.sponsors[0].sponsor.as.showAs
                      ) : (
                        "No Sponsor Available"
                      )}
                    </TableCell>
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
          <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
            {billCount && (
              <Pagination
                count={Math.ceil(billCount / itemsPerPage)}
                page={page + 1}
                onChange={(event, newPage) => handlePageChange(newPage - 1)}
              />
            )}
          </div>
        </div>
      )}
      {tabValue === 1 && (
        <div>
          <TableContainer component={Paper} className='table'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill number</TableCell>
                  <TableCell>Bill Type</TableCell>
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Title</TableCell> */}
                  <TableCell>Sponsor</TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFavoriteBills().map((item, index) => (
                  <TableRow>
                    <TableCell 
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.billNo}</TableCell>
                    <TableCell 
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.billType}</TableCell>
                    <TableCell 
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.status}</TableCell>
                    {/* <TableCell>{item.bill.shortTitleEn}</TableCell> */}
                    <TableCell
                    key={index}
                    onClick={() => handleRowClick(item.bill.shortTitleEn, item.bill.shortTitleGa)}
                    style={{ cursor: 'pointer' }}>
                      {item.bill.sponsors.length > 0 ? (
                        item.bill.sponsors[0].sponsor.as.showAs
                      ) : (
                        "No Sponsor Available"
                      )}
                    </TableCell>
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
        <DialogTitle> Title
          <Tabs 
          value={tabValue2} 
          onChange={(event, newValue) => setTabValue2(newValue)}
          centered
        >
            <Tab label="English" sx={{ '&.MuiTab-root': { color: 'black' } }} ></Tab>
            <Tab label="Gaelic" sx={{ '&.MuiTab-root': { color: 'black' } }}></Tab>
          </Tabs>
          </DialogTitle>
        <DialogContent>
          {tabValue2 === 0 && (
            <Typography variant="subtitle1">
              English Title: {selectedRow && selectedRow.shortTitleEn}
            </Typography>
          )}
          {tabValue2 === 1 && (
            <Typography variant="subtitle1">
              Gaelic Title: {selectedRow && selectedRow.shortTitleGa}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default JsonTable;
