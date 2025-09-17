import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Info, CheckCircle } from "lucide-react";

interface AiAssistantProps {
  currentStep: number;
  stakeholderCount: number;
  functionalCount: number;
  nonFunctionalCount: number;
}

export default function AiAssistant({
  currentStep,
  stakeholderCount,
  functionalCount,
  nonFunctionalCount,
}: AiAssistantProps) {
  const getStepTip = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <Lightbulb className="text-chart-4 mr-2 h-4 w-4" />,
          title: "Tip:",
          content: "Be specific about your project scope. Include the main business objectives and expected outcomes.",
        };
      case 2:
        return {
          icon: <Info className="text-chart-2 mr-2 h-4 w-4" />,
          title: "Tip:",
          content: "Add diverse stakeholders with different perspectives. Include both technical and business roles.",
        };
      case 3:
        return {
          icon: <Lightbulb className="text-chart-4 mr-2 h-4 w-4" />,
          title: "Tip:",
          content: "Good user stories are specific, measurable, and focus on user value. Include the 'so that' part to explain the benefit.",
        };
      default:
        return null;
    }
  };

  const getProgressMessage = () => {
    const total = stakeholderCount + functionalCount + nonFunctionalCount;
    if (total === 0) return "Get started by filling in the project details.";
    
    const messages = [];
    if (stakeholderCount > 0) messages.push(`${stakeholderCount} stakeholder${stakeholderCount > 1 ? 's' : ''}`);
    if (functionalCount > 0) messages.push(`${functionalCount} functional requirement${functionalCount > 1 ? 's' : ''}`);
    if (nonFunctionalCount > 0) messages.push(`${nonFunctionalCount} non-functional categor${nonFunctionalCount > 1 ? 'ies' : 'y'}`);
    
    return `Progress: You've added ${messages.join(', ')}.`;
  };

  const tip = getStepTip();

  return (
    <Card className="sticky top-8">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <i className="fas fa-robot text-primary-foreground text-sm"></i>
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Your requirements guide</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {tip && (
            <div className="bg-accent p-3 rounded-md">
              <p className="text-accent-foreground">
                {tip.icon}
                <strong>{tip.title}</strong> {tip.content}
              </p>
            </div>
          )}

          <div className="bg-muted p-3 rounded-md">
            <p className="text-muted-foreground">
              <Info className="text-chart-2 mr-2 h-4 w-4 inline" />
              <strong>Progress:</strong> {getProgressMessage()}
            </p>
          </div>

          {currentStep === 3 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Quick Examples:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="text-chart-2 mr-2 mt-0.5 h-3 w-3" />
                  <span>"As an admin, I want to manage user permissions..."</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-chart-2 mr-2 mt-0.5 h-3 w-3" />
                  <span>"As a customer, I want to track my order status..."</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
