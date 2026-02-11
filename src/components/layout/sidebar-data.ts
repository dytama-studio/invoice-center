// sidebar-data.ts
import {
  ChartNoAxesCombinedIcon,
  HashIcon,
  ClipboardListIcon,
  ArrowRightLeftIcon,
  ChartPieIcon,
  SettingsIcon,
} from 'lucide-react';

export const sidebarNav = [
  {
    label: 'Dashboard',
    href: '/home',
    icon: ChartNoAxesCombinedIcon,
  },
  {
    label: 'Master Data',
    icon: HashIcon,
    isChild: true,
    child: [
      { label: 'Commodities', href: '/master/commodities' },
      { label: 'Companies', href: '/master/companies' },
      { label: 'Mills', href: '/master/mills' },
      { label: 'Regions', href: '/master/regions' },
      { label: 'Quality Specs', href: '/master/quality-specs' },
    ],
  },
  {
    label: 'Contracts',
    href: '/contracts',
    icon: ClipboardListIcon,
  },
  {
    label: 'Proforma',
    href: '/proforma',
    icon: ArrowRightLeftIcon,
  },
  {
    label: 'Invoices',
    href: '/invoices',
    icon: ChartPieIcon,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];
