import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import product from "../db.json";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(product);
  }, []);

//   console.log(data);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
      {data?.map((item) => (
        <Link style={{textDecoration:"none"}} to={`/listing/${item.category}`}>
          <Box
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
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
            <h3 style={{color:"#000"}}>{item.category}</h3>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default Home;

