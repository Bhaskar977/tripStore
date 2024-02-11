import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./DetailPage.css";

const DetailPage = () => {
  const { placeId } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);

  let cat = JSON.parse(localStorage.getItem("category"));
  console.log(cat);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.REACT_APP_API_KEY}`
        );
        const jsonData = await response.json();
        setPlaceDetails(jsonData.result);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (!placeDetails) {
    return <p>Loading...</p>;
  }

  console.log(placeDetails);

  return (
    <div>
      <h1 className="heading">Detail Page of the Shops</h1>
      <div className="container">
        <div className="inner-container">
          {/* <div className="img">
            <img src={placeDetails.icon} alt="" />
          </div> */}
          <div>
            <h1>{placeDetails.name}</h1>
            <p>
              <strong>Address</strong> : {placeDetails.formatted_address}
            </p>
            <p>
              <strong>Ratings : </strong>
              {placeDetails.rating}
            </p>
          </div>
        </div>
        <div>
          <Link
            to={`/listing/${cat}`}
            style={{ textDecoration: "none", color: "#000" }}
          >
            <button className="btn">Go Back to Listing Page</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
