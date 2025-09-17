import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Stakeholder } from "@shared/schema";
import { nanoid } from "nanoid";

interface StakeholderFormProps {
  stakeholders: Stakeholder[];
  onChange: (stakeholders: Stakeholder[]) => void;
}

export default function StakeholderForm({ stakeholders, onChange }: StakeholderFormProps) {
  const [newStakeholder, setNewStakeholder] = useState({ name: "", role: "" });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newStakeholder.name || !newStakeholder.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and role for the stakeholder.",
        variant: "destructive",
      });
      return;
    }

    const stakeholder: Stakeholder = {
      id: nanoid(),
      name: newStakeholder.name,
      role: newStakeholder.role,
    };

    onChange([...stakeholders, stakeholder]);
    setNewStakeholder({ name: "", role: "" });
  };

  const handleRemove = (id: string) => {
    onChange(stakeholders.filter(s => s.id !== id));
  };

  return (
    <div className="border-l-4 border-chart-2 pl-4">
      <h3 className="text-lg font-medium text-foreground mb-4">👥 Stakeholders</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Stakeholder name"
            value={newStakeholder.name}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
            className="flex-1"
            data-testid="input-stakeholder-name"
          />
          <Select
            value={newStakeholder.role}
            onValueChange={(value) => setNewStakeholder({ ...newStakeholder, role: value })}
          >
            <SelectTrigger className="w-48" data-testid="select-stakeholder-role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product Manager">Product Manager</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="End User">End User</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} size="sm" data-testid="button-add-stakeholder">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {stakeholders.map((stakeholder, index) => (
          <div
            key={stakeholder.id}
            className="flex items-center justify-between bg-secondary p-3 rounded-md"
            data-testid={`stakeholder-item-${index}`}
          >
            <div>
              <span className="font-medium text-foreground">{stakeholder.name}</span>
              <span className="text-sm text-muted-foreground ml-2">{stakeholder.role}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(stakeholder.id)}
              className="text-destructive hover:text-destructive/80"
              data-testid={`button-remove-stakeholder-${index}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {stakeholders.length === 0 && (
          <p className="text-muted-foreground text-sm">No stakeholders added yet. Add at least one to continue.</p>
        )}
      </div>
    </div>
  );
}
