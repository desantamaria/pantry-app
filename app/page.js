'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, createTheme, CssBaseline, Modal, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { purple } from "@mui/material/colors";

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [itemName, setItemName] = useState('')

    const [oldItemName, setOldItemName] = useState('')
    const [newItemName, setNewItemName] = useState('')

    const [searchResults, setSearchResults] = useState([]);

    const theme = createTheme({
        palette: {
            primary: {
                main: purple[500],
              }
        },
      });

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc)=>{
            inventoryList.push({
                name: doc.id,
                ...doc.data()
            })
        })
        setInventory(inventoryList)
        setSearchResults(inventoryList)
    }

    const searchItems = (searchInput) => {
        if(searchInput != '') {
            const searchData = inventory.filter((item) => 
                item.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            setSearchResults(searchData)
        } else {
            setSearchResults(inventory)
        }
    }

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()) {
            const {quantity} = docSnap.data()
            await setDoc(docRef, {quantity: quantity + 1})
        } else {
            await setDoc(docRef, {quantity: 1})
        }
        await updateInventory()
    }

    const editItem = async (oldName, newName) => {
        const oldDocRef = doc(collection(firestore, 'inventory'), oldName)
        const oldDocSnap = await getDoc(oldDocRef)

        if(oldDocSnap.exists() && oldName != newName) {
            const itemData = oldDocSnap.data();
            const newDocRef = doc(collection(firestore, 'inventory'), newName);
    
            await setDoc(newDocRef, itemData);    
            await deleteDoc(oldDocRef);    
            await updateInventory();
        } else {
            console.error('Cannot edit name')
        }

    }

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()) {
            const {quantity} = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, {quantity: quantity - 1})
            }
        }
        await updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleEditOpen = () => setEdit(true)
    const handleEditClose = () => setEdit(false)

  return ( 
    <ThemeProvider theme={theme}>
        <CssBaseline />

  <Box width="100vw" 
    height="100vh" 
    display="flex" 
    flexDirection="column"
    justifyContent="center" 
    alignItems="center"
    gap={2}
  >
    <Modal open={open} onClose={handleClose}>
        <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #0000"
            boxShadow={24}
            padding={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{transform: "translate(-50%,-50%)"}}
        >
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
            <TextField 
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                    setItemName(e.target.value)
                }}
            ></TextField>
            <Button 
                variant="outlined"
                onClick={() => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                }}
            >Add Item</Button>
        </Stack>
        </Box>
    </Modal>

    <Modal open={edit} onClose={handleEditClose}>
        <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #0000"
            boxShadow={24}
            padding={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{transform: "translate(-50%,-50%)"}}
        >
        <Typography variant="h6">Edit Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
            <TextField 
                variant="outlined"
                fullWidth
                value={newItemName}
                onChange={(e) => {
                    setNewItemName(e.target.value)
                }}
            ></TextField>
            <Button 
                variant="outlined"
                onClick={() => {
                    editItem(oldItemName, newItemName)
                    setOldItemName('')
                    setNewItemName('')
                    handleEditClose()
                }}
            >Confirm</Button>
        </Stack>
        </Box>
    </Modal>

    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        gap={3}
    >
        <TextField 
            label="Search Items" 
            variant="outlined" 
            onChange={(e)=> {
                searchItems(e.target.value)
            }}
            fullWidth 
        />

        <Button variant="contained" onClick={() => {
            handleOpen()
        }}>
            Add New Item
        </Button>
    </Box>

    <Box border="1px solid #333">
        <Box
            width="1000px" 
            height="100px" 
            bgcolor={purple[200]} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
        >
            <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>

    <Stack 
        width="100%" 
        height="800px" 
        // spacing={2} 
        overflow="auto"
    >
        {searchResults.map(({name, quantity}) => (
            <Box 
                key={name} 
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
            >
                <Typography 
                    variant="h3" 
                    color="#333"
                    textAlign="center"                    
                >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography 
                    variant="h3" 
                    color="#333"
                    textAlign="center"                    
                >
                    {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    onClick={() => {
                        addItem(name)
                    }}
                > 
                    Add
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        removeItem(name)
                    }}
                > 
                    Remove
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setOldItemName(name)
                        setNewItemName(name)
                        handleEditOpen()
                    }}
                > 
                    Edit
                </Button>

                </Stack>

                
            </Box>
        ))}
    </Stack>
    </Box>
  </Box>
  </ThemeProvider>
  );
}
