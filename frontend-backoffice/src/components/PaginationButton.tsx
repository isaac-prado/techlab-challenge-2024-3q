import React from 'react';
import { Button, Box } from "@mui/material";
import { blue, teal } from "@mui/material/colors";

interface PaginationButtonProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <Box
      position={'relative'}
      display="fixed"
      zIndex={1000}
      sx={{ 
        display: 'flex',
        gap: 2,
        padding: '8px',
        bgcolor: 'white',
        borderRadius: '8px', 
        boxShadow: 3
      }}
    >
      <Button
        variant="contained"
        onClick={handlePreviousPage}
        disabled={page === 1}
        sx={{ 
            mr: 2, 
            bgcolor: teal[500], 
            '&:hover': { bgcolor: teal[700] }
        }}
      >
        Anterior
      </Button>
      <Button
        variant="contained"
        onClick={handleNextPage}
        disabled={page === totalPages}
        sx={{ 
            bgcolor: blue[500], 
            '&:hover': { bgcolor: blue[700] }
        }}
      >
        Próximo
      </Button>
    </Box>
  );
};
