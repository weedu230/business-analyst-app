interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Collect Requirements", subtitle: "Gather project details" },
    { number: 2, title: "View Summary", subtitle: "Review & validate" },
    { number: 3, title: "Download Report", subtitle: "Generate documentation" },
  ];

  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center space-x-3 step-indicator relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    step.number <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                  data-testid={`step-indicator-${step.number}`}
                >
                  {step.number}
                </div>
                <div>
                  <div
                    className={`font-medium transition-colors ${
                      step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{step.subtitle}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-full w-8 h-0.5 transition-colors ${
                      step.number < currentStep ? "bg-primary" : "bg-border"
                    }`}
                    style={{ transform: "translateX(2rem)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
