import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Plus, Eye, FileText, Check } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const handleDownload = async () => {
    if (!project) return;

    try {
      await generatePDF(project);
      toast({
        title: "Report Downloaded",
        description: "Your professional requirements document has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load project</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const filename = `${project.name.replace(/\s+/g, '-')}-Requirements.pdf`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground text-sm"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">RequirementBot</h1>
                <p className="text-xs text-muted-foreground">Professional Requirement Gathering</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-primary-foreground h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Report Generated Successfully!
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Your professional requirements document has been created and is ready for download.
              </p>

              <div className="bg-accent rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="text-destructive h-8 w-8" />
                    <div className="text-left">
                      <p className="font-medium text-accent-foreground" data-testid="text-report-filename">
                        {filename}
                      </p>
                      <p className="text-sm text-muted-foreground">PDF Document</p>
                    </div>
                  </div>
                  <Button onClick={handleDownload} data-testid="button-download-report">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="text-left space-y-4 text-sm">
                <h3 className="font-medium text-foreground">Your report includes:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Professional cover page with project details
                  </li>
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Complete stakeholder analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Detailed functional requirements list
                  </li>
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Non-functional requirements documentation
                  </li>
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Visual charts and analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="text-chart-2 mr-3 h-4 w-4" />
                    Executive summary and recommendations
                  </li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-new-project">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
                <Button onClick={() => setLocation(`/summary/${project.id}`)} data-testid="button-view-summary">
                  <Eye className="mr-2 h-4 w-4" />
                  View Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
