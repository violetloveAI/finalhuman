import { AlertTriangle, Fingerprint } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function ShockModal({ onClose }: Props) {
  return (
    <div className="shock-backdrop" onClick={onClose}>
      <div className="shock-rays" />
      <div className="shock-pop" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="shock-badge">
          <AlertTriangle size={16} /> 异常发现
        </div>
        <h2 className="shock-title">「王总」没有联系方式！</h2>
        <div className="shock-contrast">
          <p className="shock-flash">就在刚才，全员还在为这位「高意向客户」欢呼——</p>
          <p className="shock-now">而现在，交付 AI 的名单上，他的联系方式一栏，是空的。</p>
        </div>
        <p className="shock-question">一个被捧上首位的客户，为什么谁也联系不上他？</p>
        <button className="btn btn-danger btn-xl shock-confirm" onClick={onClose}>
          <Fingerprint size={18} /> 继续查下去
        </button>
      </div>
    </div>
  );
}
