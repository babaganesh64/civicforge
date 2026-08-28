import React, { useRef, useState } from 'react';
import { EvidenceItem } from '@/types/challenge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, FileImage, FileIcon, Download, UploadCloud, Loader2 } from 'lucide-react';
import { useUploadEvidence } from '@/hooks/useChallenges';
import { toast } from 'sonner';

interface EvidenceListProps {
  challengeId: string;
  evidence: EvidenceItem[];
  canUpload?: boolean;
}

export function EvidenceList({ challengeId, evidence, canUpload = true }: EvidenceListProps) {
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadEvidence(challengeId);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      await uploadMutation.mutateAsync({ file, description });
      toast.success('Evidence uploaded successfully');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Failed to upload evidence');
    }
  };

  return (
    <div className="space-y-6">
      {canUpload && (
        <Card className="border-dashed">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploadMutation.isPending}
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.mp4"
            />
            <Button 
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className="w-full sm:w-auto shrink-0"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Add Evidence
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {evidence.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/50">
          <FileIcon className="mx-auto h-8 w-8 mb-2 opacity-20" />
          <p>No evidence attached yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {evidence.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex items-center p-3 gap-3">
                <div className="bg-muted p-2 rounded">
                  {getFileIcon(item.fileName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.fileName}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/api/v1/files/${item.fileId}`} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
