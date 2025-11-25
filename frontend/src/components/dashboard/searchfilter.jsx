import { Filters } from "../ui/filters";
import SearchAutocomplete from '../ui/searchbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export const SearchFilter = () => {
    return (
        <div className='search-filter-container'>
            <ThemeProvider theme={theme}>
                <div style={{ width: 400, padding: 2 }}>
                    <SearchAutocomplete />
                </div>
            </ThemeProvider>
            <Filters options={[{ title: 'Metal' }, { title: 'Region' }, { title: 'Date Range' }]} />
        </div>
    );
}