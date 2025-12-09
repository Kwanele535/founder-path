import React, { useState } from 'react';
import { generateBusinessTool } from '../../services/geminiService';
import { ToolTemplate } from '../../types';
import Loader from '../Loader';
import { BriefcaseIcon, ChevronLeftIcon, TargetIcon, UsersIcon, MegaphoneIcon, LayoutIcon } from '../Icons';

const TOOLS: ToolTemplate[] = [
  {
    id: 'elevator-pitch',
    name: 'Elevator Pitch Generator',
    description: 'Create a compelling 30-second pitch for your startup.',
    promptTemplate: 'Write a persuasive 30-second elevator pitch for a startup called "{{name}}" that solves "{{problem}}" for "{{targetAudience}}" by "{{solution}}".',
    inputs: [
        { label: 'Startup Name', key: 'name', placeholder: 'e.g. Acme AI' },
        { label: 'Target Audience', key: 'targetAudience', placeholder: 'e.g. Remote workers' },
        { label: 'Problem', key: 'problem', placeholder: 'e.g. loneliness and disconnection' },
        { label: 'Solution', key: 'solution', placeholder: 'e.g. a virtual watercooler app' }
    ]
  },
  {
    id: 'lean-canvas',
    name: 'Lean Canvas Builder',
    description: 'Generate a 1-page business plan with key metrics and UVP.',
    promptTemplate: 'Create a text-based Lean Canvas for a startup called "{{name}}". Customer Segment: "{{customer}}". Problem: "{{problem}}". Solution: "{{solution}}". Format it with these markdown headers: 1. Problem, 2. Customer Segments, 3. Unique Value Proposition, 4. Solution, 5. Channels, 6. Revenue Streams, 7. Cost Structure, 8. Key Metrics, 9. Unfair Advantage.',
    inputs: [
        { label: 'Startup Name', key: 'name', placeholder: 'e.g. FoodFast' },
        { label: 'Customer Segment', key: 'customer', placeholder: 'e.g. Busy urban professionals' },
        { label: 'Core Problem', key: 'problem', placeholder: 'e.g. No time to cook healthy meals' },
        { label: 'Proposed Solution', key: 'solution', placeholder: 'e.g. 15-min delivery of organic salads' }
    ]
  },
  {
    id: 'okr-generator',
    name: 'OKR Architect',
    description: 'Set clear Objectives and Key Results for your next quarter.',
    promptTemplate: 'Draft 3 sets of OKRs (Objectives and Key Results) for a {{role}} at a {{stage}} stage company. Focus area: {{focus}}. Ensure key results are measurable and ambitious.',
    inputs: [
        { label: 'Your Role', key: 'role', placeholder: 'e.g. Head of Product' },
        { label: 'Company Stage', key: 'stage', placeholder: 'e.g. Series A, Pre-Seed' },
        { label: 'Quarterly Focus', key: 'focus', placeholder: 'e.g. User Retention, Revenue Growth' }
    ]
  },
  {
    id: 'swot',
    name: 'SWOT Analysis',
    description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats.',
    promptTemplate: 'Perform a detailed SWOT analysis for a company described as: "{{description}}". Format clearly with markdown headers.',
    inputs: [
        { label: 'Business Description', key: 'description', placeholder: 'Describe your business model and market...' }
    ]
  },
  {
    id: 'job-desc',
    name: 'Job Description Writer',
    description: 'Draft professional job listings to attract top talent.',
    promptTemplate: 'Write a comprehensive job description for a {{title}} at a company with a {{culture}} culture. Key responsibilities: {{responsibilities}}. Include: Role Summary, Responsibilities, Requirements, and a "Why Join Us" section. Tone: Professional but exciting.',
    inputs: [
        { label: 'Job Title', key: 'title', placeholder: 'e.g. Senior React Engineer' },
        { label: 'Company Culture', key: 'culture', placeholder: 'e.g. Fast-paced, remote-first' },
        { label: 'Key Responsibilities', key: 'responsibilities', placeholder: 'e.g. Lead frontend architecture, mentor juniors' }
    ]
  },
  {
    id: 'tweet-thread',
    name: 'Viral Launch Thread',
    description: 'Create an engaging social media thread for your launch.',
    promptTemplate: 'Write a 5-tweet thread launching a product called "{{product}}". The main benefit is "{{benefit}}". The call to action is "{{cta}}". Use emojis, hooks, and a viral structure.',
    inputs: [
        { label: 'Product Name', key: 'product', placeholder: 'e.g. SuperTask' },
        { label: 'Main Benefit', key: 'benefit', placeholder: 'e.g. Saves 10 hours a week' },
        { label: 'Call To Action', key: 'cta', placeholder: 'e.g. Sign up for waitlist' }
    ]
  },
  {
    id: 'cold-email',
    name: 'Investor Cold Email',
    description: 'Draft an email to get a VC meeting.',
    promptTemplate: 'Write a cold email to an investor named "{{investorName}}" from a founder named "{{founderName}}". The startup is "{{startupDesc}}". Keep it short, personalized, and ask for a meeting.',
    inputs: [
        { label: 'Investor Name', key: 'investorName', placeholder: 'Jane Doe' },
        { label: 'Your Name', key: 'founderName', placeholder: 'John Smith' },
        { label: 'Startup Description', key: 'startupDesc', placeholder: 'Short pitch...' }
    ]
  }
];

