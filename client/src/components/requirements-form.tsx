import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Stakeholder, FunctionalRequirement, NonFunctionalRequirement } from "@shared/schema";
import { nanoid } from "nanoid";

interface RequirementsFormProps {
  stakeholders: Stakeholder[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  onFunctionalChange: (requirements: FunctionalRequirement[]) => void;
  onNonFunctionalChange: (requirements: NonFunctionalRequirement[]) => void;
}

export default function RequirementsForm({
  stakeholders,
  functionalRequirements,
  nonFunctionalRequirements,
  onFunctionalChange,
  onNonFunctionalChange,
}: RequirementsFormProps) {
  const [newFunctional, setNewFunctional] = useState({ stakeholderId: "", description: "" });
  const [nonFunctionalData, setNonFunctionalData] = useState({
    security: "",
    performance: "",
    usability: "",
    scalability: "",
  });
  const { toast } = useToast();

  const handleAddFunctional = () => {
    if (!newFunctional.stakeholderId || !newFunctional.description) {
      toast({
        title: "Missing Information",
        description: "Please select a stakeholder and enter a requirement description.",
        variant: "destructive",
      });
      return;
    }

    const requirement: FunctionalRequirement = {
      id: nanoid(),
      stakeholderId: newFunctional.stakeholderId,
      description: newFunctional.description,
    };

    onFunctionalChange([...functionalRequirements, requirement]);
    setNewFunctional({ stakeholderId: "", description: "" });
  };

  const handleRemoveFunctional = (id: string) => {
    onFunctionalChange(functionalRequirements.filter(r => r.id !== id));
  };

  const handleNonFunctionalChange = (category: keyof typeof nonFunctionalData, value: string) => {
    const updated = { ...nonFunctionalData, [category]: value };
    setNonFunctionalData(updated);

    // Update the requirements array
    const newRequirements = Object.entries(updated)
      .filter(([, description]) => description.trim())
      .map(([cat, description]) => ({
        id: `${cat}-${Date.now()}`,
        category: cat as "security" | "performance" | "usability" | "scalability",
        description,
      }));

    onNonFunctionalChange(newRequirements);
  };

  return (
    <div className="space-y-6">
      {/* Functional Requirements */}
      <div className="border-l-4 border-chart-3 pl-4">
        <h3 className="text-lg font-medium text-foreground mb-4">⚙️ Functional Requirements</h3>
        <div className="bg-accent p-4 rounded-md mb-4">
          <p className="text-sm text-accent-foreground">
            <Lightbulb className="inline mr-2 h-4 w-4 text-chart-4" />
            Write user stories in the format: "As a [role], I want [feature] so that [benefit]"
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Select
              value={newFunctional.stakeholderId}
              onValueChange={(value) => setNewFunctional({ ...newFunctional, stakeholderId: value })}
            >
              <SelectTrigger className="w-48" data-testid="select-functional-stakeholder">
                <SelectValue placeholder="Select stakeholder" />
              </SelectTrigger>
              <SelectContent>
                {stakeholders.map((stakeholder) => (
                  <SelectItem key={stakeholder.id} value={stakeholder.id}>
                    {stakeholder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="As a product manager, I want..."
              value={newFunctional.description}
              onChange={(e) => setNewFunctional({ ...newFunctional, description: e.target.value })}
              className="flex-1"
              data-testid="input-functional-description"
            />
            <Button onClick={handleAddFunctional} size="sm" data-testid="button-add-functional">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {functionalRequirements.map((req, index) => {
            const stakeholder = stakeholders.find(s => s.id === req.stakeholderId);
            return (
              <div
                key={req.id}
                className="bg-card border border-border p-4 rounded-md hover:shadow-sm transition-shadow"
                data-testid={`functional-requirement-${index}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {stakeholder?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, '0')}</span>
                    </div>
                    <p className="text-sm text-foreground">{req.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFunctional(req.id)}
                    className="text-destructive hover:text-destructive/80 ml-4"
                    data-testid={`button-remove-functional-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {functionalRequirements.length === 0 && (
            <p className="text-muted-foreground text-sm">No functional requirements added yet. Add at least one to continue.</p>
          )}
        </div>
      </div>

      {/* Non-Functional Requirements */}
      <div className="border-l-4 border-chart-4 pl-4">
        <h3 className="text-lg font-medium text-foreground mb-4">🛡️ Non-Functional Requirements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(nonFunctionalData).map(([category, value]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center capitalize">
                <i className="fas fa-shield-alt text-chart-4 mr-2"></i>
                {category}
              </h4>
              <Textarea
                rows={2}
                placeholder={`Describe ${category} requirements...`}
                value={value}
                onChange={(e) => handleNonFunctionalChange(category as keyof typeof nonFunctionalData, e.target.value)}
                className="text-sm resize-none"
                data-testid={`textarea-${category}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
