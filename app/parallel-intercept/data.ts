export type Photo = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  emoji: string;
  desc: string;
};

export const photos: Photo[] = [
  {
    id: '1',
    title: '山间晨雾',
    subtitle: 'Mountain Mist',
    color: 'from-blue-400 to-cyan-500',
    emoji: '🏔️',
    desc: '清晨的阳光穿透薄雾，将山谷染成金橙色，远处的松林在云雾中若隐若现，宁静而壮阔。',
  },
  {
    id: '2',
    title: '城市夜景',
    subtitle: 'City Nights',
    color: 'from-purple-500 to-indigo-600',
    emoji: '🌃',
    desc: '万家灯火倒映在湿润的街面上，霓虹与星光交织，城市在夜晚展现出另一种迷人的生命力。',
  },
  {
    id: '3',
    title: '海浪涌礁',
    subtitle: 'Ocean Surge',
    color: 'from-teal-400 to-emerald-500',
    emoji: '🌊',
    desc: '汹涌的海浪拍打在礁石上迸发出洁白的浪花，盐雾弥漫，海天相接处一片蔚蓝深邃。',
  },
  {
    id: '4',
    title: '秋林金黄',
    subtitle: 'Autumn Gold',
    color: 'from-amber-400 to-orange-500',
    emoji: '🍂',
    desc: '枫树与银杏竞相变色，整片山坡铺满红黄交错的叶浪，秋风一吹，落叶如蝶翩翩起舞。',
  },
  {
    id: '5',
    title: '沙漠星空',
    subtitle: 'Desert Stars',
    color: 'from-slate-700 to-violet-900',
    emoji: '🌌',
    desc: '远离城市光污染的沙漠上空，银河横贯苍穹，数以万计的星点在漆黑的夜幕下熠熠生辉。',
  },
  {
    id: '6',
    title: '樱花烂漫',
    subtitle: 'Cherry Blossom',
    color: 'from-pink-300 to-rose-400',
    emoji: '🌸',
    desc: '粉白相间的樱花如云似雪，微风轻抚，花瓣飘落如雨，走在其间仿佛置身粉色的梦境之中。',
  },
];

export function getPhotoById(id: string): Photo | undefined {
  return photos.find((p) => p.id === id);
}
