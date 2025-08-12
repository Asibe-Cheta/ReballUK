"use client";

import { useState } from "react";
import { Star, TrendingUp, Target, Clock, Award } from "lucide-react";

interface ConfidenceRating {
  skill: string;
  rating: number;
  previousRating: number;
  improvement: number;
}

interface TAVSession {
  id: string;
  title: string;
  position: "Striker" | "Winger" | "CAM" | "Full-back";
  date: string;
  duration: number;
  scenario: string;
  confidenceRatings: ConfidenceRating[];
  overallScore: number;
  keyInsights: string[];
  nextSteps: string[];
}

interface TAVAnalysisProps {
  session: TAVSession;
  onRatingUpdate: (skill: string, rating: number) => void;
}

export default function TAVAnalysis({ session, onRatingUpdate }: TAVAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ratings' | 'insights'>('overview');

  const renderStars = (rating: number, isEditable: boolean = false, skill?: string) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isEditable && skill && onRatingUpdate(skill, star)}
            disabled={!isEditable}
            className={`${
              star <= rating 
                ? 'text-pure-black' 
                : 'text-medium-gray'
            } ${isEditable ? 'hover:text-pure-black cursor-pointer' : 'cursor-default'} transition-colors duration-200`}
          >
            <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-text-gray">{rating}/5</span>
      </div>
    );
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Striker": return "bg-pure-black text-pure-white";
      case "Winger": return "bg-dark-gray text-pure-white";
      case "CAM": return "bg-text-gray text-pure-white";
      case "Full-back": return "bg-medium-gray text-pure-black";
      default: return "bg-light-gray text-pure-black";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-green-600";
    if (improvement < 0) return "text-red-600";
    return "text-text-gray";
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4" />;
    if (improvement < 0) return <TrendingUp className="w-4 h-4 rotate-180" />;
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl text-pure-black mb-2">{session.title}</h2>
            <div className="flex items-center gap-4 text-sm text-text-gray">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {session.scenario}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(session.duration)}
              </span>
              <span>{new Date(session.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(session.position)}`}>
              {session.position}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-pure-black" />
              <span className="text-xl font-bold text-pure-black">{session.overallScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-gray mb-6">
        {(['overview', 'ratings', 'insights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors duration-200 border-b-2 ${
              activeTab === tab
                ? 'border-pure-black text-pure-black'
                : 'border-transparent text-text-gray hover:text-pure-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Performance */}
          <div className="glass-strong rounded-xl p-6">
            <h3 className="font-semibold text-pure-black mb-4">Session Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-gray">Overall Score</span>
                  <span className="font-bold text-pure-black">{session.overallScore}/100</span>
                </div>
                <div className="w-full bg-light-gray rounded-full h-2">
                  <div 
                    className="bg-pure-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${session.overallScore}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pure-black">{session.confidenceRatings.length}</div>
                  <div className="text-sm text-text-gray">Skills Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pure-black">
                    {session.confidenceRatings.filter(r => r.improvement > 0).length}
                  </div>
                  <div className="text-sm text-text-gray">Improved Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ratings */}
          <div className="glass-strong rounded-xl p-6">
            <h3 className="font-semibold text-pure-black mb-4">Top Skills</h3>
            <div className="space-y-3">
              {session.confidenceRatings
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 4)
                .map((rating, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-pure-black">{rating.skill}</span>
                    {renderStars(rating.rating)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ratings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-pure-black">Confidence Ratings</h3>
            <span className="text-sm text-text-gray">Click stars to update ratings</span>
          </div>
          
          {session.confidenceRatings.map((rating, index) => (
            <div key={index} className="glass rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-pure-black mb-1">{rating.skill}</h4>
                  <div className="flex items-center gap-4">
                    {renderStars(rating.rating, true, rating.skill)}
                    {rating.improvement !== 0 && (
                      <div className={`flex items-center gap-1 text-sm ${getImprovementColor(rating.improvement)}`}>
                        {getImprovementIcon(rating.improvement)}
                        <span>
                          {rating.improvement > 0 ? '+' : ''}{rating.improvement.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-gray">Previous</div>
                  <div className="text-sm font-medium text-pure-black">{rating.previousRating}/5</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Key Insights */}
          <div>
            <h3 className="font-semibold text-pure-black mb-4">Key Insights</h3>
            <div className="space-y-3">
              {session.keyInsights.map((insight, index) => (
                <div key={index} className="glass rounded-lg p-4">
                  <p className="text-sm text-pure-black leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="font-semibent text-pure-black mb-4">Recommended Next Steps</h3>
            <div className="space-y-3">
              {session.nextSteps.map((step, index) => (
                <div key={index} className="glass rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-pure-black text-pure-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-pure-black leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
