import React from "react";
import { Card, CardContent, CardTitle, CardHeader } from "../components/ui/card";
import { FaBriefcase, FaBrain, FaRobot, FaChartBar, FaFileAlt, FaGlobe, FaDollarSign } from "react-icons/fa";

const features = [
 
  {
    icon: <FaBrain size={30} className="text-cyan-50"  />,
    title: "Smart Competency Test & Score",
    description: "Answer a few insightful questions, and we'll calculate your competency score to match you with the perfect job or training.",
  },
  {
    icon: <FaChartBar size={30} className="text-cyan-50"  />,
    title: "Skill Gap Analyzer",
    description: "Identifies missing skills and recommends tailored courses to boost your profile.",
  },
  {
    icon: <FaRobot size={30} className="text-cyan-50"  />,
    title: "AI-Powered Job & Course Recommendations",
    description: "Our AI analyzes your skills & preferences to suggest the best job opportunities and learning paths.",
  },
  
  {
    icon: <FaFileAlt size={30} className="text-cyan-50"  />,
    title: "Automated Resume Wizard",
    description: "Builds your resume instantly, optimized for ATS & tailored to your skills.",
  },
  {
    icon: <FaGlobe size={30} className="text-cyan-50"  />,
    title: "Real-Time Job Market Dashboard",
    description: "Get live insights on trending jobs, in-demand skills, and salary benchmarks.",
  },
  {
    icon: <FaDollarSign size={30} className="text-cyan-50"  />,
    title: "AI-Powered Salary Negotiation Coach",
    description: "Receive optimal salary ranges and personalized negotiation tips, simulate real-life negotiations with our AI-powered mock recruiter.",
  },
  
  
];


const Features = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-cyan-100">
      🚀 JobNest Features
      </h2>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border transform  duration-500 shadow-lg rounded-2xl hover:bg-transparent
    hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400 hover:border-cyan-400 hover:border-2 h-60 w-auto"
          >
            <CardContent className="pt-6 text-center flex flex-row items-center">
              <div className="flex flex-col items-center justify-center color-cyan-50">
                {feature.icon}
                <h3 className="text-xl font-bold mb-2 text-cyan-100 pt-2">{feature.title}</h3>
                <p className="text-muted-foreground text-cyan-50 pt-2">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  )
}

export default Features