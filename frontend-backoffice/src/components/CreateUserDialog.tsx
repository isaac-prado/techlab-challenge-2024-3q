import React, { useContext } from "react";
import { api } from "../services/api";
import { IUserCreateForm } from "../interfaces/IUserCreateForm";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export function CreateUserDialog({ open, onClose }: { open: boolean, onClose: () => void}) {
    const { accessToken } = useContext(AuthenticationContext)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IUserCreateForm>();

    const createUserMutation = useMutation({
        mutationFn: async (data: IUserCreateForm) => {
          await api.post('/users', data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        },
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (error) => {
          console.error('Error creating user:', error);
        },
      });

    const onSubmit = async (data: IUserCreateForm) => {
        createUserMutation.mutate(data);
        reset();
        onClose();
    };

    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Username"
                        {...register('username', { required: 'Username is required' })}
                        margin="normal"
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        {...register('email', { 
                            required: 'E-mail is required',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'E-mail is not valid'
                            }
                         })}
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        {...register('password', { 
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must have at least 6 characters'
                            }
                        })}
                        margin="normal"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="profile-label">Profile</InputLabel>
                        <Select
                            labelId="profile-label"
                            label="Profile"
                            {...register('profile', { required: 'Profile is required' })}
                            defaultValue="standard"
                        >
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="sudo">Sudo</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={createUserMutation.isPending}>
                        Create User
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}