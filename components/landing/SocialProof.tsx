import React from 'react';
import { IMAGES } from './constants';

const SocialProof: React.FC = () => {
    return (
        <section className="bg-surface-dark py-8 border-y border-[#3a2822]">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-4">

                    <div className="flex items-center gap-1">
                        <div className="flex text-primary">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="material-symbols-outlined fill-current text-xl">star</span>
                            ))}
                        </div>
                        <span className="text-white font-bold text-lg ml-2">4.9/5</span>
                    </div>

                    <p className="text-text-muted text-sm">
                        Junte-se a <span className="text-white font-bold">milhares de exploradores</span> que já encontraram seu caminho.
                    </p>

                    <div className="flex -space-x-3 overflow-hidden p-1">
                        {IMAGES.avatars.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`User avatar ${index + 1}`}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover"
                            />
                        ))}
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] bg-primary text-white text-[10px] font-bold">
                            +10k
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SocialProof;
