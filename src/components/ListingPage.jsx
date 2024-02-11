import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Autocomplete } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Link, useParams } from "react-router-dom";
import "./ListingPage.css";

const ListingPage = () => {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState(""); // Set initial search value
  const searchBoxRef = useRef(null);
  const { category } = useParams();
  const libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`,
    libraries: libraries,
  });

  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log(lat, long);

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            fetchPlaces(
              res?.address?.hasOwnProperty("city")
                ? `${category} near ${res?.address?.city}`
                : `${category} near ${res?.address?.state}`
            );
          })
          .catch((err) => console.log(err));
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const searchBox = new window.google.maps.places.SearchBox(
      searchBoxRef.current
    );

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      setSearchValue("");
      console.log(places);
    });

    return () => {
      searchBox.removeListener("places_changed");
    };
  }, [isLoaded]);

  // Fetch places function using the Google place API.
  const fetchPlaces = async (location) => {
    try {
      console.log(location);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${
          searchValue || location
        }&key=${process.env.REACT_APP_API_KEY}`
      );
      const jsonData = await response.json();
      setPlaces(jsonData.results);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleClick = () => {
    localStorage.setItem("category", JSON.stringify(category));
  };

  console.log(places);

  // Logic to paginate places
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">TripStore</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Autocomplete>
              <div style={{ borderRadius: "5px" }}>
                <input
                  ref={searchBoxRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter Location"
                />
              </div>
            </Autocomplete>
          </Box>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <div>
          {currentItems.length > 0 ? (
            currentItems.map((place) => (
              <Link
                to={`/detail/${place.place_id}`}
                style={{ textDecoration: "none", color: "#000" }}
              >
                <div
                  key={place.place_id}
                  className="listing-container"
                  onClick={() => handleClick()}
                >
                  <h3 className="listing-name">{place.name}</h3>
                  <p className="listing-address">{place.formatted_address}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            <button className="btn">Go Back to Home</button>
          </Link>
        </div>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          textDecoration: "none",
        }}
      >
        <div>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button>{currentPage}</button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= places.length}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ListingPage;
