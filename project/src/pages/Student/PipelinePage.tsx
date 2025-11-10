import React, { useState } from 'react';
import { GitBranch, CheckCircle, Clock, XCircle, ArrowRight, Calendar, MessageSquare, RefreshCw, AlertCircle, Trophy } from 'lucide-react';
import { usePipeline, ApplicationPipeline, PipelineStage } from '../../contexts/PipelineContext';

const PipelinePage: React.FC = () => {
  const { pipelines, loading, error, refreshPipelines } = usePipeline();
  const [selectedPipeline, setSelectedPipeline] = useState<ApplicationPipeline | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    await refreshPipelines();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application pipelines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (pipeline: ApplicationPipeline) => {
    setSelectedPipeline(pipeline);
    setShowDetailsModal(true);
  };

  const getProgressPercentage = (pipeline: ApplicationPipeline) => {
    const completedStages = pipeline.stages.filter(stage => stage.status === 'completed').length;
    return Math.round((completedStages / pipeline.stages.length) * 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitBranch className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Application Pipeline</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <p className="text-gray-600 mt-2">Track your progress through the selection process</p>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {pipelines.filter(p => p.overallStatus === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Applications</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {pipelines.filter(p => p.overallStatus === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Offers Received</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-600">
            {pipelines.length}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-6">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{pipeline.jobTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(pipeline.overallStatus)}`}>
                    {pipeline.overallStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600">{pipeline.company}</p>
                <p className="text-sm text-gray-500">Applied: {new Date(pipeline.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{getProgressPercentage(pipeline)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(pipeline)}%` }}
                ></div>
              </div>
            </div>

            {/* Stage Timeline with Connecting Lines */}
            <div className="relative mb-6">
              {/* Connecting Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
              
              <div className="flex items-center justify-between relative z-10">
                {pipeline.stages.map((stage, index) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  const isRejected = stage.status === 'rejected';
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      {/* Stage Circle */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'border-green-500 bg-green-50 shadow-lg' 
                          : isCurrent 
                          ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-100 animate-pulse' 
                          : isRejected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}>
                        {getStageStatusIcon(stage.status)}
                      </div>
                      
                      {/* Stage Info */}
                      <div className="text-xs text-center max-w-20">
                        <div className={`font-medium ${
                          isCurrent ? 'text-blue-700 font-bold' : 'text-gray-900'
                        }`}>
                          {stage.name}
                        </div>
                        {stage.completedDate && (
                          <div className="text-gray-500 mt-1">
                            {new Date(stage.completedDate).toLocaleDateString()}
                          </div>
                        )}
                        {isCurrent && (
                          <div className="text-blue-600 font-semibold mt-1 text-xs">
                            IN PROGRESS
                          </div>
                        )}
                      </div>
                      
                      {/* Progress Line Segment */}
                      {index < pipeline.stages.length - 1 && (
                        <div className={`absolute top-6 h-0.5 z-5 transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} 
                        style={{
                          left: `${(index + 1) * (100 / pipeline.stages.length)}%`,
                          width: `${100 / pipeline.stages.length}%`
                        }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Information */}
            <>
              {/* Current Stage Info */}
              {pipeline.overallStatus === 'active' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-blue-900 text-lg">Current Stage</span>
                        <p className="text-blue-800 font-medium">
                          {pipeline.stages.find(stage => stage.status === 'current')?.name || 'Waiting for next stage'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm text-blue-600 font-medium">
                         Stage {pipeline.currentStage} of {pipeline.stages.length}
                       </div>
                       <div className="text-xs text-blue-500">
                         {pipeline.stages.filter(s => s.status === 'completed').length} completed
                       </div>
                     </div>
                   </div>
                   
                   {/* Next Stage Preview */}
                   {(() => {
                     const nextStage = pipeline.stages.find(stage => stage.status === 'pending');
                     return nextStage && (
                       <div className="mt-3 pt-3 border-t border-blue-200">
                         <div className="flex items-center gap-2">
                           <span className="text-sm text-blue-700 font-medium">Next:</span>
                           <span className="text-sm text-blue-600">{nextStage.name}</span>
                           <div className="flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full">
                             {nextStage.icon}
                           </div>
                         </div>
                       </div>
                     );
                   })()} 
                </div>
              )}
              
              {/* Completed Stage Info */}
              {pipeline.overallStatus === 'completed' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-green-900 text-lg">Process Completed</span>
                      <p className="text-green-800 font-medium">
                        Congratulations! You've successfully completed all stages.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rejected Stage Info */}
              {pipeline.overallStatus === 'rejected' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-red-900 text-lg">Application Status</span>
                      <p className="text-red-800 font-medium">
                        Unfortunately, your application was not selected to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>

            <div className="flex justify-end">
              <button
                onClick={() => handleViewDetails(pipeline)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Details Modal */}
      {showDetailsModal && selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pipeline Details - {selectedPipeline.jobTitle}
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Company: {selectedPipeline.company}</h3>
              <p className="text-gray-600">Applied: {new Date(selectedPipeline.appliedDate).toLocaleDateString()}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(selectedPipeline.overallStatus)}`}>
                  {selectedPipeline.overallStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Selection Process Stages</h3>
              {selectedPipeline.stages.map((stage, index) => (
                <div key={stage.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {getStageStatusIcon(stage.status)}
                    <div className="flex items-center gap-2">
                      {stage.icon}
                      <span className="font-medium text-gray-900">{stage.name}</span>
                    </div>
                  </div>
                  
                  {stage.completedDate && (
                    <p className="text-sm text-gray-600 mb-2">
                      Completed: {new Date(stage.completedDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  {stage.feedback && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Feedback:</strong> {stage.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPipeline(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelinePage;