import React from 'react';
import Icon from '../Icon';
import AddConnectionForm from './AddConnectionForm';

interface AddConnectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddConnectionSheet: React.FC<AddConnectionSheetProps> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const handleSave = (data: any) => {
        onSave(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Card Sheet */}
            <div className="relative w-full max-w-md bg-[#1C1C1E] md:rounded-3xl rounded-t-3xl border-t border-white/10 p-6 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">

                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6 opacity-50"></div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">Nova Conexão</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white">
                        <Icon name="close" className="text-xl" />
                    </button>
                </div>

                <AddConnectionForm onSave={handleSave} />

                <div className="h-16 md:h-0"></div> {/* Safe area boosted for mobile */}
            </div>
        </div>
    );
};

export default AddConnectionSheet;
