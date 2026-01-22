import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Lightbulb, Share2, Heart, Bookmark, Activity } from 'lucide-react';

const FEED_DATA = [
    {
        id: 1,
        category: 'Neuroscience',
        title: 'The 20% Rule',
        content: 'Did you know your brain consumes about 20% of your body\'s total energy, despite only weighing about 3 pounds? This is why deep focus can feel physically exhausting.',
        icon: Brain,
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        likes: 124
    },
    {
        id: 2,
        category: 'Productivity',
        title: 'The Pomodoro Technique',
        content: 'Work for 25 minutes, then take a 5-minute break. This cycle keeps your brain fresh and prevents cognitive fatigue. After 4 cycles, take a longer 15-30 minute break.',
        icon: Lightbulb,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        likes: 89
    },
    {
        id: 3,
        category: 'Vocabulary',
        title: 'Neuroplasticity',
        content: 'The ability of the brain to form and reorganize synaptic connections, especially in response to learning or experience. You can literally rewire your brain at any age!',
        icon: BookOpen,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        likes: 256
    },
    {
        id: 4,
        category: 'Health',
        title: 'Sleep & Memory',
        content: 'Sleep is when your brain consolidates memories. Pulling an all-nighter to study is often counterproductive because your brain needs sleep to store what you learned.',
        icon: Brain,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        likes: 142
    },
    {
        id: 5,
        category: 'Focus',
        title: 'Multitasking Myth',
        content: 'The human brain cannot truly multitask. It just switches tasks very quickly, which reduces efficiency by up to 40%. Single-tasking is the secret to speed.',
        icon: Lightbulb,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        likes: 198
    },
    {
        id: 6,
        category: 'Psychology',
        title: 'The Zeigarnik Effect',
        content: 'Unfinished tasks tend to stick in your memory better than completed ones. This is why cliffhangers work so well in TV shows!',
        icon: Brain,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        likes: 156
    },
    {
        id: 7,
        category: 'Learning',
        title: 'Spaced Repetition',
        content: 'Reviewing information at increasing intervals is the most effective way to move it from short-term to long-term memory.',
        icon: BookOpen,
        color: 'text-teal-500',
        bgColor: 'bg-teal-500/10',
        likes: 210
    },
    {
        id: 8,
        category: 'Mindset',
        title: 'Growth Mindset',
        content: 'Believing that your abilities can be developed through dedication and hard work is the starting point of all great accomplishment.',
        icon: Lightbulb,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        likes: 180
    },
    {
        id: 9,
        category: 'Nutrition',
        title: 'Brain Food',
        content: 'Omega-3 fatty acids, found in fish like salmon, are essential for brain health. They help build brain and nerve cells, and are essential for learning and memory.',
        icon: Brain,
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10',
        likes: 167
    },
    {
        id: 10,
        category: 'Exercise',
        title: 'BDNF Boost',
        content: 'Aerobic exercise boosts the production of BDNF (Brain-Derived Neurotrophic Factor), a protein that acts like fertilizer for your brain, promoting the growth of new neurons.',
        icon: Activity,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
        likes: 203
    },
    {
        id: 11,
        category: 'Mindfulness',
        title: 'Meditation Benefits',
        content: 'Regular meditation has been shown to increase the thickness of the prefrontal cortex, the area of the brain responsible for planning, problem-solving, and emotional regulation.',
        icon: Lightbulb,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        likes: 189
    },
    {
        id: 12,
        category: 'Habits',
        title: 'The 66-Day Rule',
        content: 'Contrary to the popular 21-day myth, research suggests it takes an average of 66 days to form a new habit. Be patient with yourself!',
        icon: BookOpen,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        likes: 145
    },
    {
        id: 13,
        category: 'Creativity',
        title: 'Divergent Thinking',
        content: 'Creativity isn\'t just a talent; it\'s a skill. Practice "divergent thinking" by brainstorming as many uses as possible for a common object, like a paperclip.',
        icon: Lightbulb,
        color: 'text-fuchsia-500',
        bgColor: 'bg-fuchsia-500/10',
        likes: 176
    },
    {
        id: 14,
        category: 'Social',
        title: 'Social Brain',
        content: 'Socializing is a major brain workout. Navigating complex social interactions requires memory, attention, and emotional intelligence, keeping your brain sharp.',
        icon: Heart,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        likes: 154
    },
    {
        id: 15,
        category: 'Music',
        title: 'Mozart Effect',
        content: 'Listening to music can engage nearly every area of the brain at once. Playing an instrument is equivalent to a full-body workout for the brain.',
        icon: Brain,
        color: 'text-sky-500',
        bgColor: 'bg-sky-500/10',
        likes: 192
    },
    {
        id: 16,
        category: 'Learning',
        title: 'Feynman Technique',
        content: 'The best way to learn something is to teach it. Try explaining a complex concept in simple terms to a child (or an imaginary one). If you get stuck, you have gaps to fill.',
        icon: BookOpen,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        likes: 215
    },
    {
        id: 17,
        category: 'Sleep',
        title: 'Power Naps',
        content: 'A 20-minute power nap can boost alertness and motor learning skills. However, napping longer than 30 minutes can lead to sleep inertia (grogginess).',
        icon: Brain,
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-400/10',
        likes: 134
    },
    {
        id: 18,
        category: 'Focus',
        title: 'Deep Work',
        content: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It\'s a superpower in our distracted economy.',
        icon: Lightbulb,
        color: 'text-blue-600',
        bgColor: 'bg-blue-600/10',
        likes: 221
    }
];

const getDailyContent = () => {
    // Simple rotation based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Rotate the array based on the day
    const rotation = dayOfYear % FEED_DATA.length;

    // Return 3 items starting from the rotation index
    const items = [];
    for (let i = 0; i < 3; i++) {
        items.push(FEED_DATA[(rotation + i) % FEED_DATA.length]);
    }
    return items;
};

const FeedCard = ({ item, index }) => {
    const [liked, setLiked] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 hover:border-slate-700 transition shadow-lg"
        >
            <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${item.bgColor} mr-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className={`text-sm font-bold ${item.color}`}>{item.category}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
                {item.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex gap-4">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-2 text-sm transition ${liked ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        <span>{item.likes + (liked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                </div>
                <button className="text-slate-500 hover:text-blue-400 transition">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

const KnowledgeFeed = () => {
    const [dailyItems, setDailyItems] = useState([]);

    useEffect(() => {
        setDailyItems(getDailyContent());
    }, []);

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {dailyItems.map((item, index) => (
                <FeedCard key={item.id} item={item} index={index} />
            ))}

            <div className="text-center text-slate-500 mt-8 mb-12">
                <p>You're all caught up!</p>
                <p className="text-sm mt-2">Check back tomorrow for more brain food.</p>
            </div>
        </div>
    );
};

export default KnowledgeFeed;
