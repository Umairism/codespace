import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmDialogProps) {
  if (!visible) return null;

  const getButtonColor = () => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700';
      case 'warning': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className={`w-5 h-5 mr-2 ${
              type === 'danger' ? 'text-red-400' : 
              type === 'warning' ? 'text-orange-400' : 
              'text-blue-400'
            }`} />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 ${getButtonColor()} text-white px-4 py-2 rounded`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}