import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { Button } from "@mui/material";

export function LogoutButton () {
    const { logout } = useContext(AuthenticationContext);

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={logout}
            sx={{
                mt: 2
            }}
        >
            Logout
        </Button>
    );
}