import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { IRpYardimLog } from "@/repositories/RpYardimLogRepository";
import { MdCheckCircle, MdCancel } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
  helpRequest: IRpYardimLog | null;
  onResolve: (requestId: number) => void;
};

const HelpResolveDialog = ({ open, onClose, helpRequest, onResolve }: Props) => {
  const handleResolve = () => {
    if (helpRequest) {
      onResolve(helpRequest.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  if (!helpRequest) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'warning.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <MdCheckCircle size={24} />
        Hata Giderildi Mi?
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            {helpRequest.subject}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Makine: ${helpRequest.machineCode}`} 
                size="small" 
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`Zaman: ${formatDate(helpRequest.yardimTarihi)}`} 
                size="small" 
                color="secondary"
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              <strong>Host:</strong> {helpRequest.hostName}
            </Typography>
            
            {helpRequest.isemriNo && (
              <Typography variant="body2" color="text.secondary">
                <strong>İş Emri:</strong> {helpRequest.isemriNo}
              </Typography>
            )}
            
            {helpRequest.koliAdeti && (
              <Typography variant="body2" color="text.secondary">
                <strong>Koli Adeti:</strong> {helpRequest.koliAdeti}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 500 }}>
          Bu yardım isteği giderildi mi?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          startIcon={<MdCancel />}
          sx={{ minWidth: 100 }}
        >
          Hayır
        </Button>
        <Button
          onClick={handleResolve}
          variant="contained"
          color="success"
          startIcon={<MdCheckCircle />}
          sx={{ minWidth: 100 }}
        >
          Evet, Giderildi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpResolveDialog;
