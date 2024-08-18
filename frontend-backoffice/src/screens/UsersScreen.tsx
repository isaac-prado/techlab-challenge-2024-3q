import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box, Grid, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useState } from "react"
import { PaginationButton } from "../components/PaginationButton.js"
import { teal } from "@mui/material/colors"

export function UsersScreen() {
  const [page, setPage] = useState(1);
  const limit = 25;
  
  const accessToken = useAccessToken()
  const query = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, limit }
      })

      return response.data as {
        count: number
        users: IUser[]
        totalPages: number
      }
    },
  })

  const users = query.data?.users
  const totalPages = query.data?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
  <>
    <Box sx={{ overflowY: 'auto', height: '100vh', padding: 2, paddingTop: 12 }}>
      <Grid container spacing={3} justifyContent="center">
        {users?.map(user => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`users:${user.id}`}>
            <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 2,
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: teal[700], fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  {user.email}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
    <Box
        position="fixed"
        top={16}
        right={16}
        zIndex={1000}
        sx={{ padding: '8px' }}
      >
        <PaginationButton
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
  </>
  );
}