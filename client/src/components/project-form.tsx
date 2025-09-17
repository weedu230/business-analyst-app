import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectFormProps {
  data: {
    name: string;
    domain: string;
    description: string;
  };
  onChange: (data: { name: string; domain: string; description: string }) => void;
}

export default function ProjectForm({ data, onChange }: ProjectFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="border-l-4 border-primary pl-4">
      <h3 className="text-lg font-medium text-foreground mb-4">📋 Project Overview</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="project-name" className="text-sm font-medium text-foreground mb-2">
            Project Name *
          </Label>
          <Input
            id="project-name"
            type="text"
            placeholder="e.g., Customer Portal Redesign"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            data-testid="input-project-name"
          />
        </div>
        
        <div>
          <Label htmlFor="project-domain" className="text-sm font-medium text-foreground mb-2">
            Domain/Industry *
          </Label>
          <Select value={data.domain} onValueChange={(value) => handleChange("domain", value)}>
            <SelectTrigger data-testid="select-project-domain">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="project-description" className="text-sm font-medium text-foreground mb-2">
            Project Description *
          </Label>
          <Textarea
            id="project-description"
            rows={3}
            placeholder="Describe the main goals and scope of this project..."
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="resize-none"
            data-testid="textarea-project-description"
          />
        </div>
      </div>
    </div>
  );
}
