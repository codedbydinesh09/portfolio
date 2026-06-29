
export interface ParsedSkillData {
  iconName?: string;
  customIcon?: string;
  level: number;
  experience?: string;
  projects: number;
  description?: string;
  accentColor?: string;
  featured: boolean;
}

export const parseSkillData = (iconStr: string | undefined): ParsedSkillData => {
  if (!iconStr) {
    return {
      iconName: '',
      customIcon: '',
      level: 0,
      experience: '0 Yrs',
      projects: 0,
      description: '',
      accentColor: '#319795',
      featured: false
    };
  }
  
  try {
    const data = JSON.parse(iconStr);
    if (typeof data === 'object' && data !== null) {
      return {
        iconName: data.iconName || '',
        customIcon: data.customIcon || '',
        level: Number(data.level) || 0,
        experience: data.experience || '',
        projects: Number(data.projects) || 0,
        description: data.description || '',
        accentColor: data.accentColor || '#319795',
        featured: Boolean(data.featured)
      };
    }
  } catch (e) {
    // If it's a legacy string like "FaReact", use it as iconName
    return {
      iconName: iconStr,
      customIcon: '',
      level: 0,
      experience: '0 Yrs',
      projects: 0,
      description: '',
      accentColor: '#319795',
      featured: false
    };
  }
  
  return {
    iconName: '',
    customIcon: '',
    level: 0,
    experience: '0 Yrs',
    projects: 0,
    description: '',
    accentColor: '#319795',
    featured: false
  };
};

export const stringifySkillData = (data: Partial<ParsedSkillData>): string => {
  return JSON.stringify({
    iconName: data.iconName,
    customIcon: data.customIcon,
    level: data.level,
    experience: data.experience,
    projects: data.projects,
    description: data.description,
    accentColor: data.accentColor,
    featured: data.featured
  });
};
