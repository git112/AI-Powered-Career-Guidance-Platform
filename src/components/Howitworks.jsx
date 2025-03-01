import React from "react";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Sign Up & Set Up Your Profile",
    description:
      "Create an account, fill in your details, and let our AI get to know you.",
  },
  {
    number: "2",
    title: "Take the Smart Competency Test",
    description:
      "Answer a few fun questions and get your competency score.",
  },
  {
    number: "3",
    title: "Discover Your Skill Gaps",
    description:
      "Identify missing skills and get course recommendations.",
  },
  {
    number: "4",
    title: "Get AI-Powered Job & Training Recommendations",
    description:
      "Find the best jobs and courses tailored to your profile.",
  },
  {
    number: "5",
    title: "Build Your Resume in Seconds",
    description:
      "Create a professional, ATS-optimized resume effortlessly.",
  },
  {
    number: "6",
    title: "Negotiate Like a Pro with AI Coaching",
    description:
      "Get personalized salary ranges and practice negotiation tips.",
  },
  {
    number: "7",
    title: "Stay Ahead with Real-Time Job Market Insights",
    description:
      "Explore trending skills and in-demand jobs.",
  },
  {
    number: "8",
    title: "Apply & Start Your Career Journey!",
    description:
      "Click, apply, and land the job! With everything in one place, getting hired has never been this easy!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 overflow-hidden bg-background" id="how-it-works">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-cyan-100 mb-8">🚀 How It Works</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            
            <div key={index} className=" p-6 rounded-lg relative bg-muted/20 text-cyan-50 border">
              
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background border text-cyan-50 text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full">
                {step.number}
              </span>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-100 mb-2 pt-3">
                  {step.title}
                </h3>
                <p className="text-cyan-50 text-muted-foreground pt-3">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
