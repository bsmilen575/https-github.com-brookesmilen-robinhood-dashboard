import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  recordsCount?: number;
  facilitiesCount?: number;
}

export default function DataUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'upload-1',
      fileName: 'weekly_testing_data_2025_wk44.xlsx',
      uploadedBy: 'Gen. James Mattis',
      uploadedAt: '2025-11-01 14:32',
      status: 'completed',
      recordsCount: 1247,
      facilitiesCount: 133,
    },
    {
      id: 'upload-2',
      fileName: 'weekly_testing_data_2025_wk43.xlsx',
      uploadedBy: 'Gen. David Petraeus',
      uploadedAt: '2025-10-25 09:15',
      status: 'completed',
      recordsCount: 1198,
      facilitiesCount: 133,
    },
    {
      id: 'upload-3',
      fileName: 'weekly_testing_data_2025_wk42.xlsx',
      uploadedBy: 'Gen. Lloyd Austin',
      uploadedAt: '2025-10-18 16:45',
      status: 'completed',
      recordsCount: 1156,
      facilitiesCount: 131,
    },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.map(f => f.name));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files.map(f => f.name));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500 text-white text-xs">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500 text-white text-xs">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white text-xs">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Data Upload Portal</h1>
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">STEP 1</span>
        </div>
        <p className="text-sm text-muted-foreground">Upload weekly testing data from DoD lab facilities</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">Upload Weekly Testing Data</CardTitle>
          <CardDescription>
            Upload Excel (.xlsx, .xls) or CSV files containing test kit inventory, burn rates, and facility status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-md p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border/50 hover:border-border hover:bg-muted/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-testid="dropzone-upload"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Drag and drop your files here</h3>
                <p className="text-sm text-muted-foreground">or</p>
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" size="default" asChild>
                    <span className="cursor-pointer" data-testid="button-browse-files">
                      Browse Files
                    </span>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    data-testid="input-file-upload"
                  />
                </label>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Supported formats: .xlsx, .xls, .csv (Max 50MB per file)</span>
              </div>
            </div>
          </div>

          {/* Expected Data Format */}
          <div className="mt-6 p-4 bg-muted/30 rounded-md border border-border/40">
            <h4 className="text-sm font-semibold mb-2">Expected Data Columns:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Facility Name</div>
              <div>• Location (City, State, Country)</div>
              <div>• Test Kits on Hand</div>
              <div>• Weekly Burn Rate</div>
              <div>• Machine Type</div>
              <div>• Service Branch</div>
              <div>• Last Updated Date</div>
              <div>• Coordinates (Latitude, Longitude)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">Upload History</CardTitle>
          <CardDescription>Recent data uploads and their processing status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="px-6 py-4 hover-elevate transition-colors"
                data-testid={`upload-history-${file.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getStatusIcon(file.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{file.fileName}</h4>
                        {getStatusBadge(file.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>Uploaded by {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{file.uploadedAt}</span>
                        {file.recordsCount && (
                          <>
                            <span>•</span>
                            <span>{file.recordsCount.toLocaleString()} records</span>
                          </>
                        )}
                        {file.facilitiesCount && (
                          <>
                            <span>•</span>
                            <span>{file.facilitiesCount} facilities</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-download-${file.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">Data Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                1
              </div>
              <div>
                <strong className="text-foreground">Collect Data:</strong> Gather weekly testing data from all 133 DoD lab facilities under your command
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                2
              </div>
              <div>
                <strong className="text-foreground">Format Check:</strong> Ensure your file includes all required columns (Facility Name, Test Kits, Burn Rate, etc.)
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                3
              </div>
              <div>
                <strong className="text-foreground">Upload:</strong> Drag and drop your file or use the browse button above
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                4
              </div>
              <div>
                <strong className="text-foreground">Processing:</strong> Robinhood will pre-process, clean, and consolidate the data, then run supply and capacity calculations
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                5
              </div>
              <div>
                <strong className="text-foreground">Dashboard Update:</strong> The main dashboard will update with the latest data to serve as next week's COVID-19 test control tower
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
