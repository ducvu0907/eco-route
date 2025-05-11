import { OsmResponse } from "@/types/types";

interface SearchDropdownProps {
  isOpen: boolean;
  results: OsmResponse[];
  onSelect: (item: OsmResponse) => void;
}

export default function SearchDropdown({ isOpen, results, onSelect }: SearchDropdownProps) {
  if (!isOpen || !results) return null;

  return (
    <ul className="divide-y divide-slate-200">
      {results.map((item, index) => (
        <li
          key={index}
          onClick={() => onSelect(item)}
          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
        >
          {item.display_name}
        </li>
      ))}
    </ul>
  );
}
