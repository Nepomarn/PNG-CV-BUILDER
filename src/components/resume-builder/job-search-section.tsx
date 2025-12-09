"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Building2, DollarSign, Briefcase, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  province: string;
  salary?: string;
  description: string;
  source: "pngworkforce" | "indeed";
  postedDate?: string;
}

interface JobSearchSectionProps {
  language: "en" | "tp";
  onSelectJob: (job: JobListing) => void;
  selectedJob: JobListing | null;
}

const translations = {
  en: {
    title: "Find Jobs in Papua New Guinea",
    placeholder: "Search jobs in PNG (e.g., mining Lae, bank teller Port Moresby)",
    searching: "Searching jobs...",
    noResults: "No jobs found. Try a different search term.",
    useJob: "Use this job to tailor my CV",
    selected: "Selected for CV",
    latestJobs: "Latest PNG Jobs",
    clearSearch: "Clear search",
    salary: "Salary",
    location: "Location",
    company: "Company",
  },
  tp: {
    title: "Painim Wok Long Papua New Guinea",
    placeholder: "Sekim wok long PNG (e.g., mining Lae, bank teller Port Moresby)",
    searching: "Sekim ol wok...",
    noResults: "No gat wok. Traim narapela tok.",
    useJob: "Usim dispela wok long wokim CV",
    selected: "Makim pinis bilong CV",
    latestJobs: "Nupela Wok Long PNG",
    clearSearch: "Klinim sekim",
    salary: "Pe",
    location: "Ples",
    company: "Kampani",
  },
};

// Pre-filled PNG jobs data (simulating RSS/API data)
const samplePNGJobs: JobListing[] = [
  {
    id: "1",
    title: "Mining Engineer",
    company: "Ok Tedi Mining Limited",
    location: "Tabubil, Western Province",
    province: "Western Province",
    salary: "K150,000 - K200,000/year",
    description: "Seeking experienced mining engineer for open pit operations. Must have 5+ years experience in gold/copper mining. FIFO roster available.",
    source: "pngworkforce",
    postedDate: "2 days ago",
  },
  {
    id: "2",
    title: "Bank Teller",
    company: "Bank South Pacific",
    location: "Port Moresby, NCD",
    province: "National Capital District",
    salary: "K35,000 - K45,000/year",
    description: "Customer service role handling daily transactions, account inquiries, and banking products. Grade 12 certificate required.",
    source: "pngworkforce",
    postedDate: "1 day ago",
  },
  {
    id: "3",
    title: "Registered Nurse",
    company: "Angau Memorial Hospital",
    location: "Lae, Morobe Province",
    province: "Morobe Province",
    salary: "K40,000 - K55,000/year",
    description: "Full-time nursing position in general ward. Must be registered with PNG Nursing Council. Experience in tropical medicine preferred.",
    source: "indeed",
    postedDate: "3 days ago",
  },
  {
    id: "4",
    title: "Heavy Equipment Operator",
    company: "Newcrest Mining",
    location: "Lihir Island, New Ireland",
    province: "New Ireland Province",
    salary: "K80,000 - K120,000/year",
    description: "Operate CAT 777 haul trucks and excavators. Valid PNG driver's license required. FIFO with competitive allowances.",
    source: "pngworkforce",
    postedDate: "Today",
  },
  {
    id: "5",
    title: "Accountant",
    company: "Steamships Trading Company",
    location: "Port Moresby, NCD",
    province: "National Capital District",
    salary: "K60,000 - K80,000/year",
    description: "Manage financial reporting and compliance. CPA qualification preferred. Experience with SAP an advantage.",
    source: "indeed",
    postedDate: "5 days ago",
  },
  {
    id: "6",
    title: "Security Officer",
    company: "G4S PNG",
    location: "Multiple Locations",
    province: "Various",
    salary: "K25,000 - K35,000/year",
    description: "Provide security services for commercial and residential clients. Must have clean police clearance and Grade 10 certificate.",
    source: "pngworkforce",
    postedDate: "1 week ago",
  },
  {
    id: "7",
    title: "Teacher - Secondary",
    company: "Goroka International School",
    location: "Goroka, Eastern Highlands",
    province: "Eastern Highlands Province",
    salary: "K45,000 - K65,000/year",
    description: "Teaching position for Mathematics and Science. Bachelor's degree in Education required. Housing provided.",
    source: "indeed",
    postedDate: "4 days ago",
  },
  {
    id: "8",
    title: "Store Manager",
    company: "Brian Bell Group",
    location: "Mt Hagen, Western Highlands",
    province: "Western Highlands Province",
    salary: "K50,000 - K70,000/year",
    description: "Manage retail operations, staff supervision, and inventory control. 3+ years retail management experience required.",
    source: "pngworkforce",
    postedDate: "2 days ago",
  },
  {
    id: "9",
    title: "Electrician",
    company: "PNG Power Limited",
    location: "Lae, Morobe Province",
    province: "Morobe Province",
    salary: "K45,000 - K60,000/year",
    description: "Maintain and repair electrical systems. Trade certificate and PNG Electrical License required.",
    source: "indeed",
    postedDate: "6 days ago",
  },
  {
    id: "10",
    title: "Project Coordinator",
    company: "World Vision PNG",
    location: "Port Moresby, NCD",
    province: "National Capital District",
    salary: "K55,000 - K75,000/year",
    description: "Coordinate community development projects. Bachelor's degree and NGO experience preferred. Travel to provinces required.",
    source: "pngworkforce",
    postedDate: "3 days ago",
  },
];

