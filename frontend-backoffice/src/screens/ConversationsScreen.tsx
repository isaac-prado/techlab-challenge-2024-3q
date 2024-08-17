import { Box, Button, Grid } from "@mui/material";
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { blue, grey, teal } from "@mui/material/colors";

export function ConversationsScreen() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const accessToken = useAccessToken();

  const query = useQuery({
    queryKey: ['conversations', page],
    queryFn: async () => {
      const response = await api.get('/conversations', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, limit },
      })

      return response.data as {
        count: number
        conversations: IConversation[],
        totalPages: number
      }
    },
  })

  // const count = useMemo(() => {
  //   return query.data?.count ?? NaN
  // }, [query.data?.count])

  const conversations = query.data?.conversations ?? null;
  const totalPages = query.data?.totalPages ?? 1;

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev-1, 1));
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }

  return (
    <Box sx={{ overflowY: 'auto', height: '100vh', padding: 2 }}>
      <Grid container spacing={3}>
        <Grid 
          item 
          xs={3} 
          sx={{ 
            bgcolor: grey[100], 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 3, 
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'flex-start', 
              width: '100%'
            }}
          >
            {conversations?.map((conversation) => (
              <Box
                key={`conversations:${conversation.id}`}
                sx={{
                  bgcolor: grey[200],
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  width: '100%',
                  mb: 2,
                  '&:hover': {
                    bgcolor: grey[300],
                  },
                }}
              >
                <ConversationItem conversation={conversation} />
              </Box>
            ))}
          </Box>
          <Box
            position="fixed"
            top={16}
            right={16}
            zIndex={1000}
            sx={{ padding: '8px' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handlePreviousPage}
              disabled={page === 1}
              sx={{ mr: 2, bgcolor: teal[500], '&:hover': { bgcolor: teal[700] } }}
            >
              Anterior
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={page === totalPages}
              sx={{ bgcolor: blue[500], '&:hover': { bgcolor: blue[700] } }}
            >
              Próximo
            </Button>
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ overflowY: 'auto', height: '100%' }}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  )
}
