import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Edit, Users, Cog, Shield, CheckCircle } from "lucide-react";
import RequirementsChart from "@/components/charts";
import type { Project } from "@shared/schema";

export default function Summary() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

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

  const functionalCount = project.functionalRequirements.length;
  const nonFunctionalCount = project.nonFunctionalRequirements.length;
  const stakeholderCount = project.stakeholders.length;

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
        <div className="space-y-8">
          {/* Summary Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground" data-testid="text-project-name">
                    {project.name}
                  </h2>
                  <p className="text-muted-foreground" data-testid="text-project-domain">
                    {project.domain} • Created today
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-edit">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={() => setLocation(`/report/${project.id}`)} data-testid="button-generate-report">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>
              <p className="text-foreground" data-testid="text-project-description">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stakeholders</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="text-stakeholder-count">
                      {stakeholderCount}
                    </p>
                  </div>
                  <Users className="text-chart-2 h-8 w-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Functional Req.</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="text-functional-count">
                      {functionalCount}
                    </p>
                  </div>
                  <Cog className="text-chart-3 h-8 w-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Non-Functional</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="text-non-functional-count">
                      {nonFunctionalCount}
                    </p>
                  </div>
                  <Shield className="text-chart-4 h-8 w-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion</p>
                    <p className="text-2xl font-bold text-foreground">
                      {functionalCount > 0 && nonFunctionalCount > 0 && stakeholderCount > 0 ? "100%" : "Incomplete"}
                    </p>
                  </div>
                  <CheckCircle className="text-chart-1 h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <RequirementsChart project={project} />

          {/* Detailed Requirements */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Functional Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cog className="text-chart-3 mr-2 h-5 w-5" />
                  Functional Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.functionalRequirements.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No functional requirements defined yet.</p>
                  ) : (
                    project.functionalRequirements.map((req, index) => {
                      const stakeholder = project.stakeholders.find(s => s.id === req.stakeholderId);
                      return (
                        <div key={req.id} className="border border-border rounded-md p-4" data-testid={`requirement-functional-${index}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {stakeholder?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, '0')}</span>
                          </div>
                          <p className="text-sm text-foreground">{req.description}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Non-Functional Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="text-chart-4 mr-2 h-5 w-5" />
                  Non-Functional Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.nonFunctionalRequirements.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No non-functional requirements defined yet.</p>
                  ) : (
                    project.nonFunctionalRequirements.map((req, index) => (
                      <div key={req.id} className="border-l-4 border-chart-4 pl-4" data-testid={`requirement-non-functional-${index}`}>
                        <h4 className="font-medium text-foreground mb-1 capitalize">{req.category}</h4>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stakeholders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="text-chart-2 mr-2 h-5 w-5" />
                Project Stakeholders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.stakeholders.length === 0 ? (
                  <p className="text-muted-foreground text-sm col-span-full">No stakeholders defined yet.</p>
                ) : (
                  project.stakeholders.map((stakeholder, index) => (
                    <div key={stakeholder.id} className="flex items-center space-x-3 p-3 bg-secondary rounded-md" data-testid={`stakeholder-${index}`}>
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        {stakeholder.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{stakeholder.name}</p>
                        <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-back-edit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <Button onClick={() => setLocation(`/report/${project.id}`)} data-testid="button-generate-professional-report">
              <Download className="mr-2 h-4 w-4" />
              Generate Professional Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