const ToolsView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolTemplate | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTool) return;
    setLoading(true);
    const output = await generateBusinessTool(selectedTool, inputValues);
    setResult(output);
    setLoading(false);
  };

  const reset = () => {
      setSelectedTool(null);
      setInputValues({});
      setResult(null);
  };

  const getToolIcon = (id: string) => {
    switch (id) {
        case 'elevator-pitch': return <BriefcaseIcon className="w-6 h-6 text-purple-900" />;
        case 'lean-canvas': return <LayoutIcon className="w-6 h-6 text-purple-900" />;
        case 'okr-generator': return <TargetIcon className="w-6 h-6 text-purple-900" />;
        case 'swot': return <BriefcaseIcon className="w-6 h-6 text-purple-900" />;
        case 'job-desc': return <UsersIcon className="w-6 h-6 text-purple-900" />;
        case 'tweet-thread': return <MegaphoneIcon className="w-6 h-6 text-purple-900" />;
        case 'cold-email': return <BriefcaseIcon className="w-6 h-6 text-purple-900" />;
        default: return <BriefcaseIcon className="w-6 h-6 text-purple-900" />;
    }
  };

  if (selectedTool) {
      return (
          <div className="p-6 pb-32 max-w-md mx-auto min-h-screen pt-10">
              <button onClick={reset} className="flex items-center text-sm font-bold text-gray-500 mb-6 hover:text-gray-900 transition-colors">
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  Back
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTool.name}</h1>
              <p className="text-gray-500 mb-8 leading-relaxed">{selectedTool.description}</p>

              {!result && (
                  <div className="space-y-6">
                      {selectedTool.inputs.map(input => (
                          <div key={input.key}>
                              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 ml-1">
                                  {input.label}
                              </label>
                              <textarea
                                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-0 outline-none text-gray-900 transition-all resize-none"
                                  rows={input.key === 'description' || input.key === 'responsibilities' ? 5 : 2}
                                  placeholder={input.placeholder}
                                  value={inputValues[input.key] || ''}
                                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                              />
                          </div>
                      ))}
                      <button 
                          onClick={handleGenerate}
                          disabled={loading}
                          className="w-full mt-4 bg-gray-900 hover:bg-black text-white text-lg font-bold py-5 rounded-[2rem] shadow-lg transition-transform active:scale-95 disabled:opacity-70 disabled:scale-100"
                      >
                          {loading ? "Thinking..." : "Generate Draft"}
                      </button>
                  </div>
              )}

              {loading && <Loader text="Drafting document..." />}

              {result && (
                  <div className="mt-8 animate-fade-in">
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 text-gray-800 whitespace-pre-line leading-relaxed shadow-sm">
                          {result}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(result);
                                alert("Copied to clipboard!");
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-[1.5rem] transition-colors"
                        >
                            Copy
                        </button>
                        <button 
                            onClick={() => setResult(null)}
                            className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-[1.5rem] transition-colors"
                        >
                            New
                        </button>
                      </div>
                  </div>
              )}
          </div>
      )
  }

  return (
    <div className="p-6 pb-32 max-w-md mx-auto pt-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Toolkit</h1>
      <div className="grid gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            className="flex items-center p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
          >
            <div className="bg-purple-50 p-4 rounded-2xl mr-5 group-hover:bg-purple-100 transition-colors">
                {getToolIcon(tool.id)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolsView;