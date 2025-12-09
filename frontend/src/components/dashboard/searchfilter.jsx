import { Filters } from "../ui/filters";
import SearchAutocomplete from '../ui/searchbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export const SearchFilter = () => {
const metalValues = ['Metal', 'Arsenic', 'Zinc', 'Nickel', 'Cadnium', 'Lead'];
   const regionValues = ['Place', 'Mayur Vihar', 'GK-2', 'Burari', 'Janakpuri', 'Daulatpur'];

    return (
        
        <div className='search-filter-container'>
            <ThemeProvider theme={theme}>
                <div style={{ width: 400, padding: 2 }}>
                    <SearchAutocomplete />
                </div>
            </ThemeProvider>
            <Filters values={metalValues} />  
            <Filters values={regionValues} />
        </div>
    );
}