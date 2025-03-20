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
  FaUser,
  FaLightbulb,
  FaBriefcase,
  FaGraduationCap,
  FaChartLine
} from "react-icons/fa";
import SalaryRangesChart from "../components/charts/SalaryRanges";
import SkillsVsMarketChart from "../components/charts/skillVsmarket";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import TopCompaniesTable from "../components/tables/TopCompaniesTable";
import RecommendedCoursesTable from "../components/tables/RecommendedCoursesTable";
import InsightCard from "../components/cards/InsightCard";
import ActionCard from "../components/cards/ActionCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const NextActionsSection = ({ nextActions }) => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
      <FaLightbulb className="mr-2 text-yellow-400" />
      Recommended Actions
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nextActions.map((action, index) => (
        <div 
          key={index}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-lg border border-zinc-700 hover:border-cyan-500 transition-all shadow-lg h-full"
        >
          <div className="flex items-start h-full">
            <div className="bg-cyan-800/30 p-3 rounded-full mr-4 flex-shrink-0">
              <FaCheck className="text-cyan-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-cyan-50 mb-1">{action.title}</h4>
              <p className="text-zinc-400 text-sm">{action.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function IndustryInsightsPage() {
  const [insightData, setInsightData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }
        const userRes = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(userRes.data);
        console.log("User data loaded:", userRes.data);
        if (!userRes.data.industry) {
          navigate('/onboarding');
          return;
        }
        const insightRes = await api.get("/api/industry-insights/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Industry insights loaded:", insightRes.data);
        setInsightData(insightRes.data);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Failed to load industry insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-zinc-900 to-black">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-cyan-400 mt-4 animate-pulse">Loading industry insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4">
        <div className="bg-zinc-800/70 p-8 rounded-xl border border-red-500/30 shadow-lg max-w-md w-full">
          <div className="text-red-400 text-xl mb-4 flex items-center">
            <FaInfoCircle className="mr-3 text-2xl" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!insightData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4">
        <div className="bg-zinc-800/70 p-8 rounded-xl border border-cyan-500/30 shadow-lg max-w-md w-full">
          <div className="text-cyan-400 text-xl mb-4 flex justify-center items-center">
            <FaInfoCircle className="mr-3 text-2xl" />
            <span>No insights available yet</span>
          </div>
          <p className="text-zinc-400 mb-6 text-center">
            We couldn't find any industry insights for your profile. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const { 
    industryOverview, 
    marketDemand, 
    salaryRanges, 
    expectedSalaryRange,
    skillBasedBoosts,
    topCompanies,
    recommendedCourses,
    careerPathInsights,
    emergingTrends,
    nextActions
  } = insightData;

  const handleProfileUpdate = async (updatedProfile) => {
    setUserData(updatedProfile);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const insightRes = await api.get("/api/industry-insights/user", {
        params: { industry: updatedProfile.industry || "Software Development" },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Industry insights loaded after profile update:", insightRes.data);
      setInsightData(insightRes.data);
    } catch (err) {
      console.error("Error fetching insights after profile update:", err);
      setError("Failed to load industry insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Determine content availability
  const hasSkillsMarketDemand = marketDemand && marketDemand.length > 0;
  const hasSalaryInfo = (salaryRanges && salaryRanges.length > 0) || expectedSalaryRange;
  const hasTopCompanies = topCompanies && topCompanies.length > 0;
  const hasRecommendedCourses = recommendedCourses && recommendedCourses.length > 0;
  const hasCareerPathInsights = careerPathInsights && careerPathInsights.length > 0;
  const hasEmergingTrends = emergingTrends && emergingTrends.length > 0;
  const hasSkillBasedBoosts = skillBasedBoosts && skillBasedBoosts.length > 0;
  const hasNextActions = nextActions && nextActions.length > 0;

  // Distribute content evenly based on content availability
  const contentSections = [
    hasSkillsMarketDemand,
    hasSalaryInfo,
    hasTopCompanies,
    hasRecommendedCourses,
    hasCareerPathInsights,
    hasEmergingTrends,
    hasSkillBasedBoosts
  ].filter(Boolean).length;

  // Determine optimal layout
  const useThreeColumnLayout = contentSections >= 6;
  const useTwoColumnLayout = contentSections >= 3 && contentSections < 6;
  const useSingleColumnLayout = contentSections < 3;

  // Setup grid layout class based on content
  const gridLayoutClass = useThreeColumnLayout 
    ? 'lg:grid-cols-3' 
    : (useTwoColumnLayout ? 'lg:grid-cols-2' : '');

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black min-h-screen text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-cyan-900/30 to-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-50 mb-2 flex items-center">
                <FaChartLine className="mr-3 text-cyan-400" />
                Industry Insights
              </h1>
              <h2 className="text-xl text-cyan-300 font-medium">
                {userData?.industry || "Your Industry"}
              </h2>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white py-2 px-6 rounded-lg flex items-center transition-all shadow-md self-start md:self-auto"
            >
              <FaUser className="mr-2" />
              Edit Profile
            </button>
          </div>
          {/* Last updated info */}
          <div className="flex flex-wrap items-center mt-4 text-cyan-300/80 text-sm">
            <FaCalendar className="mr-2" />
            <span>Last updated: {formatDate(insightData.lastUpdated)}</span>
            <span className="mx-2 hidden md:inline">•</span>
            <span className="mt-1 md:mt-0">Next update: {formatDate(insightData.nextUpdate)}</span>
          </div>
        </div>
        
        {/* Quick Actions - Always show at the top */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg mb-6">
          <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
            <FaRocket className="mr-3 text-cyan-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard 
              icon={<FaUser className="text-cyan-400" />}
              title="Update Your Skills"
              description="Add your latest skills to get more accurate insights"
              actionText="Update Profile"
              onClick={() => navigate('/profile/edit')}
              className="hover:translate-y-px transition-all h-full"
            />
            <ActionCard 
              icon={<FaFire className="text-orange-400" />}
              title="Trending Skills"
              description="See what skills are in high demand right now"
              actionText="View Skills"
              onClick={() => document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:translate-y-px transition-all h-full"
            />
            <ActionCard 
              icon={<FaCalendar className="text-purple-400" />}
              title="Career Planning"
              description="Get personalized career path recommendations"
              actionText="View Paths"
              onClick={() => {}}
              className="hover:translate-y-px transition-all h-full"
            />
          </div>
        </div>
        
        {/* Industry Overview - Always full width if available */}
        {industryOverview && (
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-cyan-50 mb-4 flex items-center">
              <FaBriefcase className="mr-3 text-cyan-400" />
              Industry Overview
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed">{industryOverview}</p>
            </div>
            
            {/* Next Actions Section - Full width inside overview */}
            {hasNextActions && (
              <NextActionsSection nextActions={nextActions} />
            )}
          </div>
        )}
        
        {/* Content Grid - Adaptive Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Skills vs Market Demand and Salary Information in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasSkillsMarketDemand && (
              <div id="skills-section" className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
                <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                  <FaChartBar className="mr-3 text-cyan-400" />
                  Skills vs Market Demand
                </h3>
                <div className="h-80 p-2">
                  <SkillsVsMarketChart marketDemand={marketDemand} userSkills={userData?.skills || []} />
                </div>
              </div>
            )}

            {hasSalaryInfo && (
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
                <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                  <FaChartLine className="mr-3 text-cyan-400" />
                  Salary Information
                </h3>
                {salaryRanges && salaryRanges.length > 0 && (
                  <div className="h-80 p-2">
                    <SalaryRangesChart data={salaryRanges} />
                  </div>
                )}
                {expectedSalaryRange && (
                  <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mt-6 p-6 bg-gradient-to-r from-cyan-900/20 to-zinc-800/20 rounded-lg border border-zinc-700">
                    <div className="text-center">
                      <p className="text-cyan-400/80 text-sm uppercase tracking-wide font-medium">Minimum</p>
                      <p className="text-3xl font-bold text-cyan-50 mt-1">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: expectedSalaryRange.currency || 'USD',
                          maximumFractionDigits: 0
                        }).format(expectedSalaryRange.min)}
                      </p>
                    </div>
                    <div className="hidden md:block h-16 border-l border-zinc-700"></div>
                    <div className="text-center">
                      <p className="text-cyan-400/80 text-sm uppercase tracking-wide font-medium">Maximum</p>
                      <p className="text-3xl font-bold text-cyan-50 mt-1">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: expectedSalaryRange.currency || 'USD',
                          maximumFractionDigits: 0
                        }).format(expectedSalaryRange.max)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other sections */}
          {/* Skill-Based Salary Boosts */}
          {hasSkillBasedBoosts && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <FaChartLine className="mr-3 text-cyan-400" />
                Skill-Based Salary Boosts
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {skillBasedBoosts.map((boost, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-zinc-700/30 to-zinc-800/30 rounded-lg border border-zinc-700 hover:border-green-500 transition-all"
                  >
                    <span className="text-cyan-50 font-medium">{boost.skill}</span>
                    <span className="text-green-400 font-bold bg-green-900/20 py-1 px-3 rounded-full text-sm">
                      +{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                      }).format(boost.salaryIncrease)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Companies */}
          {hasTopCompanies && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <FaBriefcase className="mr-3 text-cyan-400" />
                Top Companies Hiring
              </h3>
              <div className="overflow-hidden rounded-lg border border-zinc-700">
                <TopCompaniesTable companies={topCompanies} />
              </div>
            </div>
          )}

          {/* Recommended Courses */}
          {hasRecommendedCourses && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <FaGraduationCap className="mr-3 text-cyan-400" />
                Recommended Courses
              </h3>
              <div className="overflow-hidden rounded-lg border border-zinc-700">
                <RecommendedCoursesTable courses={recommendedCourses} />
              </div>
            </div>
          )}

          {/* Career Path Insights */}
          {hasCareerPathInsights && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <FaArrowUp className="mr-3 text-cyan-400" />
                Career Path Insights
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {careerPathInsights.map((path, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 p-5 rounded-lg border border-zinc-700 hover:border-cyan-500 transition-all shadow-md h-full flex flex-col"
                  >
                    <h4 className="text-cyan-300 font-medium text-lg mb-2">{path.title}</h4>
                    <p className="text-zinc-300 mb-3 text-sm flex-grow">{path.description}</p>
                    <div className="flex items-center text-cyan-400 text-sm bg-cyan-900/20 p-2 rounded-lg mt-auto">
                      <FaArrowUp className="mr-2" />
                      <span>Growth Potential: <span className="font-semibold">{path.growthPotential}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emerging Trends */}
          {hasEmergingTrends && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <FaBullhorn className="mr-3 text-cyan-400" />
                Emerging Trends
              </h3>
              <div className="space-y-3">
                {emergingTrends.map((trend, index) => (
                  <InsightCard 
                    key={index}
                    icon={<FaBullhorn className="text-cyan-400" />}
                    title={trend.name}
                    description={trend.description}
                    className="hover:border-cyan-500 transition-all h-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndustryInsightsPage;