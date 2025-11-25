import { createFilterOptions } from '@mui/material/Autocomplete';

/**
 * Creates a filterOptions function for Autocomplete.
 * Adjust the config as needed for your app.
 * - ignoreAccents: remove diacritics
 * - ignoreCase: lowercase both sides
 * - limit: max number of shown options
 * - matchFrom: 'any' | 'start'
 * - stringify: function to extract the string from your option
 * - trim: remove trailing spaces
 */
export const useCustomFilterOptions = (config = {}) => {
    // You can customize defaults here
    const filterOptions = createFilterOptions({
        ignoreAccents: config.ignoreAccents ?? true,
        ignoreCase: config.ignoreCase ?? true,
        limit: config.limit ?? null,
        matchFrom: config.matchFrom ?? 'any',
        stringify: config.stringify ?? ((option) =>
            typeof option === 'string' ? option : option?.title ?? ''),
        trim: config.trim ?? false
    });

    return filterOptions;
};