import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@shared/schema";

interface RequirementsChartProps {
  project: Project;
}

export default function RequirementsChart({ project }: RequirementsChartProps) {
  const functionalCount = project.functionalRequirements.length;
  const nonFunctionalCount = project.nonFunctionalRequirements.length;

  // Pie chart data
  const pieData = [
    { name: "Functional Requirements", value: functionalCount, color: "hsl(var(--chart-3))" },
    { name: "Non-Functional Requirements", value: nonFunctionalCount, color: "hsl(var(--chart-4))" },
  ];

  // Bar chart data - requirements by stakeholder
  const stakeholderData = project.stakeholders.map(stakeholder => {
    const requirementCount = project.functionalRequirements.filter(
      req => req.stakeholderId === stakeholder.id
    ).length;
    
    return {
      name: stakeholder.name,
      requirements: requirementCount,
    };
  });

  if (functionalCount === 0 && nonFunctionalCount === 0) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Requirements Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No requirements data to display
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requirements by Stakeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No stakeholder data to display
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements by Stakeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stakeholderData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis label={{ value: 'Number of Requirements', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="requirements" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
