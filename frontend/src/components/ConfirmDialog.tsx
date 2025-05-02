import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface ConfirmDialogProps {
  confirmDialogOpen: boolean;
  existingVersions: string[];
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  handleConfirmUseExisting: () => void;
  handleConfirmCreateNew: () => void;
  setConfirmDialogOpen: (open: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmDialogOpen,
  existingVersions,
  selectedVersion,
  setSelectedVersion,
  handleConfirmUseExisting,
  handleConfirmCreateNew,
  setConfirmDialogOpen
}) => {
  return (
    <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
      <DialogTitle>PDF Already Processed</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This PDF has already been processed. Would you like to use an existing version 
          or process it again (which will create a new version)?
        </DialogContentText>
        
        {existingVersions.length > 0 && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="version-select-label">Select Version</InputLabel>
            <Select
              labelId="version-select-label"
              value={selectedVersion}
              label="Select Version"
              onChange={(e: SelectChangeEvent) => setSelectedVersion(e.target.value)}
            >
              {existingVersions.map((version) => (
                <MenuItem key={version} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmUseExisting} color="primary">
          Use Existing
        </Button>
        <Button onClick={handleConfirmCreateNew} color="secondary">
          Process Again
        </Button>
        <Button onClick={() => setConfirmDialogOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 