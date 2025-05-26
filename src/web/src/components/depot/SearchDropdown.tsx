import { Feature } from "@/types/types";
import { MapPin } from "lucide-react";

interface SearchDropdownProps {
  isOpen: boolean;
  results: Feature[];
  onSelect: (item: Feature) => void;
}

export default function SearchDropdown({ isOpen, results, onSelect }: SearchDropdownProps) {
  if (!isOpen || !results) return null;

  return (
    <div className="max-h-60 overflow-y-auto">
      <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50 border-b border-slate-100">
        {results.length} location{results.length !== 1 ? 's' : ''} found
      </div>
      <ul className="divide-y divide-slate-100">
        {results.map((item, index) => (
          <li
            key={index}
            onClick={() => onSelect(item)}
            className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors group"
          >
            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900 line-clamp-2">
                {item.properties.label}
              </p>
              {item.properties.context && (
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {item.properties.context}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}