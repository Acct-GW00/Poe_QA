import React, { useState } from 'react';

interface WizardProps {
  onSubmit: (data: {
    start: string;
    end: string;
    shuttleFull: boolean;
    guestHouseFull: boolean;
  }) => void;
  onCancel: () => void;
}

export const MailiaoWizard: React.FC<WizardProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    start: '',
    end: '',
    shuttleFull: false,
    guestHouseFull: false,
  });

  const handleNext = () => {
     if (step === 1 && (!formData.start || !formData.end)) {
        alert("請輸入完整的出差開始與結束時間。");
        return;
    }
    setStep(step + 1)
  };
  
  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 text-center">步驟 1: 出差時間</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="start-datetime">開始日期與時間</label>
                <input id="start-datetime" type="datetime-local" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="end-datetime">結束日期與時間</label>
                <input id="end-datetime" type="datetime-local" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"/>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-3 text-center">步驟 2: 交通與住宿</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <span className="text-gray-300">交通車是否客滿？</span>
                    <button onClick={() => setFormData({...formData, shuttleFull: !formData.shuttleFull})} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${formData.shuttleFull ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                        {formData.shuttleFull ? '是' : '否'}
                    </button>
                </div>
                 <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <span className="text-gray-300">招待所是否客滿？</span>
                    <button onClick={() => setFormData({...formData, guestHouseFull: !formData.guestHouseFull})} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${formData.guestHouseFull ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                        {formData.guestHouseFull ? '是' : '否'}
                    </button>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 animate-fade-in">
      {renderStep()}
      <div className="flex justify-between mt-6">
        <button onClick={onCancel} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">取消</button>
        <div>
          {step > 1 && <button onClick={handleBack} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-colors">上一步</button>}
          {step < 2 && <button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">下一步</button>}
          {step === 2 && <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">產生報告</button>}
        </div>
      </div>
    </div>
  );
};
