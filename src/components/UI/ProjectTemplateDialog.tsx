import { useState } from 'react';
import { X, Globe, Layers, Palette, Code, FileText, BarChart3, Zap } from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ProjectTemplateDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const templates: ProjectTemplate[] = [
  {
    id: 'html',
    name: 'HTML Website',
    description: 'Complete HTML website with CSS and JavaScript',
    icon: Globe,
    color: 'text-orange-400'
  },
  {
    id: 'react',
    name: 'React App',
    description: 'React application with CDN setup',
    icon: Layers,
    color: 'text-blue-400'
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap Site',
    description: 'Responsive website using Bootstrap 5',
    icon: Palette,
    color: 'text-purple-400'
  },
  {
    id: 'javascript',
    name: 'JavaScript Project',
    description: 'Pure JavaScript project',
    icon: Code,
    color: 'text-yellow-400'
  },
  {
    id: 'python',
    name: 'Python Basic',
    description: 'Basic Python project with examples and documentation',
    icon: Code,
    color: 'text-green-400'
  },
  {
    id: 'flask',
    name: 'Flask Web App',
    description: 'Flask web application with API endpoints and templates',
    icon: Zap,
    color: 'text-red-400'
  },
  {
    id: 'datascience',
    name: 'Data Science',
    description: 'Python data analysis with pandas, numpy, and visualization',
    icon: BarChart3,
    color: 'text-cyan-400'
  },
  {
    id: 'empty',
    name: 'Empty Project',
    description: 'Start with a blank project',
    icon: FileText,
    color: 'text-gray-400'
  }
];

export function ProjectTemplateDialog({ visible, onClose, onSelectTemplate }: ProjectTemplateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('html');

  if (!visible) return null;

  const handleSelect = () => {
    onSelectTemplate(selectedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Create New Project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg bg-gray-700 ${template.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{template.name}</h4>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedTemplate === template.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSelect}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Project
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}