export default function JobSearchSection({ language, onSelectJob, selectedJob }: JobSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>(samplePNGJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(samplePNGJobs.slice(0, 6));
  const t = translations[language];

  const searchJobs = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredJobs(samplePNGJobs.slice(0, 6));
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = samplePNGJobs.filter(job => 
        job.title.toLowerCase().includes(lowerQuery) ||
        job.company.toLowerCase().includes(lowerQuery) ||
        job.location.toLowerCase().includes(lowerQuery) ||
        job.province.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredJobs(results);
      setIsSearching(false);
    }, 500);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchJobs(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchJobs]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredJobs(samplePNGJobs.slice(0, 6));
  };

  const getSourceBadgeColor = (source: string) => {
    return source === "pngworkforce" 
      ? "bg-png-red/20 text-png-red border-png-red/30" 
      : "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="px-6 md:px-12 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="font-syne font-bold text-2xl md:text-3xl mb-2 text-white">
          {t.title}
        </h2>
        <p className="font-inter text-gray-300 mb-6">{t.latestJobs}</p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-12 pr-12 py-4 bg-png-charcoal border-2 border-white/20 rounded-xl text-white font-inter placeholder:text-gray-500 focus:border-png-orange focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {isSearching && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-png-orange animate-spin" />
            </div>
          )}
        </div>

        {/* Job Cards Grid */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-png-orange animate-spin mr-3" />
              <span className="font-inter text-gray-300">{t.searching}</span>
            </motion.div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="font-inter text-gray-400">{t.noResults}</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-png-charcoal border-2 rounded-xl p-4 transition-all duration-200 ${
                    selectedJob?.id === job.id
                      ? "border-png-orange shadow-lg shadow-png-orange/20"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  {/* Source Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 text-xs font-inter rounded-full border ${getSourceBadgeColor(job.source)}`}>
                      {job.source === "pngworkforce" ? "PNGworkForce" : "Indeed"}
                    </span>
                    {job.postedDate && (
                      <span className="text-xs font-inter text-gray-500">{job.postedDate}</span>
                    )}
                  </div>

                  {/* Job Title */}
                  <h3 className="font-syne font-bold text-lg text-white mb-2 line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Company */}
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 text-png-orange flex-shrink-0" />
                    <span className="font-inter text-sm truncate">{job.company}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 text-png-orange flex-shrink-0" />
                    <span className="font-inter text-sm truncate">{job.location}</span>
                  </div>

                  {/* Salary */}
                  {job.salary && (
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <DollarSign className="w-4 h-4 text-png-orange flex-shrink-0" />
                      <span className="font-inter text-sm text-png-orange font-medium">{job.salary}</span>
                    </div>
                  )}

                  {/* Description Preview */}
                  <p className="font-inter text-xs text-gray-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectJob(job)}
                    disabled={selectedJob?.id === job.id}
                    className={`w-full py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                      selectedJob?.id === job.id
                        ? "bg-png-orange text-white cursor-default"
                        : "bg-white/10 text-white hover:bg-png-orange/20 border border-white/20 hover:border-png-orange"
                    }`}
                  >
                    {selectedJob?.id === job.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t.selected}
                      </span>
                    ) : (
                      t.useJob
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
