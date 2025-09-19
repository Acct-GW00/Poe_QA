
import React, { useState } from 'react';

interface WizardProps {
  onSubmit: (data: {
    destination: 'taipei' | 'banqiao';
    ticketPrice: number;
  }) => void;
  onCancel: () => void;
}

export const LinKouWizard: React.FC<WizardProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: 'taipei' as 'taipei' | 'banqiao',
    ticketPrice: 0,
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.destination) {
        alert("請選擇實際搭車地點。");
        return;
      }
      if (formData.ticketPrice <= 0 || isNaN(formData.ticketPrice)) {
        alert("請輸入有效的高鐵票價金額。");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const calculateReimbursement = () => {
    const taxiFare = 410; // 林口廠 -> 板橋高鐵站
    let deduction = 0;
    if (formData.destination === 'taipei') {
      deduction = 40; // 台北 -> 板橋
    }
    const finalAmount = formData.ticketPrice - deduction;
    return { taxiFare, deduction, finalAmount };
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-4 text-center">步驟 1: 輸入出差資訊</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">實際搭車地點</label>
                <div className="flex space-x-2">
                  <button onClick={() => setFormData({...formData, destination: 'banqiao'})} className={`flex-1 py-2 rounded-lg transition-colors ${formData.destination === 'banqiao' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>板橋高鐵站</button>
                  <button onClick={() => setFormData({...formData, destination: 'taipei'})} className={`flex-1 py-2 rounded-lg transition-colors ${formData.destination === 'taipei' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>台北高鐵站</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="ticket-price">實際高鐵票價</label>
                <input id="ticket-price" type="number" value={formData.ticketPrice || ''} onChange={e => setFormData({...formData, ticketPrice: parseInt(e.target.value, 10)})} placeholder="請輸入金額" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"/>
              </div>
            </div>
          </div>
        );
      case 2:
        const { taxiFare, deduction, finalAmount } = calculateReimbursement();
        return (
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-4 text-center">步驟 2: 費用試算結果</h3>
            <div className="bg-gray-800 p-4 rounded-lg space-y-3 text-gray-200">
               <p>根據規定，林口廠出差應由最近的<span className="text-yellow-300 font-semibold">板橋高鐵站</span>搭車。</p>
                <div className="border-t border-gray-700 pt-3">
                    <p className="flex justify-between">計程車費 (林口廠到板橋站): <span className="font-mono text-cyan-300">{taxiFare} 元</span></p>
                    <p className="flex justify-between">您實際的高鐵票價: <span className="font-mono text-cyan-300">{formData.ticketPrice} 元</span></p>
                    {deduction > 0 && <p className="flex justify-between text-red-400">需扣除 (台北-板橋) 差額: <span className="font-mono">-{deduction} 元</span></p>}
                    <p className="flex justify-between border-t border-gray-600 mt-2 pt-2 text-lg font-bold">可報支高鐵票價: <span className="font-mono text-green-400">{finalAmount} 元</span></p>
                </div>
                 <p className="text-xs text-gray-400 pt-2">注意：此為試算結果，實際報銷金額以會計審核為準。</p>
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
