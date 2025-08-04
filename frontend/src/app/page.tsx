'use client'

import React, { useState, useEffect} from 'react';
import { Symptom, allSymptoms, bodyRegions, symptomCategories } from '@/data/symptoms';
import { useRouter } from 'next/navigation';
import { useAuth} from '@/features/auth/authContext';

type Severity = 'mild' | 'moderate' | 'severe'
type Duration = 'Today' | 'Few days' | '1-2 weeks' | 'Longer'

interface SymptomEntry {
  symptom: string;
  severity: Severity;
  duration: Duration;
};

interface Analysis {
  diagnosis: string;
  confidence: number;
}
export default function Home() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptomDetails, setSelectedSymptomDetails] = useState<Symptom | null>(null);
  const [selectedSymptomEntries, setSelectedSymptomEntries] = useState<SymptomEntry[]>([]);
  const [symptomDuration, setSymptomDuration] = useState<Duration>('Today');
  const [symptomSeverity, setSymptomSeverity] = useState<Severity>('moderate');
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<'region' | 'symptoms' | 'details' | 'results'>('region');
  const router = useRouter();
  const { token } = useAuth();
  
  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token])

  const filteredSymptoms = allSymptoms.filter(symptom => {
    if (searchQuery) {
      return symptom.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    if (selectedBodyRegion) {
      const region = bodyRegions.find(r => r.id === selectedBodyRegion);
      return region ? region.symptoms.includes(symptom.name) : false;
    }
    
    if (selectedCategory) {
      const category = symptomCategories.find(c => c.id === selectedCategory);
      return category ? category.symptoms.includes(symptom.name) : false;
    }
    
    return true;
  });

  const handleAddSymptom = (symptom: Symptom) => {
      setSelectedSymptomDetails(symptom);
      setStep('details');
    
  };

  const handleConfirmSymptomDetails = () => {
    if (selectedSymptomDetails && !symptoms.includes(selectedSymptomDetails.name)) {
      setSymptoms([...symptoms, selectedSymptomDetails.name]);
      setSelectedSymptomEntries([...selectedSymptomEntries, {symptom: selectedSymptomDetails.name, severity: symptomSeverity,duration:symptomDuration}])
    }
    setSelectedSymptomDetails(null);
    setStep('symptoms');
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleBodyRegionSelect = (regionId: string) => {
    setSelectedBodyRegion(regionId);
    setSelectedCategory(null);
    setStep('symptoms');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedBodyRegion(null);
    setStep('symptoms');
  };

  const resetFilters = () => {
    setSelectedBodyRegion(null);
    setSelectedCategory(null);
    setSearchQuery('');
  };
  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/`, {
        method: 'POST',
        credentials: "include",
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, },
        body: JSON.stringify(selectedSymptomEntries)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data:Analysis = await response.json();
      setAnalysis(data)
      setStep('results')
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }
  const renderBodyRegionSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Where are you experiencing symptoms?
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {bodyRegions.map((region) => (
          <button
            key={region.id}
            onClick={() => handleBodyRegionSelect(region.id)}
            className="p-4 rounded-lg text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="block font-medium">{region.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <span className="text-gray-500 dark:text-gray-400">or</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Browse by category
          </h3>
          <div className="space-y-2">
            {symptomCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>    
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Search symptoms
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search symptoms..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            )}
          </div>
          
          {searchQuery && (
            <div className="mt-2">
              <button 
                onClick={() => {
                  //setSearchQuery(searchQuery);
                  setStep('symptoms');
                }}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all matching symptoms →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSymptomSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setStep('region')}
          className="inline-flex items-center text-blue-800"
        >
          Back
        </button>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {selectedBodyRegion ? bodyRegions.find(r => r.id === selectedBodyRegion)?.name : 
           selectedCategory ? `${symptomCategories.find(c => c.id === selectedCategory)?.name} Symptoms` : 
           searchQuery ? 'Search Results' : 'All Symptoms'}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {symptoms.map((symptom) => (
          <span
            key={symptom}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
          >
            {symptom}
            <button
              onClick={() => handleRemoveSymptom(symptom)}
              className="ml-2 text-primary-600 hover:text-primary-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      
      {(selectedBodyRegion || selectedCategory || searchQuery) && (
        <div className="mb-4">
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear filters
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom.id}
            onClick={() => handleAddSymptom(symptom)}
            disabled={symptoms.includes(symptom.name)}
            className={`p-3 rounded-lg text-left transition-colors ${
              symptoms.includes(symptom.name)
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="block font-medium text-sm">{symptom.name}</span>
             
            </div>
            
          </button>
        ))}
      </div>
      
      <button
        onClick={analyzeSymptoms}
        disabled={symptoms.length === 0 || isAnalyzing}
        className="w-full mt-6 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            Analyzing...
          </>
        ) : (
          <>
            Analyze Symptoms
          </>
        )}
      </button>
    </div>
  );

  const renderSymptomDetails = () => {
    if (!selectedSymptomDetails) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep('symptoms')}
            className="inline-flex items-center text-blue-800"
          >
            Back
          </button>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Tell us more about your {selectedSymptomDetails.name.toLowerCase()}
          </h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">{selectedSymptomDetails.name}</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How long have you been experiencing this?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Today', 'Few days', '1-2 weeks', 'Longer'].map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSymptomDuration(duration as Duration)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      symptomDuration === duration
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 border-primary-300 dark:border-primary-700'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How severe is it?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['mild', 'moderate', 'severe'].map((severity) => (
                  <button
                    key={severity}
                    type="button"
                    onClick={() => setSymptomSeverity(severity as Severity)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      symptomSeverity === severity
                        ? severity === 'mild'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700'
                          : severity === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border`}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirmSymptomDetails}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Symptom
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderAnalysisResults = () => {
    if (!analysis) return null;
    
    return (
      <div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep('symptoms')}
            className="inline-flex items-center text-blue-800"
          >
            Back to symptoms
          </button>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Analysis Results
          </h3>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Disclaimer
              </h3>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                This analysis is for informational purposes only and does not constitute medical advice. 
              </p>
            </div>
          </div>
        </div>
       
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Possible Conditions
          </h3>
          <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {analysis.diagnosis}
                  </h4>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${
                      analysis.confidence > 0.6
                        ? 'bg-green-600'
                        : analysis.confidence > 0.3
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                    style={{ width: `${analysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(analysis.confidence * 100)}% probability
                </span>    
              </div>
          </div>        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Need more help?
          </h3>
          <div className="flex flex-wrap gap-2">
            <a 
              href="/appointments" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-900"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
     <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            AI Symptom Checker
          </h2>
          {step === 'region' && renderBodyRegionSelection()}
          {step === 'symptoms' && renderSymptomSelection()}
          {step === 'details' && renderSymptomDetails()}
          {step === 'results' && renderAnalysisResults()}
        </div>
      </main>
    </div>
  );
}
