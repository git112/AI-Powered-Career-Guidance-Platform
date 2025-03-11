import {
  FaArrowUp,
  FaChartBar,
  FaInfoCircle,
  FaCheck,
  FaBell,
  FaSearch,
  FaBullhorn,
  FaRocket,
  FaFire,
  FaCalendar,
} from "react-icons/fa"
import SalaryRangesChart from "../components/charts/SalaryRanges"
import SkillsVsMarketChart from "../components/charts/skillVsmarket"

function IndustryInsightsPage() {
  const companies = [
    { name: "Google", positions: 2 },
    { name: "Microsoft", positions: 1 },
    { name: "Amazon", positions: 1 },
  ]

  const courses = [
    { name: "AWS Certified Developer", platform: "Udemy" },
    { name: "Full Stack Mastery", platform: "Coursera" },
  ]

  const insights = [
    {
      icon: FaCheck,
      title: "User Market Readiness: 75% Ready 🚀",
    },
    {
      icon: FaBell,
      title: "Live Job Alerts: Google, Amazon Hiring",
    },
    {
      icon: FaSearch,
      title: "Industry Trends: AI, Blockchain, Cybersecurity",
    },
    {
      icon: FaBullhorn,
      title: 'Networking Event: "Tech Summit 2025" 🎤',
    },
  ]

  const actions = [
    {
      icon: FaRocket,
      title: "Learn AWS for better pay",
    },
    {
      icon: FaFire,
      title: "Apply for Microsoft SWE Role",
    },
    {
      icon: FaCalendar,
      title: "Attend Google Cloud Workshop",
    },
  ]

  return (
    <div className="dashboard-container p-6 bg-zinc-950 min-h-screen pt-20">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold text-cyan-100">Industry Insights</h1>
        <p className="text-cyan-50/80">Last updated: 26/01/2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-cyan-100">Market Outlook</div>
            <FaArrowUp className="text-2xl text-cyan-50" />
          </div>
          <div className="text-3xl font-bold text-cyan-50 mb-2">Positive</div>
          <p className="text-sm text-cyan-100/70">Next update in about 1 month</p>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-cyan-100">Industry Growth</div>
            <FaChartBar className="text-2xl text-cyan-50" />
          </div>
          <div className="text-3xl font-bold text-cyan-50 mb-2">7.5%</div>
          <div className="bg-zinc-800 h-2 rounded-full">
            <div className="bg-cyan-100/80 h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-cyan-100">Demand Level</div>
            <FaInfoCircle
              className="text-2xl text-cyan-50"
              title="Overall demand for professionals in this industry"
            />
          </div>
          <div className="text-3xl font-bold text-cyan-50 mb-2">High</div>
          <div className="bg-zinc-800 h-2 rounded-full">
            <div className="bg-cyan-100/80 h-2 rounded-full" style={{ width: "90%" }}></div>
          </div>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-cyan-100">Top Skills</div>
            <FaInfoCircle className="text-2xl text-cyan-50" title="Most in-demand skills in the industry" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Python", "JavaScript", "Cloud Computing", "AWS", "Agile"].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-cyan-100/20 rounded-full text-sm text-cyan-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow lg:col-span-3">
          <div className="mb-4">
            <div className="text-xl font-semibold text-cyan-100">Salary Ranges by Role</div>
            <p className="text-sm text-cyan-50/80">Displaying minimum, median, and maximum salaries (in thousands)</p>
          </div>
          <div className="h-[400px]">
            <SalaryRangesChart />
          </div>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow lg:col-span-2">
          <div className="mb-4">
            <div className="text-xl font-semibold text-cyan-100">User Skills vs Market Demand</div>
            <p className="text-sm text-cyan-50/80">Compare your skills with current market demand</p>
          </div>
          <div className="h-[300px]">
            <SkillsVsMarketChart />
          </div>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="text-xl font-semibold text-cyan-100 mb-4">Expected Salary</div>
          <div className="text-3xl font-bold text-cyan-50 mb-2">
            $75,000 - $90,000 <span className="text-sm text-cyan-100/70">/yr</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-cyan-100">
              <span>Skill-Based Salary Boost:</span>
              <span className="font-medium text-cyan-50">+$10K</span>
            </div>
            <div className="text-sm text-cyan-100/70">(Learning AWS)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="text-xl font-semibold text-cyan-100 mb-4">Top Companies Hiring</div>
          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.name} className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100/10 rounded-full">
                  <FaCheck className="text-cyan-50 w-4 h-4" />
                </div>
                <span className="text-cyan-50">{company.name}</span>
              </div>
            ))}
            <p className="text-sm text-cyan-100/70 pt-2">Open Positions: Software Engineer (4)</p>
          </div>
        </div>

        <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
          <div className="text-xl font-semibold text-cyan-100 mb-4">Recommended Courses</div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.name} className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100/10 rounded-full">
                  <FaCheck className="text-cyan-50 w-4 h-4" />
                </div>
                <div>
                  <div className="text-cyan-50">"{course.name}"</div>
                  <div className="text-sm text-cyan-100">({course.platform})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow mb-8">
        <div className="text-xl font-semibold text-cyan-100 mb-4">Quick Insights & Actions</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100/10 rounded-full">
                <insight.icon className="text-cyan-50 w-4 h-4" />
              </div>
              <span className="text-cyan-50 text-sm">{insight.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-zinc-900/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-100/10 transition-shadow">
        <div className="text-xl font-semibold text-cyan-100 mb-4">Next Actions</div>
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100/10 rounded-full">
                <action.icon className="text-cyan-50 w-4 h-4" />
              </div>
              <div className="text-cyan-50">
                {index + 1}. {action.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IndustryInsightsPage