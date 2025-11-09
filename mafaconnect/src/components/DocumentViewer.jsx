import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image"lucide-react";

export function DocumentViewer({ documentUrl, documentName, open, onOpenChange }: DocumentViewerProps) {
  const [imageError, setImageError] = useState(false);
  
  const isPDF = documentName.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentName);

  const handleDownload = () => {
    window.open(documentUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              {documentName}
            </span>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex items-center justify-center bg-muted rounded-lg overflow-hidden" style={{ minHeight
          {isPDF && (
            <iframe
              src={documentUrl}
              className="w-full h-[600px]"
              title={documentName}
            />
          )}
          
          {isImage && !imageError && (
            <img
              src={documentUrl}
              alt={documentName}
              className="max-w-full max-h-[600px] object-contain"
              onError={() => setImageError(true)}
            />
          )}
          
          {(!isPDF && !isImage) || imageError && (
            <div className="text-center p-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
