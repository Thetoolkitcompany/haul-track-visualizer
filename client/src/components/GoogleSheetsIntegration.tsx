
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  RotateCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

interface GoogleSheetsIntegrationProps {
  shipmentsCount: number;
}

const GoogleSheetsIntegration = ({ shipmentsCount }: GoogleSheetsIntegrationProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncToSheetsMutation = useMutation({
    mutationFn: () => apiRequest('/api/sheets/sync-all', { method: 'POST' }),
    onSuccess: () => {
      setLastSync(new Date());
      toast({
        title: "Sync Successful",
        description: "All shipments have been synced to Google Sheets",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Failed to sync to Google Sheets",
      });
    },
  });

  const importFromSheetsMutation = useMutation({
    mutationFn: () => apiRequest('/api/sheets/import', { method: 'POST' }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      toast({
        title: "Import Successful",
        description: `Imported ${data.count} shipments from Google Sheets`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "Failed to import from Google Sheets",
      });
    },
  });

  const isConfigured = process.env.NODE_ENV === 'production' || 
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Google Sheets Integration
          </CardTitle>
          <CardDescription>
            Sync your shipment data with Google Sheets for enhanced data management and collaboration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConfigured && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Google Sheets integration requires API credentials to be configured. Contact your administrator to set up the integration.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Database Records</p>
                <p className="text-2xl font-bold">{shipmentsCount}</p>
              </div>
              <Badge variant="outline">Local</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Last Sync</p>
                <p className="text-sm text-gray-600">
                  {lastSync ? lastSync.toLocaleString() : 'Never'}
                </p>
              </div>
              {lastSync && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm">
                  {isConfigured ? (
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  ) : (
                    <Badge variant="secondary">Not Configured</Badge>
                  )}
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sync Operations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Export to Sheets
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Send all current shipment data to Google Sheets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => syncToSheetsMutation.mutate()}
                    disabled={syncToSheetsMutation.isPending || !isConfigured}
                    className="w-full"
                    variant="default"
                  >
                    {syncToSheetsMutation.isPending ? (
                      <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Sync to Sheets
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Import from Sheets
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Import shipment data from Google Sheets to database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => importFromSheetsMutation.mutate()}
                    disabled={importFromSheetsMutation.isPending || !isConfigured}
                    className="w-full"
                    variant="outline"
                  >
                    {importFromSheetsMutation.isPending ? (
                      <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Import from Sheets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Setup Instructions</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>To configure Google Sheets integration:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Create a Google Cloud Project and enable the Sheets API</li>
                <li>Create a service account and download the credentials</li>
                <li>Share your Google Sheet with the service account email</li>
                <li>Add the required environment variables to your deployment</li>
              </ol>
              <p className="mt-3 text-xs">
                <strong>Required variables:</strong> GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSheetsIntegration;
