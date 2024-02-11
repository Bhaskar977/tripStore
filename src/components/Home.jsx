import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import product from "../db.json";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(product);
  }, []);

  return (
    <div>
      <h1 style={{textAlign:"center"}}>List of Choices</h1>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)"}}>
        {data?.map((item) => (
          <Link
            to={`/listing/${item.category}`}
            style={{textDecoration:"none"}}
          >
            <Box
              key={item.id}
              sx={{
                width:"80%",
                borderRadius:"10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" ,
                p: 3,
                mb: 2,
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 10,
                  borderRadius: "50%",
                }}
              />
              <h3 style={{ color: "#000"}}>{item.category}</h3>
            </Box>
          </Link>
        ))}
      </Box>
    </div>
  );
};

export default Home;
