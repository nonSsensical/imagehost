import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

import {
  Typography
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function UserPage() {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const { userId } = useContext(AuthContext);

  const [profile, setProfile] = useState();
  // const [image, setImage] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedProfile, setIsLoadedProfile] = useState(false);

  const [subs, setSubs] = useState();

  const getSubs = useCallback(async () => {
    try {
      await axios
        .get(
          `/api/subscribes/get_subscribes_list/${window.location.pathname.slice(6)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) =>
          setTimeout(() => {
            setSubs(response.data);
            setIsLoaded(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  const getProfile = useCallback(async () => {
    try {
      await axios
        .get(`/api/auth/get_user`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) =>
          setTimeout(() => {
            setProfile(response.data);
            setIsLoadedProfile(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getSubs();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  let chk = [];

  return !isLoaded
    ? 
    (
       <>
      
       </>
    )
    : 
    (
       subs.length == 0 ?
       (<>
        
       </>) 
       
       : 
       
       (
        subs.map((item) => (
            <>
            
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "20px",
                  alignItems: "center",
                  color: "red",
                }}
              >
                {isLoadedProfile ? (
                    profile.map((usr) =>
                    usr.id == item.subscribes_id ? usr.nickname : null
                )
                ) : 
                (
                    null
                )}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "20px",
                  alignItems: "center",
                  color: "#8ac8ff",
                }}
              >
                {item.date_publication}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "16px",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {item.message}
              </Typography>
            </>
          ))
       )
    )
}

export default UserPage;
