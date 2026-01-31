import React from 'react';
import { IMAGES } from './constants';

const SocialProof: React.FC = () => {
    return (
        <section className="bg-surface-dark py-8 border-y border-[#3a2822]">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-4">

                    <div className="flex items-center gap-1">
                        <div className="flex text-[#FFD700]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            ))}
                        </div>
                        <span className="text-white font-bold text-lg ml-2">4.9/5</span>
                    </div>

                    <p className="text-text-muted text-sm">
                        Junte-se a <span className="text-white font-bold">milhares de exploradores</span> que já encontraram seu caminho.
                    </p>

                    <div className="flex -space-x-3 overflow-hidden p-1">
                        {[
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces",
                            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=faces",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                        ].map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`User  ${index + 1}`}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover bg-[#2a1e1a]"
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SocialProof;
