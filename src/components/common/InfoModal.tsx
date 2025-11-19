import { createPortal } from "react-dom";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  content,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: InfoModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A2332] border border-[#3E4652] w-[clamp(400px,90vw,500px)] max-h-[clamp(300px,60vh,400px)] overflow-hidden rounded-lg">
        {/* 모달 헤더 */}
        <div className="p-6 text-center">
          <h2 className="text-[#E5E7EB] font-bold text-[clamp(1.125rem,1.5vw,1.25rem)]">
            {title}
          </h2>
        </div>

        {/* 모달 본문 */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <div
              className="text-white text-[clamp(0.875rem,1.2vw,1rem)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* 모달 하단 버튼 */}
        <div className="p-6 flex justify-center gap-4">
          {onCancel && (
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-500 text-white font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-gray-600 transition-colors rounded-lg"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-[#0F079F] text-white font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-[#3C33C2] transition-colors rounded-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
