import type { IAchievement } from 'src/components/AchievementToast'; // Используем абсолютный путь

// Определяем ачивки
const ACHIEVEMENTS_CONFIG: Record<string, { threshold: number; achievement: IAchievement }> = {
  'Финансы': { threshold: 2, achievement: { category: 'Финансы', title: 'Финансовый гуру', icon: '🏆' } },
  'Транспорт': { threshold: 2, achievement: { category: 'Транспорт', title: 'Повелитель дорог', icon: '🚗' } },
  'Игры': { threshold: 1, achievement: { category: 'Игры', title: 'Начинающий геймер', icon: '🎮' } },
  'Общение': { threshold: 1, achievement: { category: 'Общение', title: 'Душа компании', icon: '💬' } },
  'Развлечения': { threshold: 2, achievement: { category: 'Развлечения', title: 'Король вечеринок', icon: '🎬' } },
};

type Progress = Record<string, Set<number>>;

export const trackAppView = (appId: number, category: string): IAchievement | null => {
  const progress = getProgress();
  const achievements = getUnlockedAchievements();

  if (!ACHIEVEMENTS_CONFIG[category] || hasAchievement(category, achievements)) {
    return null;
  }

  if (!progress[category]) {
    progress[category] = new Set();
  }
  progress[category].add(appId);
  saveProgress(progress);

  const config = ACHIEVEMENTS_CONFIG[category];
  if (progress[category].size >= config.threshold) {
    unlockAchievement(config.achievement);
    return config.achievement;
  }

  return null;
};

const getProgress = (): Progress => {
  const stored = localStorage.getItem('achievement_progress');
  if (!stored) return {};
  const obj = JSON.parse(stored);
  Object.keys(obj).forEach(key => {
    obj[key] = new Set(obj[key]);
  });
  return obj;
};

const saveProgress = (progress: Progress) => {
  const obj: Record<string, number[]> = {};
  Object.keys(progress).forEach(key => {
    obj[key] = Array.from(progress[key]);
  });
  localStorage.setItem('achievement_progress', JSON.stringify(obj));
};

const getUnlockedAchievements = (): IAchievement[] => {
  const stored = localStorage.getItem('unlocked_achievements');
  return stored ? JSON.parse(stored) : [];
};

const unlockAchievement = (achievement: IAchievement) => {
  const achievements = getUnlockedAchievements();
  if (!hasAchievement(achievement.category, achievements)) {
    achievements.push(achievement);
    localStorage.setItem('unlocked_achievements', JSON.stringify(achievements));
  }
};

const hasAchievement = (category: string, achievements: IAchievement[]): boolean => {
  return achievements.some(ach => ach.category === category);
};