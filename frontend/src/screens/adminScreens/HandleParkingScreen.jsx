import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link, useNavigate } from "react-router-dom";

//Icons for listes
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { red } from "@mui/material/colors";

//delete
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//Mutations
import {
  useGetParkingsAllDataMutation,
  useAddParkingMutation,
  useDeleteParkingMutation,
} from "../../slices/adminApiSlice";

import "./HandleParking.css";

const HandleParking = () => {
  const [tabs, setTabs] = useState("Liste");

  const [getParkingsData] = useGetParkingsAllDataMutation();

  const [deleteParking, { isDeleteLoading }] = useDeleteParkingMutation();

  const [parkingsData, setParkingsData] = useState([]);

  const navigate = useNavigate();

  //Pour le formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setPhone] = useState(0);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [places, setPlaces] = useState(0);
  const [max_places, setMaxPlaces] = useState(0);

  //Obtenir les données pour afficher
  useEffect(() => {
    try {
      const fetchData = async () => {
        const responseFromApiCall = await getParkingsData();

        const parkingsArray = responseFromApiCall.data.parkingsData;

        //console.log(parkingsArray);

        const newData = parkingsArray.map((item) => ({
          ...item,
          id: item._id, // Copie les propriétés existantes et ajoute 'id'
        }));

        //console.log(newData);

        setParkingsData(newData);
      };

      fetchData();
      const interval = setInterval(() => {
        fetchData(); // Récupérer les données toutes les 5 secondes
      }, 5000); // 1000 millisecondes = 1 secondes

      return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err);

      console.error("Error fetching parkings:", err);
    }
  }, [getParkingsData]);

  const [register, { isLoading }] = useAddParkingMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    var data = {
      name,
      email,
      telephone,
      longitude,
      latitude,
      places,
      max_places,
    };
    try {
      const responseFromApiCall = await register(data).unwrap();
      // Charlier Martin
      //dispatch(setCredentials({ ...responseFromApiCall }));
      toast.success("Parking a été rajouté.");
      setName("");
      setEmail("");
      setPhone(0);
      setLongitude("");
      setLatitude("");
      setPlaces(0);
      setMaxPlaces(0);
      setTabs("Liste");
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }
  };

  //Pour le tableau d'affichage
  const columns = [
    { field: "id", headerName: "ID", width: 225 },
    { field: "name", headerName: "Alias", width: 200 },
    { field: "email", headerName: "E-mail", width: 275 },
    {
      field: "telephone",
      headerName: "Numéro",
      type: "number",
      width: 150,
    },
    {
      field: "max_places",
      headerName: "Disponibilité",
      type: "number",
      width: 150,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const [selectionModels, setRowSelectionModel] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (selectionModels.length != 0) {
      setOpen(true);
    } else {
      toast.error("Aucun parking selectionner...");
    }
  };

  const handleDelete = async () => {
    try {
      const responseFromApiCall = await deleteParking({
        parkingId: selectionModels[0],
      });
      toast.success("Parking has been deleted Successfully.");
      setOpen(false);
      setRowSelectionModel([]);
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="page">
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button
          onClick={() => {
            setTabs("Liste");
          }}
        >
          Liste
        </Button>
        <Button
          onClick={() => {
            setTabs("Ajouter");
          }}
        >
          Ajouter
        </Button>
        <Button
          onClick={() => {
            setTabs("Carte");
          }}
        >
          Carte
        </Button>
      </ButtonGroup>
      <div>
        {tabs === "Liste" && (
          <div className="listeStyle">
            <Paper sx={{ height: 580, width: 1000, marginTop: 2 }}>
              <DataGrid
                rows={parkingsData}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 20]}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                sx={{ border: 0 }}
              />
            </Paper>
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab color="success" aria-label="add">
                <AddIcon
                  onClick={() => {
                    setTabs("Ajouter");
                  }}
                />
              </Fab>
              <Fab color="info" aria-label="edit">
                <EditIcon />
              </Fab>
              <Fab color="error" aria-label="delete">
                <RemoveCircleIcon onClick={handleClickOpen} />
              </Fab>
            </Box>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Voulez-vous vraiment effacer ce parking?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Vous effacerez toutes données lié ou concernant ce parking,
                  soyez sûr d'être en ordre avant de continuer.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Fermer</Button>
                <Button onClick={handleDelete} autoFocus>
                  Continuer
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {tabs === "Ajouter" && (
          <form onSubmit={handleSubmit}>
            <h2 className="encoderTitle">Encoder</h2>
            <hr />
            <label>
              Nom:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Téléphone:
              <input
                type="number"
                value={telephone}
                onChange={(e) => {
                  if (isNaN(e.target.value)) {
                    setPhone(0);
                  } else {
                    setPhone(parseInt(e.target.value));
                  }
                }}
                required
              />
            </label>
            <br />
            <label>
              Longitude:
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Latitude:
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Nombre maximum de lieux:
              <input
                type="number"
                value={max_places}
                onChange={(e) => {
                  setMaxPlaces(parseInt(e.target.value)),
                    setPlaces(parseInt(e.target.value));
                }}
                required
              />
            </label>
            <br />
            <button className="sub" type="submit">
              Soumettre
            </button>
          </form>
        )}
        {tabs === "Carte" && <div>Carte</div>}
      </div>
    </div>
  );
};

export default HandleParking;
