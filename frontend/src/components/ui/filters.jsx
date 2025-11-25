import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useCustomFilterOptions } from './CustomFilter';
import { ChevronDown } from 'lucide-react';

export const Filters = ({ options = [] }) => {
    return (
        <div className="flex gap-4 items-center">
            <div className="relative">
                <select className="custom-select">
                    <option>Region</option>
                    <option>Gurgaon</option>
                    <option>Delhi</option>
                    <option>Greater Noida</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <ChevronDown size={20} color="black" />
                </div>
            </div>

            <div className="relative">
                <select className="custom-select">
                    <option>Year</option>
                    <option>2025</option>
                    <option>2024</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <ChevronDown size={20} color="black" />
                </div>
            </div>

            <div className="relative">
                <select className="custom-select">
                    <option>Metal</option>
                    <option>Lead</option>
                    <option>Arsenic</option>
                    <option>Mercury</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <ChevronDown size={20} color="black" />
                </div>
            </div>
        </div>
    );
};
