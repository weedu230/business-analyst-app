import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StepIndicator from "@/components/step-indicator";
import ProjectForm from "@/components/project-form";
import StakeholderForm from "@/components/stakeholder-form";
import RequirementsForm from "@/components/requirements-form";
import AiAssistant from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { InsertProject, Stakeholder, FunctionalRequirement, NonFunctionalRequirement } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [projectData, setProjectData] = useState({
    name: "",
    domain: "",
    description: "",
  });
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [functionalRequirements, setFunctionalRequirements] = useState<FunctionalRequirement[]>([]);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<NonFunctionalRequirement[]>([]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created successfully!",
        description: "Proceeding to summary page...",
      });
      setLocation(`/summary/${project.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!projectData.name || !projectData.domain || !projectData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all project details before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const project: InsertProject = {
      ...projectData,
      stakeholders,
      functionalRequirements,
      nonFunctionalRequirements,
    };

    createProjectMutation.mutate(project);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.name && projectData.domain && projectData.description;
      case 2:
        return stakeholders.length > 0;
      case 3:
        return functionalRequirements.length > 0;
      default:
        return false;
    }
  };

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
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-muted-foreground">Your AI Business Analyst</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <StepIndicator currentStep={currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Let's Gather Your Project Requirements
                </h2>
                <p className="text-muted-foreground">
                  I'll guide you through collecting all the essential information for your project documentation.
                </p>
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <ProjectForm
                  data={projectData}
                  onChange={setProjectData}
                />
              )}

              {currentStep === 2 && (
                <StakeholderForm
                  stakeholders={stakeholders}
                  onChange={setStakeholders}
                />
              )}

              {currentStep === 3 && (
                <RequirementsForm
                  stakeholders={stakeholders}
                  functionalRequirements={functionalRequirements}
                  nonFunctionalRequirements={nonFunctionalRequirements}
                  onFunctionalChange={setFunctionalRequirements}
                  onNonFunctionalChange={setNonFunctionalRequirements}
                />
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-border mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  data-testid="button-previous"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    data-testid="button-next"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || createProjectMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createProjectMutation.isPending ? "Creating..." : "Proceed to Summary"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="lg:col-span-1">
            <AiAssistant
              currentStep={currentStep}
              stakeholderCount={stakeholders.length}
              functionalCount={functionalRequirements.length}
              nonFunctionalCount={nonFunctionalRequirements.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
