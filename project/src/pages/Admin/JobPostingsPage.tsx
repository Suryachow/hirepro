import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Calendar, MapPin, Users, Eye, Edit, Trash2, Building2, Clock, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobsContext';

interface Job {
  id: string;
  title: string;
  company: string;
  jobDescription?: string;
  description?: string;
  qualifications?: string[];
  requirements?: string[];
  skillsRequired?: string[];
  responsibilities?: string[];
  requiredSkills?: string[];
  postedDate: string;
  deadline: string;
  location?: string;
  type?: string;
  salary?: string;
  applicants?: number;
}

const JobPostingsPage: React.FC = () => {
  const { user } = useAuth();
  const { jobs, addJob } = useJobs();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    deadline: '',
    location: '',
    type: 'Full-time',
    salary: ''
  });

  // Add some mock data if no jobs exist
  useEffect(() => {
    if (jobs.length === 0) {
      // Add some sample jobs for demonstration
      const sampleJobs = [
        {
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          description: 'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
          requirements: ['React.js', 'TypeScript', 'CSS3', 'HTML5', 'Git'],
          deadline: '2024-03-15',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120,000 - $150,000'
        },
        {
          title: 'Backend Engineer',
          company: 'DataFlow Solutions',
          description: 'Join our backend team to build scalable and robust server-side applications. Experience with cloud technologies and microservices architecture is preferred.',
          requirements: ['Node.js', 'Python', 'AWS', 'Docker', 'MongoDB'],
          deadline: '2024-03-20',
          location: 'Remote',
          type: 'Full-time',
          salary: '$110,000 - $140,000'
        }
      ];
      
      sampleJobs.forEach(job => {
        addJob(job);
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = formData.requirements.split('\n').filter(r => r.trim());
    addJob({
      ...formData,
      requirements,
      skillsRequired: requirements,
      qualifications: requirements,
      responsibilities: [formData.description],
      requiredSkills: requirements,
      jobDescription: formData.description
    });
    setFormData({
      title: '',
      company: '',
      description: '',
      requirements: '',
      deadline: '',
      location: '',
      type: 'Full-time',
      salary: ''
    });
    setSubmitSuccess(true);
    setShowAddModal(false);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobDescription = (job: Job) => {
    return job.jobDescription || job.description || 'No description available';
  };

  const getJobRequirements = (job: Job) => {
    return job.requirements || job.qualifications || job.skillsRequired || job.requiredSkills || [];
  };

  const formatSalary = (salary: any) => {
    if (typeof salary === 'string') {
      return salary;
    }
    if (salary && typeof salary === 'object' && salary.min && salary.max) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: salary.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Add Button */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
              <p className="text-gray-600 mt-1">Manage and track your job listings</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Job Posting
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
          Job posted successfully!
        </div>
      )}

      {/* Job Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">{job.company}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {(job as any).location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{(job as any).location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Deadline: {formatDate(job.deadline)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Posted: {formatDate(job.postedDate)}</span>
              </div>
              {(job as any).salary && (
                <div className="flex items-center text-gray-600">
                  <span className="text-sm font-medium text-green-600">{formatSalary((job as any).salary)}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {getJobDescription(job).substring(0, 120)}...
              </p>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {getJobRequirements(job).slice(0, 3).map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {req}
                  </span>
                ))}
                {getJobRequirements(job).length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{getJobRequirements(job).length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">{(job as any).applicants || 0} applicants</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(job)}
                  className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
         <div className="text-center py-12">
           <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
           <p className="text-gray-600 mb-4">Get started by creating your first job posting</p>
           <button
             onClick={() => setShowAddModal(true)}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
           >
             Create Job Posting
           </button>
         </div>
       )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Job Posting</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., New York, NY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                  placeholder="Bachelor's degree in Computer Science\n3+ years of experience\nProficiency in React and Node.js"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>{selectedJob.company}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                      <p className="text-gray-700 leading-relaxed">{getJobDescription(selectedJob)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {getJobRequirements(selectedJob).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                    <div className="space-y-3">
                      {(selectedJob as any).location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{(selectedJob as any).location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">Deadline: {formatDate(selectedJob.deadline)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Posted: {formatDate(selectedJob.postedDate)}</span>
                      </div>
                      {(selectedJob as any).salary && (
                        <div className="flex items-center text-green-600">
                          <span className="text-sm font-medium">{formatSalary((selectedJob as any).salary)}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{(selectedJob as any).applicants || 0} applicants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Edit Job Posting
                    </button>
                    <button className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                      Delete Job Posting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
 };

export default JobPostingsPage;