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
  const [itemsPerPage, setItemsPerPage] = useState(3);
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
  
    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
  
    const placesChangedListener = searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      setSearchValue("");
      console.log(places);
    });
  
    return () => {
      window.google.maps.event.removeListener(placesChangedListener);
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

  const dynamicCategoryImages =
    category === "Bakery" ? (
      <img
      style={{ borderRadius: "50%" }}
      width="80%"
      height="100%"
        src="https://logo.com/image-cdn/images/kts928pd/production/c6d962682e37feae1b76b3541390601b11fa3238-446x438.png?w=1080&q=72"
        alt=""
      />
    ) : category === "Bar" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmFyfGVufDB8fDB8fHww"
        alt=""
      />
    ) : category === "Cafe" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D"
        alt=""
      />
    ) : category === "FastFoodRestaurant" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://i.pinimg.com/564x/ee/bb/9c/eebb9cfe1197197bbef8c963e1bedd32.jpg"
        alt=""
      />
    ) : category === "IceCreamShop" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Venice_-_Ice_cream_parlor_-_4017.jpg"
        alt=""
      />
    ) : category === "ChineseRestaurant" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://media-cdn.tripadvisor.com/media/photo-s/14/29/52/54/hong-teh-chinese-restaurant.jpg"
        alt=""
      />
    ) : category === "PizzaPlace" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://static.vecteezy.com/system/resources/previews/000/294/962/original/a-pizza-shop-on-white-background-vector.jpg"
        alt=""
      />
    ) : category === "ShushiRestaurant" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://sakura.co/wp-content/uploads/2022/03/shutterstock_673266502-2.png"
        alt=""
      />
    ) : category === "ThaiRestaurant" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv7zYQE20Y27SM2t3--uSyPnlVHnZGR-JvOLIRSAf9nQ&s"
        alt=""
      />
    ) : category === "VegetarianRestaurant" ? (
      <img
        style={{ borderRadius: "50%" }}
        width="80%"
        height="100%"
        src="https://assets.gqindia.com/photos/5d88c0fd60e1e8000856c9fe/16:9/w_2560%2Cc_limit/Best-veg-restaurants.jpg"
        alt=""
      />
    ) : (
      ""
    );

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
      <h1 className="heading">Listing Page of {category}</h1>
      <div>
        <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
          <button className="btn">Go Back to Home</button>
        </Link>
      </div>
      <div className="listing">
        <div>{dynamicCategoryImages}</div>
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
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div>
          <button
            className="prev-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button className="btn-curr">{currentPage}</button>
          <button
            className="next-btn"
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
