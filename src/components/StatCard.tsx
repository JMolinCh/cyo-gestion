import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  colorTheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorTheme = 'blue',
  onClick,
}: StatCardProps) {
  const themeClasses = {
    blue: {
      bg: 'bg-blue-50/70 text-blue-700 border-blue-100',
      iconBg: 'bg-blue-600 text-white',
      accent: 'border-l-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'border-l-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-600 text-white',
      accent: 'border-l-amber-600',
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-700 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
      accent: 'border-l-purple-600',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-700 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
      accent: 'border-l-rose-600',
    },
  }[colorTheme];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden border-l-4 ${themeClasses.accent} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl shadow-sm ${themeClasses.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-2">
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
            {subtitle}
          </p>
        )}
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trend.isNeutral
                ? 'bg-slate-100 text-slate-700'
                : trend.isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend.isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
