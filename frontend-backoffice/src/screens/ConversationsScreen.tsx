import { Grid } from "@mui/material";
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";

export function ConversationsScreen() {
  let user;
  try {
    user = useAuthenticatedUser()
  } catch (err) {
    return (<div>Loading or not authenticated</div>)
  }

  const accessToken = useAccessToken()

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/conversations', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        count: number
        conversations: IConversation[]
      }
    },
  })

  // const count = useMemo(() => {
  //   return query.data?.count ?? NaN
  // }, [query.data?.count])

  const conversations = query.data?.conversations ?? null

  return (
    <Grid container spacing={2} pl={0.1}>
      <Grid item xs={2}>
        <Grid container spacing={1}>
          {conversations?.filter(conversation => {
            if (user.profile === "sudo") return conversation
            else return conversation.IUser?.id === user.id
          })
          .map(conversation => (
            <Grid item key={`conversations:${conversation.id}`}>
              <ConversationItem conversation={conversation}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  )
}
