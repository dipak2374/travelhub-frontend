import { FiCheck } from 'react-icons/fi';

const DashboardFormLayout = ({
  title,
  steps,
  activeStep,
  onStepChange,
  onCancel,
  onNext,
  onSubmit,
  isLastStep,
  children
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Sidebar - Steps */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 bg-gray-50/30 overflow-y-auto">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;

              return (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 cursor-pointer group`}
                  onClick={() => onStepChange(index)}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isActive ? 'bg-primary-600 text-white shadow-sm' :
                    isCompleted ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    {isCompleted ? <FiCheck size={12} /> : index + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-900' : 
                      isCompleted ? 'text-emerald-700' :
                      'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          <div className="p-6 sm:p-8 lg:p-10 flex-1">
            {children}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isLastStep ? onSubmit : onNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {isLastStep ? 'Submit' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFormLayout;
