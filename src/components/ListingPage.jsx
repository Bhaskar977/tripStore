import { useParams } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box } from "@mui/material";
import { useEffect, useState } from "react";

const ListingPage = () => {
  const { category } = useParams();
  const [places, setPlaces] = useState([]);
  const apiKeyValue = process.env.REACT_APP_API_KEY

  // API Call

  useEffect(()=>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const apiKey = apiKeyValue;
          const input = category;
          const inputType = "textquery";
          const fields = "place_id,name,formatted_address";
          const locationBias = `circle:10000@${latitude},${longitude}`;

          const Url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=${inputType}&fields=${fields}&locationbias=${locationBias}&key=${apiKey}`;

          fetch(Url)
            .then((res) => res.json())
            .then((data) => setPlaces(data.candidates))
            .catch((err) => console.log("Error Fetching Places:", err));
        },
        (error) => {
          console.log("Error getting geolocation", error);
        }
      );
  },[])

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">TripStore</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Autocomplete>
              <div style={{ border: "1px solid #fff", borderRadius: "5px" }}>
                <InputBase placeholder="search..." />
              </div>
            </Autocomplete>
          </Box>
        </Toolbar>
      </AppBar>
      <h2>
        Lists of {category}
      </h2>
      <div style={{border:"1px solid", width:"60%",padding:"10px"}}>
        {places.length > 0 &&
          places.map((el) => (
            <div key={el.place_id}>
              <h3>{el.name}</h3>
              <p>{el.formatted_address}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default ListingPage;


